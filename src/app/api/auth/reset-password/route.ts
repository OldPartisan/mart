import { createHash } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(72).regex(/\d/, "Добавьте цифру"),
});

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`reset:${clientIp(request)}`, 8, 60_000);
    if (!limit.ok) return apiError("Слишком много запросов", 429);

    const { token, password } = schema.parse(await request.json());
    const db = await getDb();
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const [record] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt)))
      .limit(1);

    if (!record) return apiError("Ссылка недействительна", 400);
    if (record.expiresAt.getTime() < Date.now()) return apiError("Ссылка истекла. Запросите новую.", 400);

    const passwordHash = await hashPassword(password);
    await db.transaction(async (tx) => {
      await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, record.userId));
      await tx.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, record.id));
    });

    return apiOk({ ok: true, message: "Пароль обновлён. Войдите с новым паролем." });
  } catch (error) {
    return handleApiError(error);
  }
}
