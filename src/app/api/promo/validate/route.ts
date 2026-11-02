import { getDb } from "@/db";
import { validatePromo } from "@/lib/promo";
import { promoValidateSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`promo:${clientIp(request)}`, 20, 60_000);
    if (!limit.ok) return apiError("Слишком много запросов", 429);

    const data = promoValidateSchema.parse(await request.json());
    const db = await getDb();
    const result = await validatePromo(db, data.code, data.subtotal);
    if (!result.ok) return apiError(result.error, 400);
    return apiOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
