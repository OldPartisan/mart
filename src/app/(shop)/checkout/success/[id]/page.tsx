import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, CreditCard, MapPin, Package, Sparkles } from "lucide-react";
import { getOrderWithItems } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatPickupDate } from "@/lib/delivery";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  robots: { index: false, follow: false },
};

const steps = ["Заказ принят", "Собираем", "Готов к выдаче", "Получен"];

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrderWithItems(id);
  if (!result) notFound();
  const { order, items } = result;

  const isPickup = order.deliveryType === "PICKUP";
  const paid = order.paymentStatus === "PAID";
  const currentStep = ORDER_STATUSES[order.status]?.step ?? 0;
  const bonusPreview = Math.floor((order.subtotal - order.discount - order.bonusUsed) / 100);

  return (
    <div className="container-x py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-9">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-cream">
                <Check className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">Спасибо! Заказ принят</h1>
              <p className="mt-2 text-[13.5px] text-muted">
                Номер заказа <strong className="text-ink">{order.number}</strong>. Мы отправили подтверждение на {order.email}.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 sm:items-end">
              <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
              <span className={cn("badge", PAYMENT_STATUSES[order.paymentStatus]?.tone)}>{PAYMENT_STATUSES[order.paymentStatus]?.label}</span>
            </div>
          </div>

          {order.paymentStatus === "PENDING" && order.paymentMethod === "ONLINE" && (
            <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl bg-accent-50 p-4 sm:flex-row sm:items-center">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-accent-700">
                <CreditCard className="h-4 w-4" /> Заказ ждёт оплаты
              </p>
              <Link href={`/checkout/payment/${order.id}`} className="btn-accent btn-sm">
                Перейти к оплате
              </Link>
            </div>
          )}

          <div className="mt-7">
            <div className="flex items-center justify-between gap-1">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                      index <= currentStep ? "bg-brand-800 text-cream" : "bg-cream text-muted",
                    )}
                  >
                    {index < currentStep ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={cn("mt-1.5 text-[10px] font-semibold", index <= currentStep ? "text-ink" : "text-muted")}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                {isPickup ? <MapPin className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                {isPickup ? "Самовывоз" : "Доставка"}
              </p>
              <p className="mt-1.5 text-[13px] font-semibold text-ink">
                {isPickup ? site.address : order.addressText}
              </p>
              <p className="mt-1 text-[11.5px] text-muted">
                {isPickup
                  ? `${formatPickupDate(order.pickupDate)}, ${order.pickupSlot} · храним ${site.pickupStorage}`
                  : order.deliveryZone}
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <CreditCard className="h-3.5 w-3.5" /> Оплата
              </p>
              <p className="mt-1.5 text-[13px] font-semibold text-ink">
                {order.paymentMethod === "ONLINE" ? "Картой онлайн" : "При получении"}
              </p>
              <p className="mt-1 text-[11.5px] text-muted">
                {order.paymentMethod === "ONLINE" ? "Демо-касса / ЮKassa" : "Наличными или картой на кассе"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-lg font-bold">Состав заказа</h2>
            <ul className="mt-3 divide-y divide-line/70">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                    <Image src={item.image ?? "/images/store.jpg"} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-ink">{item.name}</p>
                    <p className="text-[10.5px] text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-[12.5px] font-bold">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-muted">Товары</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-800">
                <dt>Скидка {order.promoCode ? `(${order.promoCode})` : ""}</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            {order.bonusUsed > 0 && (
              <div className="flex justify-between text-accent-700">
                <dt>Списано бонусов</dt>
                <dd>−{formatPrice(order.bonusUsed)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{isPickup ? "Самовывоз" : "Доставка"}</dt>
              <dd>{order.deliveryFee ? formatPrice(order.deliveryFee) : "бесплатно"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-[15px]">
              <dt className="font-semibold">Итого</dt>
              <dd className="price">{formatPrice(order.total)}</dd>
            </div>
          </dl>

          {paid && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-[12px] text-brand-900">
              <Sparkles className="h-4 w-4 shrink-0" />
              После оплаты начислим ≈ {bonusPreview} бонусов. Они появятся в личном кабинете в течение минуты.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/account/orders" className="btn-primary">
              Мои заказы <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog" className="btn-secondary">
              Продолжить покупки
            </Link>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-muted">
          <Clock className="h-3.5 w-3.5" /> Вопрос по заказу? Позвоните {site.phone} — поможем.
        </p>
      </div>
    </div>
  );
}
