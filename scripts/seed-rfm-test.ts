/**
 * Тестовые покупатели и оплаченные заказы для RFM.
 * Все данные помечены TEST-RFM и удаляются повторным запуском с RESET=1.
 */
import bcrypt from "bcryptjs";
import { inArray, like } from "drizzle-orm";
import { getDb } from "../src/db";
import { orderItems, orders, products, users } from "../src/db/schema";

const now = Date.now();
const DAY = 86_400_000;
let seed = 42;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = <T,>(items: T[]): T => items[Math.floor(rnd() * items.length)];
const between = (min: number, max: number) => Math.floor(min + rnd() * (max - min + 1));

const firstNames = ["Алексей", "Мария", "Ильдар", "Алия", "Сергей", "Екатерина", "Марат", "Гузель", "Дмитрий", "Ольга", "Ринат", "Наталья", "Айрат", "Лилия", "Михаил", "Анна", "Рустем", "Эльвира", "Павел", "Юлия", "Тимур", "Регина", "Андрей", "Динара", "Игорь"];
const lastNames = ["Иванов", "Габдуллина", "Хайруллин", "Сафин", "Кузнецов", "Фомина", "Насыбуллин", "Орлова", "Петров", "Смирнова", "Ахметов", "Валеева", "Зайцев", "Морозова", "Хабибуллин", "Гимаева", "Ковалёв", "Никитина", "Юсупов", "Шакирова", "Фёдоров", "Белова", "Тимофеев", "Гарипова", "Егоров"];

type Scenario = {
  key: string;
  count: number;
  ordersMin: number;
  ordersMax: number;
  recencyMin: number;
  recencyMax: number;
  amountMin: number;
  amountMax: number;
};

const scenarios: Scenario[] = [
  { key: "champions", count: 35, ordersMin: 6, ordersMax: 12, recencyMin: 0, recencyMax: 10, amountMin: 2200, amountMax: 7500 },
  { key: "loyal", count: 40, ordersMin: 3, ordersMax: 7, recencyMin: 8, recencyMax: 28, amountMin: 1100, amountMax: 4200 },
  { key: "new", count: 35, ordersMin: 1, ordersMax: 1, recencyMin: 0, recencyMax: 10, amountMin: 500, amountMax: 2800 },
  { key: "promising", count: 30, ordersMin: 2, ordersMax: 2, recencyMin: 4, recencyMax: 20, amountMin: 1900, amountMax: 6200 },
  { key: "cant-lose", count: 25, ordersMin: 6, ordersMax: 10, recencyMin: 45, recencyMax: 120, amountMin: 3000, amountMax: 9000 },
  { key: "at-risk", count: 30, ordersMin: 3, ordersMax: 6, recencyMin: 35, recencyMax: 120, amountMin: 900, amountMax: 3800 },
  { key: "hibernating", count: 30, ordersMin: 1, ordersMax: 2, recencyMin: 150, recencyMax: 420, amountMin: 300, amountMax: 1400 },
  { key: "attention", count: 25, ordersMin: 2, ordersMax: 4, recencyMin: 20, recencyMax: 90, amountMin: 500, amountMax: 2600 },
];

async function main() {
  const db = await getDb();
  const reset = process.env.RESET === "1" || process.env.REMOVE === "1";
  if (reset) {
    const testOrders = await db.select({ id: orders.id }).from(orders).where(like(orders.number, "TEST-RFM-%"));
    if (testOrders.length) await db.delete(orderItems).where(inArray(orderItems.orderId, testOrders.map((row) => row.id)));
    await db.delete(orders).where(like(orders.number, "TEST-RFM-%"));
    await db.delete(users).where(like(users.email, "test.rfm%@example.com"));
    console.log("removed previous TEST-RFM data");
  }

  if (process.env.REMOVE === "1") {
    console.log("TEST-RFM data removed");
    process.exit(0);
  }

  const productRows = await db.select({ id: products.id, name: products.name, slug: products.slug, image: products.images, unit: products.unit }).from(products).limit(300);
  if (!productRows.length) throw new Error("Нет товаров для тестовых заказов");

  const passwordHash = bcrypt.hashSync("TestRfm123!", 10);
  const createdUsers: Array<{ id: string; name: string; email: string; phone: string }> = [];
  let userIndex = 0;
  let orderIndex = 0;
  const orderValues: Array<typeof orders.$inferInsert> = [];
  const itemValues: Array<typeof orderItems.$inferInsert> = [];

  for (const scenario of scenarios) {
    for (let n = 0; n < scenario.count; n += 1) {
      userIndex += 1;
      const firstName = firstNames[(userIndex * 7) % firstNames.length];
      const lastName = lastNames[(userIndex * 11) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `test.rfm${String(userIndex).padStart(3, "0")}@example.com`;
      const phone = `+7999${String(1000000 + userIndex).slice(-7)}`;
      const userId = crypto.randomUUID();
      const created = new Date(now - (430 + between(0, 120)) * DAY);
      const ordersCount = between(scenario.ordersMin, scenario.ordersMax);
      const lastDays = between(scenario.recencyMin, scenario.recencyMax);
      const lastOrder = now - lastDays * DAY - between(0, 18) * 3_600_000;
      createdUsers.push({ id: userId, name, email, phone });

      const userOrders: Array<{ id: string; number: string; createdAt: Date; amount: number }> = [];
      for (let o = 0; o < ordersCount; o += 1) {
        orderIndex += 1;
        const createdAt = new Date(lastOrder - (ordersCount - 1 - o) * between(8, 42) * DAY - between(0, 14) * 3_600_000);
        const amount = between(scenario.amountMin, scenario.amountMax);
        const id = crypto.randomUUID();
        const number = `TEST-RFM-${String(orderIndex).padStart(5, "0")}`;
        const recent = Date.now() - createdAt.getTime() < 21 * DAY;
        userOrders.push({ id, number, createdAt, amount });
        orderValues.push({
          id,
          number,
          userId,
          customerName: name,
          phone,
          email,
          status: recent ? "PROCESSING" : "COMPLETED",
          subtotal: amount,
          discount: 0,
          bonusUsed: 0,
          deliveryFee: 0,
          total: amount,
          deliveryType: "PICKUP",
          paymentMethod: "ONLINE",
          paymentStatus: "PAID",
          paidAt: createdAt,
          comment: `TEST-RFM ${scenario.key}`,
          createdAt,
          updatedAt: createdAt,
        });
        const product = pick(productRows);
        itemValues.push({
          orderId: id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image?.[0] ?? null,
          unit: product.unit ?? "шт",
          price: amount,
          quantity: 1,
          lineTotal: amount,
        });
      }
    }
  }

  await db.insert(users).values(
    createdUsers.map((user, index) => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      passwordHash,
      name: user.name,
      role: "CUSTOMER" as const,
      bonusBalance: between(0, 900),
      marketingOptIn: true,
      referralCode: `RFM-TEST-${String(index + 1).padStart(4, "0")}`,
      createdAt: new Date(now - (430 + between(0, 120)) * DAY),
      updatedAt: new Date(),
    })),
  );

  for (let i = 0; i < orderValues.length; i += 100) await db.insert(orders).values(orderValues.slice(i, i + 100));
  for (let i = 0; i < itemValues.length; i += 200) await db.insert(orderItems).values(itemValues.slice(i, i + 200));

  console.log(`created ${createdUsers.length} customers, ${orderValues.length} paid orders, ${itemValues.length} items`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
