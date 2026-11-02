import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Мои заказы" };

export default async function OrdersPage() {
  const user = (await getCurrentUser())!;
  const orders = await getUserOrders(user.id);

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">История</p>
        <h1 className="mt-2 font-display text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">Мои заказы</h1>
        <p className="mt-1.5 text-[13px] text-muted">Статусы, состав и повтор заказа в один клик.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white py-14 text-center">
          <Package className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-[14px] font-semibold">Заказов пока нет</p>
          <p className="mt-1 text-[12px] text-muted">Выберите что-нибудь на полке — соберём через 2 часа.</p>
          <Link href="/catalog" className="btn-primary btn-sm mt-4">В каталог</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-line/80 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-[15px] font-bold">{order.number}</p>
                    <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
                    <span className={cn("badge", PAYMENT_STATUSES[order.paymentStatus]?.tone)}>{PAYMENT_STATUSES[order.paymentStatus]?.label}</span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-muted">
                    {formatDateTime(order.createdAt)} · {order.deliveryType === "PICKUP" ? "Самовывоз" : "Доставка"}
                    {order.pickupDate ? ` · ${formatDate(order.pickupDate)} ${order.pickupSlot ?? ""}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="price text-xl">{formatPrice(order.total)}</span>
                  <Link href={`/account/orders/${order.id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition hover:border-brand-700/40" aria-label={`Открыть заказ ${order.number}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
