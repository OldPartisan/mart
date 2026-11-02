/**
 * ЮKassa. Если ключи не заданы — демо-касса: заказ получает paymentId "demo_..."
 * и страницу подтверждения /checkout/payment/[id].
 */
type CreatePaymentInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  description: string;
  email: string;
  returnUrl: string;
};

type CreatePaymentResult = { paymentId: string; confirmationUrl: string; demo: boolean };

const API = "https://api.yookassa.ru/v3/payments";

export function isYooKassaEnabled(): boolean {
  return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  if (!isYooKassaEnabled()) {
    return { paymentId: `demo_${input.orderId}`, confirmationUrl: `/checkout/payment/${input.orderId}`, demo: true };
  }

  const auth = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString("base64");
  const idempotenceKey = crypto.randomUUID();

  const response = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Idempotence-Key": idempotenceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { value: input.amount.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: input.returnUrl },
      description: `Заказ ${input.orderNumber} в Ирбис Март`,
      receipt: {
        customer: { email: input.email },
        items: [
          {
            description: `Заказ ${input.orderNumber}`,
            quantity: "1.00",
            amount: { value: input.amount.toFixed(2), currency: "RUB" },
            vat_code: 1,
          },
        ],
      },
      metadata: { orderId: input.orderId },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ЮKassa: ${response.status} ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as { id: string; confirmation?: { confirmation_url?: string } };
  return {
    paymentId: data.id,
    confirmationUrl: data.confirmation?.confirmation_url ?? `/checkout/payment/${input.orderId}`,
    demo: false,
  };
}

export async function fetchPayment(paymentId: string): Promise<{ status: string; paid: boolean; metadata?: { orderId?: string } } | null> {
  if (!isYooKassaEnabled()) return null;
  const auth = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString("base64");
  const response = await fetch(`${API}/${paymentId}`, { headers: { Authorization: `Basic ${auth}` } });
  if (!response.ok) return null;
  const data = (await response.json()) as { status: string; paid: boolean; metadata?: { orderId?: string } };
  return data;
}
