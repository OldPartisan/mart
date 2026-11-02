import Link from "next/link";
import { Search } from "lucide-react";
import { getAdminOrders } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { Flash } from "@/components/admin/flash";

export const dynamic = "force-dynamic";

const tabs = [
  { value: "ALL", label: "Все" },
  { value: "NEW", label: "Новые" },
  { value: "PROCESSING", label: "Собираются" },
  { value: "READY", label: "Готовы" },
  { value: "DELIVERING", label: "В доставке" },
  { value: "COMPLETED", label: "Выполнены" },
  { value: "CANCELLED", label: "Отменены" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; ok?: string; error?: string }>;
}) {
  const { status = "ALL", q, ok, error } = await searchParams;
  const orders = await getAdminOrders({ status, q });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Продажи</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Заказы</h1>
        <p className="mt-1 text-[12px] text-muted">{orders.length} заказов по выбранному фильтру</p>
      </div>

      <Flash ok={ok} error={error} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/orders${tab.value === "ALL" ? "" : `?status=${tab.value}`}`}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                status === tab.value ? "bg-brand-800 text-cream" : "bg-white text-ink-soft hover:bg-cream",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="status" value={status} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={q} placeholder="Номер, имя, телефон" className="field h-9 w-52 rounded-full pl-8 text-[11px]" />
          </div>
          <button type="submit" className="btn-secondary btn-sm">Найти</button>
        </form>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line/70 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead className="border-b border-line bg-cream/50 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Номер</th>
                <th className="px-4 py-3 font-semibold">Клиент</th>
                <th className="px-4 py-3 font-semibold">Получение</th>
                <th className="px-4 py-3 font-semibold">Оплата</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold">Дата</th>
                <th className="px-4 py-3 text-right font-semibold">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream/30">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-brand-800 hover:underline">{order.number}</Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-[10px] text-muted">{order.phone}</p>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{order.deliveryType === "PICKUP" ? "Самовывоз" : "Доставка"}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("badge", PAYMENT_STATUSES[order.paymentStatus]?.tone)}>{PAYMENT_STATUSES[order.paymentStatus]?.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
