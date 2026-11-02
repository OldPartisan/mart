import { markOrderPaid } from "@/lib/orders";
import { fetchPayment, isYooKassaEnabled } from "@/lib/payments";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

/**
 * Вебхук ЮKassa. Не доверяем телу запроса: перепроверяем статус платежа
 * через API ЮKassa и только затем начисляем бонусы.
 */
export async function POST(request: Request) {
  try {
    if (!isYooKassaEnabled()) return apiError("Платёжная система не настроена", 400);

    const body = (await request.json().catch(() => null)) as
      | { event?: string; object?: { id?: string; status?: string; metadata?: { orderId?: string } } }
      | null;
    if (!body?.object?.id) return apiError("Некорректный запрос", 400);

    const payment = await fetchPayment(body.object.id);
    if (!payment) return apiError("Платёж не найден", 404);

    if (body.event === "payment.succeeded" && payment.status === "succeeded") {
      const orderId = payment.metadata?.orderId ?? body.object.metadata?.orderId;
      if (!orderId) return apiError("Нет orderId в метаданных", 400);
      await markOrderPaid(orderId, body.object.id);
    }

    return apiOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
