import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { getOrderWithItems } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { DemoPayment } from "@/components/shop/demo-payment";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Оплата заказа",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrderWithItems(id);
  if (!result) notFound();
  const { order } = result;
  if (order.paymentStatus === "PAID") redirect(`/checkout/success/${order.id}`);

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-6 sm:p-8">
        <Link href={`/checkout/success/${order.id}`} className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-brand-800">
          <ArrowLeft className="h-3.5 w-3.5" /> К заказу
        </Link>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-800">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Оплата заказа</h1>
        <p className="mt-1 text-[13px] text-muted">Заказ {order.number}</p>

        <dl className="mt-5 space-y-2 rounded-2xl bg-cream p-4 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-muted">Товары</dt>
            <dd className="font-semibold">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Скидка</dt>
              <dd className="font-semibold text-brand-800">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          {order.bonusUsed > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Бонусы</dt>
              <dd className="font-semibold text-accent-700">−{formatPrice(order.bonusUsed)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Доставка</dt>
            <dd className="font-semibold">{order.deliveryFee ? formatPrice(order.deliveryFee) : "бесплатно"}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-[15px]">
            <dt className="font-semibold">К оплате</dt>
            <dd className="price">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <DemoPayment orderId={order.id} amount={order.total} />
        </div>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
          В продакшене этот шаг заменяется на платёжную форму ЮKassa. Бонусы начисляются автоматически после успешной оплаты.
        </p>
      </div>
    </div>
  );
}
