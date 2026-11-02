import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    return apiOk({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bonusBalance: user.bonusBalance,
      marketingOptIn: user.marketingOptIn,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const data = profileSchema.parse(await request.json());
    const db = await getDb();
    const [updated] = await db
      .update(users)
      .set({
        name: data.name,
        phone: data.phone || null,
        marketingOptIn: data.marketingOptIn,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({ id: users.id, name: users.name, phone: users.phone, marketingOptIn: users.marketingOptIn });
    return apiOk({ user: updated, message: "Профиль обновлён" });
  } catch (error) {
    return handleApiError(error);
  }
}
