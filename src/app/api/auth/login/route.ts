import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { setAuthCookies, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = loginSchema.parse(await request.json());
    const limit = rateLimit(`login:${clientIp(request)}:${data.email}`, 8, 60_000);
    if (!limit.ok) return apiError("Слишком много попыток входа. Попробуйте через минуту.", 429);

    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (!user) return apiError("Неверный email или пароль", 401);
    if (user.isBlocked) return apiError("Аккаунт заблокирован. Свяжитесь с поддержкой.", 403);

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) return apiError("Неверный email или пароль", 401);

    await setAuthCookies(user);
    return apiOk({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return handleApiError(error);
  }
}
