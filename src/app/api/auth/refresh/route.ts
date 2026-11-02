import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { setAuthCookies } from "@/lib/auth";
import { REFRESH_COOKIE, verifyToken } from "@/lib/jwt";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  try {
    const jar = await cookies();
    const token = jar.get(REFRESH_COOKIE)?.value;
    if (!token) return apiError("Нет refresh-токена", 401);
    const payload = await verifyToken(token);
    if (!payload || payload.type !== "refresh") return apiError("Сессия истекла", 401);

    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    if (!user || user.isBlocked) return apiError("Аккаунт недоступен", 401);

    await setAuthCookies(user);
    return apiOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
