import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  bonusTransactions,
  orderItems,
  orders,
  products,
  users,
  type Order,
  type OrderItem,
} from "@/db/schema";
import { getLevel, calculateAccrual, maxBonusSpend, BONUS_RULES } from "./bonuses";
import { getPickupDays, quoteDelivery } from "./delivery";
import { validatePromo, usePromo } from "./promo";
import { createPayment } from "./payments";
import { sendEmail, sendSms } from "./notifications";
import type { CheckoutInput } from "./validation";

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

async function nextOrderNumber(): Promise<string> {
  const db = await getDb();
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `IM-${year}-${String(100 + (row?.count ?? 0) + attempt).padStart(6, "0")}`;
    const [existing] = await db.select({ id: orders.id }).from(orders).where(eq(orders.number, candidate)).limit(1);
    if (!existing) return candidate;
  }
  return `IM-${year}-${Date.now().toString().slice(-6)}`;
}

export type CreateOrderResult = {
  order: Order;
  items: OrderItem[];
  paymentUrl: string | null;
  demoPayment: boolean;
  bonusEarnedPreview: number;
};

export async function createOrder(userId: string | null, input: CheckoutInput): Promise<CreateOrderResult> {
  const db = await getDb();
  const ids = [...new Set(input.items.map((item) => item.productId))];
  const found = await db.select().from(products).where(inArray(products.id, ids));
  if (found.length !== ids.length) throw new OrderError("Некоторые товары больше недоступны", 409);

  const byId = new Map(found.map((product) => [product.id, product]));
  const lines = input.items.map((item) => {
    const product = byId.get(item.productId);
    if (!product || !product.isActive) throw new OrderError(`Товар недоступен: ${product?.name ?? item.productId}`, 409);
    if (product.stock < item.quantity) throw new OrderError(`«${product.name}»: осталось ${product.stock} шт.`, 409);
    return {
      product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  if (subtotal <= 0) throw new OrderError("Корзина пуста");

  // Промокод
  let discount = 0;
  let promoCode: string | null = null;
  if (input.promoCode) {
    const promo = await validatePromo(db, input.promoCode, subtotal);
    if (!promo.ok) throw new OrderError(promo.error);
    discount = promo.discount;
    promoCode = promo.code;
  }

  // Доставка
  let deliveryFee = 0;
  let deliveryZoneName: string | null = null;
  if (input.deliveryType === "DELIVERY") {
    if (process.env.NEXT_PUBLIC_DELIVERY_ENABLED === "false") {
      throw new OrderError("Доставка временно недоступна, выберите самовывоз");
    }
    const quote = quoteDelivery(subtotal, input.deliveryZoneId);
    if (quote.error) throw new OrderError(quote.error);
    deliveryFee = quote.fee;
    deliveryZoneName = quote.eta ? (input.deliveryZoneId ?? null) : null;
  } else {
    const allowedDates = getPickupDays(7).map((day) => day.date);
    if (!input.pickupDate || !allowedDates.includes(input.pickupDate)) {
      throw new OrderError("Выберите корректную дату самовывоза");
    }
    if (!input.pickupSlot) throw new OrderError("Выберите интервал самовывоза");
  }

  // Бонусы
  let bonusUsed = 0;
  if (userId && input.bonusToUse > 0) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new OrderError("Пользователь не найден", 401);
    bonusUsed = Math.min(input.bonusToUse, maxBonusSpend(subtotal, user.bonusBalance));
  }

  const total = Math.max(0, subtotal - discount - bonusUsed + deliveryFee);
  const number = await nextOrderNumber();
  const isPickup = input.deliveryType === "PICKUP";

  const [order] = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(orders)
      .values({
        number,
        userId,
        customerName: input.customerName,
        phone: input.phone,
        email: input.email,
        status: "NEW",
        subtotal,
        discount,
        bonusUsed,
        deliveryFee,
        total,
        deliveryType: input.deliveryType,
        deliveryZone: deliveryZoneName,
        addressText: isPickup ? null : input.addressText || null,
        pickupDate: isPickup ? input.pickupDate! : null,
        pickupSlot: isPickup ? input.pickupSlot! : null,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PENDING",
        promoCode,
        comment: input.comment || null,
      })
      .returning();

    await tx.insert(orderItems).values(
      lines.map((line) => ({
        orderId: created.id,
        productId: line.product.id,
        name: line.product.name,
        slug: line.product.slug,
        image: line.product.images[0] ?? null,
        unit: line.product.unit,
        price: line.product.price,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      })),
    );

    for (const line of lines) {
      await tx
        .update(products)
        .set({ stock: sql`greatest(${products.stock} - ${line.quantity}, 0)`, updatedAt: new Date() })
        .where(eq(products.id, line.product.id));
    }

    if (promoCode) await usePromo(tx as never, promoCode);

    if (userId && bonusUsed > 0) {
      await tx
        .update(users)
        .set({ bonusBalance: sql`${users.bonusBalance} - ${bonusUsed}`, updatedAt: new Date() })
        .where(eq(users.id, userId));
      await tx.insert(bonusTransactions).values({
        userId,
        amount: -bonusUsed,
        type: "SPEND",
        orderId: created.id,
        description: `Оплата бонусами заказа ${created.number}`,
      });
    }

    return [created];
  });

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  let paymentUrl: string | null = null;
  let demoPayment = false;
  if (input.paymentMethod === "ONLINE") {
    try {
      const payment = await createPayment({
        orderId: order.id,
        orderNumber: order.number,
        amount: total,
        description: `Заказ ${order.number}`,
        email: order.email,
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/checkout/success/${order.id}`,
      });
      paymentUrl = payment.confirmationUrl;
      demoPayment = payment.demo;
      await db.update(orders).set({ paymentId: payment.paymentId }).where(eq(orders.id, order.id));
    } catch (error) {
      console.error("[payment] create failed", error);
      await db
        .update(orders)
        .set({ paymentMethod: "ON_RECEIPT", comment: `${order.comment ?? ""}\nОнлайн-оплата недоступна, оплата при получении.`.trim() })
        .where(eq(orders.id, order.id));
      paymentUrl = null;
    }
  }

  await sendEmail({
    to: order.email,
    subject: `Заказ ${order.number} принят`,
    text: `Спасибо! Мы приняли заказ ${order.number} на сумму ${total} ₽. ${
      isPickup ? `Самовывоз: ${input.pickupDate}, ${input.pickupSlot}.` : "Доставка по указанному адресу."
    } Статус заказа — в личном кабинете.`,
  });
  await sendSms(order.phone, `Ирбис Март: заказ ${order.number} принят. Сумма ${total} ₽.`);

  return {
    order,
    items,
    paymentUrl,
    demoPayment,
    bonusEarnedPreview: userId ? calculateAccrual(total - deliveryFee) : 0,
  };
}

export async function markOrderPaid(orderId: string, paymentId?: string): Promise<Order> {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new OrderError("Заказ не найден", 404);
  if (order.paymentStatus === "PAID") return order;
  if (order.status === "CANCELLED") throw new OrderError("Заказ отменён", 409);

  const now = new Date();
  const [updated] = await db
    .update(orders)
    .set({
      paymentStatus: "PAID",
      status: order.status === "NEW" ? "PROCESSING" : order.status,
      paidAt: now,
      updatedAt: now,
      paymentId: paymentId ?? order.paymentId,
    })
    .where(eq(orders.id, order.id))
    .returning();

  if (order.userId) {
    const spent =
      (
        await db
          .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
          .from(orders)
          .where(and(eq(orders.userId, order.userId), eq(orders.paymentStatus, "PAID")))
      )[0]?.total ?? 0;
    const level = getLevel(Math.max(0, spent - order.total));
    const accrued = calculateAccrual(Math.max(0, order.total - order.deliveryFee), level.multiplier);

    if (accrued > 0) {
      await db.insert(bonusTransactions).values({
        userId: order.userId,
        amount: accrued,
        type: "ACCRUAL",
        orderId: order.id,
        description: `Начисление за заказ ${order.number}`,
        expiresAt: new Date(now.getTime() + BONUS_RULES.ttlDays * 24 * 60 * 60 * 1000),
      });
      await db
        .update(users)
        .set({ bonusBalance: sql`${users.bonusBalance} + ${accrued}`, updatedAt: now })
        .where(eq(users.id, order.userId));
    }
  }

  await sendEmail({
    to: order.email,
    subject: `Заказ ${order.number} оплачен`,
    text: `Оплата по заказу ${order.number} прошла успешно. Мы начали собирать заказ.`,
  });

  return updated;
}

export async function cancelOrder(orderId: string, reason = "Отменён магазином"): Promise<Order> {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new OrderError("Заказ не найден", 404);
  if (order.status === "COMPLETED") throw new OrderError("Выполненный заказ нельзя отменить", 409);
  if (order.status === "CANCELLED") return order;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  const [updated] = await db.transaction(async (tx) => {
    for (const item of items) {
      if (item.productId) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }
    }

    if (order.userId && order.bonusUsed > 0) {
      await tx
        .update(users)
        .set({ bonusBalance: sql`${users.bonusBalance} + ${order.bonusUsed}` })
        .where(eq(users.id, order.userId));
      await tx.insert(bonusTransactions).values({
        userId: order.userId,
        amount: order.bonusUsed,
        type: "REFUND",
        orderId: order.id,
        description: `Возврат бонусов по отменённому заказу ${order.number}`,
      });
    }

    if (order.userId && order.paymentStatus === "PAID") {
      const [accrual] = await tx
        .select()
        .from(bonusTransactions)
        .where(and(eq(bonusTransactions.orderId, order.id), eq(bonusTransactions.type, "ACCRUAL")))
        .limit(1);
      if (accrual) {
        await tx
          .update(users)
          .set({ bonusBalance: sql`greatest(${users.bonusBalance} - ${accrual.amount}, 0)` })
          .where(eq(users.id, order.userId));
        await tx.insert(bonusTransactions).values({
          userId: order.userId,
          amount: -accrual.amount,
          type: "EXPIRE",
          orderId: order.id,
          description: `Сторно бонусов по отменённому заказу ${order.number}`,
        });
      }
    }

    return tx
      .update(orders)
      .set({
        status: "CANCELLED",
        paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED",
        comment: `${order.comment ?? ""}\n${reason}`.trim(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();
  });

  await sendEmail({
    to: order.email,
    subject: `Заказ ${order.number} отменён`,
    text: `Заказ ${order.number} отменён. ${reason}. Если оплата прошла, возврат поступит в течение 3–5 рабочих дней.`,
  });

  return updated;
}

export async function setOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
  const db = await getDb();
  if (status === "CANCELLED") return cancelOrder(orderId);
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new OrderError("Заказ не найден", 404);

  if (status === "COMPLETED" && order.paymentMethod === "ON_RECEIPT" && order.paymentStatus !== "PAID") {
    await markOrderPaid(orderId);
  }

  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();
  return updated;
}
