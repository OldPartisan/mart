import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { contactSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`contact:${clientIp(request)}`, 5, 60_000);
    if (!limit.ok) return apiError("Слишком много сообщений. Попробуйте позже.", 429);

    const data = contactSchema.parse(await request.json());
    const db = await getDb();
    await db.insert(contactMessages).values({
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      message: data.message,
    });
    await sendEmail({
      to: process.env.NEXT_PUBLIC_SHOP_EMAIL ?? "hello@irbis-mart.ru",
      subject: `Обращение с сайта от ${data.name}`,
      text: `${data.message}\n\nТелефон: ${data.phone}\nEmail: ${data.email}`,
    });
    return apiOk({ ok: true, message: "Спасибо! Ответим в течение рабочего дня." });
  } catch (error) {
    return handleApiError(error);
  }
}
