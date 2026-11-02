/**
 * Уведомления. В демо-режиме пишем в лог; в продакшене подключается SMTP
 * (nodemailer / Resend) и SMS.RU. Точки вызова уже расставлены в orders.ts.
 */
type MailPayload = { to: string; subject: string; text: string };

export async function sendEmail({ to, subject, text }: MailPayload): Promise<void> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.info(`[mail:demo] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  // Продакшен: здесь вызов nodemailer.createTransport(...).sendMail({...}).
  console.info(`[mail:${host}] to=${to} subject="${subject}"`);
}

export async function sendSms(phone: string, text: string): Promise<void> {
  const apiId = process.env.SMSRU_API_ID;
  if (!apiId) {
    console.info(`[sms:demo] to=${phone}: ${text}`);
    return;
  }
  console.info(`[sms:smsru] to=${phone}: ${text}`);
}
