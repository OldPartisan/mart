import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { markOrderPaid } from "@/lib/orders";
import { isYooKassaEnabled } from "@/lib/payments";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({ orderId: z.string().uuid() });

/** Демо-касса: имитирует успешный вебхук. В продакшене маршрут отключён. */
export async function POST(request: Request) {
  try {
    if (isYooKassaEnabled()) return apiError("Демо-оплата отключена", 404);
    const limit = rateLimit(`mockpay:${clientIp(request)}`, 10, 60_000);
    if (!limit.ok) return apiError("Слишком много запросов", 429);

    const { orderId } = schema.parse(await request.json());
    const db = await getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return apiError("Заказ не найден", 404);
    if (order.paymentStatus === "PAID") return apiOk({ ok: true, alreadyPaid: true });

    await markOrderPaid(orderId, order.paymentId ?? `demo_${orderId}`);
    return apiOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
