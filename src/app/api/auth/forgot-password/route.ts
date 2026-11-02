import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/notifications";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`forgot:${clientIp(request)}`, 5, 60_000);
    if (!limit.ok) return apiError("Слишком много запросов", 429);

    const { email } = schema.parse(await request.json());
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Не раскрываем, существует ли аккаунт.
    if (!user) return apiOk({ ok: true, message: "Если аккаунт существует, письмо отправлено." });

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Восстановление пароля в Ирбис Март",
      text: `Ссылка для сброса пароля действует 1 час: ${link}`,
    });

    return apiOk({
      ok: true,
      message: "Если аккаунт существует, письмо отправлено.",
      // В демо-режиме (без SMTP) возвращаем ссылку, чтобы сценарий можно было пройти.
      ...(process.env.SMTP_HOST ? {} : { demoResetUrl: link }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
