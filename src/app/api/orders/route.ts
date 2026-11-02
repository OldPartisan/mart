import { getCurrentUser } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { getUserOrders } from "@/lib/queries";
import { checkoutSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`order:${clientIp(request)}`, 6, 60_000);
    if (!limit.ok) return apiError("Слишком много попыток. Попробуйте через минуту.", 429);

    const data = checkoutSchema.parse(await request.json());
    const user = await getCurrentUser();
    const result = await createOrder(user?.id ?? null, data);

    return apiOk(
      {
        order: result.order,
        items: result.items,
        paymentUrl: result.paymentUrl,
        demoPayment: result.demoPayment,
        bonusEarnedPreview: result.bonusEarnedPreview,
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const rows = await getUserOrders(user.id);
    return apiOk({ items: rows });
  } catch (error) {
    return handleApiError(error);
  }
}
