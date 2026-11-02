import { getCurrentUser } from "@/lib/auth";
import { getOrderWithItems } from "@/lib/queries";
import { isStaff } from "@/lib/auth";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const result = await getOrderWithItems(id);
    if (!result) return apiError("Заказ не найден", 404);
    if (result.order.userId !== user.id && !isStaff(user)) return apiError("Нет доступа к заказу", 403);
    return apiOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
