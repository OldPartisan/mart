import { getDb } from "@/db";
import { subscriptions } from "@/db/schema";
import { subscribeSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`subscribe:${clientIp(request)}`, 6, 60_000);
    if (!limit.ok) return apiError("Слишком много запросов", 429);

    const data = subscribeSchema.parse(await request.json());
    const db = await getDb();
    await db.insert(subscriptions).values({ email: data.email, source: data.source }).onConflictDoNothing();
    return apiOk({ ok: true, message: "Подписка оформлена" });
  } catch (error) {
    return handleApiError(error);
  }
}
