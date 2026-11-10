import { and, eq, gte, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, users } from "@/db/schema";

export async function getRfmOrderRows(days?: number) {
  const db = await getDb();
  const since = days && days > 0 ? new Date(Date.now() - days * 86_400_000) : undefined;
  const where = and(eq(orders.paymentStatus, "PAID"), ne(orders.status, "CANCELLED"), since ? gte(orders.createdAt, since) : undefined);
  return db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      createdAt: orders.createdAt,
      total: orders.total,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(where);
}
