import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, CreditCard, MapPin, Package } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderWithItems } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDate, formatDateTime } from "@/lib/utils";
import { formatPickupDate } from "@/lib/delivery";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { RepeatOrderButton } from "@/components/account/repeat-order-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Детали заказа" };

const pickupSteps = ["Принят", "Собираем", "Готов", "Получен"];
const deliverySteps = ["Принят", "Собираем", "В пути", "Доставлен"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (await getCurrentUser())!;
  const result = await getOrderWithItems(id);
  if (!result || result.order.userId !== user.id) notFound();
  const { order, items } = result;
  const steps = order.deliveryType === "PICKUP" ? pickupSteps : deliverySteps;
  const currentStep = ORDER_STATUSES[order.status]?.step ?? 0;

  return (
    <div className="space-y-5">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-brand-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Все заказы
      </Link>

      <div className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold">Заказ {order.number}</h1>
            <p className="mt-1 text-[12px] text-muted">Оформлен {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
            <span className={cn("badge", PAYMENT_STATUSES[order.paymentStatus]?.tone)}>{PAYMENT_STATUSES[order.paymentStatus]?.label}</span>
          </div>
        </div>

        {order.status !== "CANCELLED" && (
          <div className="mt-6 flex items-center justify-between gap-1">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-1 flex-col items-center text-center">
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold", index <= currentStep ? "bg-brand-900 text-cream" : "bg-cream text-muted")}>
                  {index < currentStep ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className={cn("mt-1.5 text-[10px] font-semibold", index <= currentStep ? "text-ink" : "text-muted")}>{step}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {order.deliveryType === "PICKUP" ? <MapPin className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />} Получение
            </p>
            <p className="mt-1.5 text-[13px] font-semibold">{order.deliveryType === "PICKUP" ? site.address : order.addressText}</p>
            <p className="mt-1 text-[11.5px] text-muted">
              {order.deliveryType === "PICKUP"
                ? `${formatPickupDate(order.pickupDate)}, ${order.pickupSlot}`
                : order.deliveryZone}
            </p>
          </div>
          <div className="rounded-2xl bg-cream p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <CreditCard className="h-3.5 w-3.5" /> Оплата
            </p>
            <p className="mt-1.5 text-[13px] font-semibold">{order.paymentMethod === "ONLINE" ? "Картой онлайн" : "При получении"}</p>
            <p className="mt-1 text-[11.5px] text-muted">{PAYMENT_STATUSES[order.paymentStatus]?.label}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Состав заказа</h2>
          <RepeatOrderButton
            items={items.map((item) => ({
              productId: item.productId,
              slug: item.slug,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
              unit: item.unit,
            }))}
          />
        </div>
        <ul className="mt-3 divide-y divide-line/70">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                <Image src={item.image ?? "/images/store.jpg"} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.slug}`} className="truncate text-[12.5px] font-semibold text-ink hover:text-brand-900">{item.name}</Link>
                <p className="text-[10.5px] text-muted">{item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="text-[12.5px] font-bold">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-3 space-y-1.5 border-t border-line pt-4 text-[12.5px]">
          <div className="flex justify-between"><dt className="text-muted">Товары</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-brand-900"><dt>Скидка</dt><dd>−{formatPrice(order.discount)}</dd></div>}
          {order.bonusUsed > 0 && <div className="flex justify-between text-accent-700"><dt>Бонусы</dt><dd>−{formatPrice(order.bonusUsed)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">{order.deliveryType === "PICKUP" ? "Самовывоз" : "Доставка"}</dt><dd>{order.deliveryFee ? formatPrice(order.deliveryFee) : "бесплатно"}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-[15px]"><dt className="font-semibold">Итого</dt><dd className="price">{formatPrice(order.total)}</dd></div>
        </dl>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <Clock className="h-3.5 w-3.5" /> Вопрос по заказу — {site.phone}
      </p>
    </div>
  );
}
