import { getCurrentUser } from "@/lib/auth";
import { getBonusHistory, getTotalSpent } from "@/lib/queries";
import { getLevel, nextLevel } from "@/lib/bonuses";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const [history, spent] = await Promise.all([getBonusHistory(user.id), getTotalSpent(user.id)]);
    const level = getLevel(spent);
    const next = nextLevel(spent);
    return apiOk({
      balance: user.bonusBalance,
      totalSpent: spent,
      level,
      next,
      history,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
