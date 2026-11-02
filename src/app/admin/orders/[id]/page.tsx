import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User } from "lucide-react";
import { getOrderWithItems } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { updateOrderStatus, updateCustomerNote } from "@/app/admin/actions";
import { PrintButton } from "@/components/admin/print-button";
import { Flash } from "@/components/admin/flash";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const result = await getOrderWithItems(id);
  if (!result) notFound();
  const { order, items } = result;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted hover:text-brand-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Заказы
      </Link>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{order.number}</h1>
          <p className="mt-1 text-[12px] text-muted">{formatDateTime(order.createdAt)} · {order.deliveryType === "PICKUP" ? "самовывоз" : "доставка"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
          <span className={cn("badge", PAYMENT_STATUSES[order.paymentStatus]?.tone)}>{PAYMENT_STATUSES[order.paymentStatus]?.label}</span>
          <PrintButton />
        </div>
      </div>

      <Flash ok={ok} error={error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-line/70 bg-white p-5">
            <h2 className="font-display text-base font-bold">Состав заказа</h2>
            <ul className="mt-3 divide-y divide-line/60">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    <Image src={item.image ?? "/images/store.jpg"} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold">{item.name}</p>
                    <p className="text-[10px] text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-[12px] font-bold">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12px]">
              <div className="flex justify-between"><dt className="text-muted">Товары</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted">Скидка {order.promoCode}</dt><dd className="text-brand-800">−{formatPrice(order.discount)}</dd></div>}
              {order.bonusUsed > 0 && <div className="flex justify-between"><dt className="text-muted">Бонусы</dt><dd className="text-accent-700">−{formatPrice(order.bonusUsed)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">{order.deliveryType === "PICKUP" ? "Самовывоз" : "Доставка"}</dt><dd>{order.deliveryFee ? formatPrice(order.deliveryFee) : "бесплатно"}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-[14px]"><dt className="font-semibold">Итого</dt><dd className="font-bold">{formatPrice(order.total)}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line/70 bg-white p-5">
            <h2 className="font-display text-base font-bold">Комментарий к заказу</h2>
            <form action={updateCustomerNote} className="mt-3">
              <input type="hidden" name="id" value={order.id} />
              <textarea name="comment" defaultValue={order.comment ?? ""} className="field-area min-h-[90px] text-[12px]" placeholder="Внутренний комментарий или пожелание клиента" />
              <button type="submit" className="btn-secondary btn-sm mt-2">Сохранить</button>
            </form>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-line/70 bg-white p-5">
            <h2 className="font-display text-base font-bold">Управление</h2>
            <form action={updateOrderStatus} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label htmlFor="status" className="label">Статус заказа</label>
                <select id="status" name="status" defaultValue={order.status} className="field h-10 text-[12px]">
                  {Object.entries(ORDER_STATUSES).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary btn-sm w-full">Обновить статус</button>
            </form>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              При статусе «Выполнен» неоплаченный заказ при получении автоматически станет оплаченным, и бонусы будут начислены.
            </p>
          </section>

          <section className="rounded-2xl border border-line/70 bg-white p-5">
            <h2 className="font-display text-base font-bold">Клиент</h2>
            <div className="mt-3 space-y-2.5 text-[12px]">
              <p className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted" /> {order.customerName}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted" /> <a href={`tel:${order.phone}`} className="hover:text-brand-800">{order.phone}</a></p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted" /> {order.email}</p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted" />
                {order.deliveryType === "PICKUP" ? `Самовывоз: ${formatDate(order.pickupDate)}, ${order.pickupSlot}` : order.addressText}
              </p>
              <p className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-muted" /> {order.paymentMethod === "ONLINE" ? "Онлайн" : "При получении"} · {order.paymentId ?? "—"}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
