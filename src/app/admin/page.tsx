import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Banknote, Package, ShoppingCart, Users } from "lucide-react";
import { getAdminStats } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const maxDay = Math.max(...stats.salesByDay.map((day) => day.total), 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Админ-панель</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Сводка магазина</h1>
          <p className="mt-1 text-[12px] text-muted">Новая Тура · обновляется при каждом запросе</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">Добавить товар</Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Banknote, label: "Выручка (оплачено)", value: formatPrice(stats.revenue), hint: `${stats.paidOrders} заказов`, tone: "bg-brand-900 text-cream" },
          { icon: ShoppingCart, label: "Заказов сегодня", value: String(stats.todayOrders), hint: `${formatPrice(stats.todayRevenue)} сегодня`, tone: "bg-white" },
          { icon: Users, label: "Клиентов", value: String(stats.customers), hint: "зарегистрировано", tone: "bg-white" },
          { icon: Package, label: "В работе", value: String(stats.activeOrders), hint: "новые и собираются", tone: "bg-white" },
        ].map((card) => (
          <div key={card.label} className={cn("rounded-2xl border border-line/70 p-5", card.tone)}>
            <div className="flex items-center justify-between">
              <card.icon className={cn("h-4 w-4", card.tone.includes("brand-900") ? "text-accent-300" : "text-brand-900")} />
              {card.label === "Выручка (оплачено)" ? <ArrowUpRight className="h-4 w-4 text-accent-300" /> : <ArrowDownRight className="h-4 w-4 text-muted" />}
            </div>
            <p className={cn("mt-4 text-[10px] font-bold uppercase tracking-wider", card.tone.includes("brand-900") ? "text-cream/50" : "text-muted")}>{card.label}</p>
            <p className={cn("mt-1 font-display text-2xl font-extrabold tracking-tight", card.tone.includes("brand-900") ? "text-cream" : "text-ink")}>{card.value}</p>
            <p className={cn("mt-1 text-[10.5px]", card.tone.includes("brand-900") ? "text-cream/45" : "text-muted")}>{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-line/70 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Продажи за 7 дней</h2>
              <p className="text-[11px] text-muted">Оплаченные заказы, без доставки в сумме</p>
            </div>
            <span className="badge-green">средний чек {formatPrice(stats.avgOrder)}</span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
            {stats.salesByDay.length === 0 && <p className="w-full text-center text-[12px] text-muted">Пока нет оплаченных заказов за неделю</p>}
            {stats.salesByDay.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-muted">{day.total ? formatPrice(day.total) : ""}</span>
                <div className="flex w-full items-end justify-center" style={{ height: "110px" }}>
                  <div className="w-full max-w-10 rounded-t-lg bg-brand-900 transition-all" style={{ height: `${Math.max(4, Math.round((day.total / maxDay) * 100))}%` }} />
                </div>
                <span className="text-[10px] text-muted">{day.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line/70 bg-white p-5">
          <h2 className="font-display text-lg font-bold">Топ товаров</h2>
          <ol className="mt-3 space-y-3">
            {stats.topProducts.map((product, index) => (
              <li key={product.slug} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-[11px] font-bold text-brand-900">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold">{product.name}</p>
                  <p className="text-[10px] text-muted">{product.quantity} шт. · {formatPrice(product.revenue)}</p>
                </div>
              </li>
            ))}
            {stats.topProducts.length === 0 && <p className="text-[12px] text-muted">Нет данных</p>}
          </ol>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-line/70 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Последние заказы</h2>
          <Link href="/admin/orders" className="text-[11px] font-semibold text-brand-900">Все заказы</Link>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 font-semibold">Номер</th>
                <th className="py-2 font-semibold">Клиент</th>
                <th className="py-2 font-semibold">Дата</th>
                <th className="py-2 font-semibold">Статус</th>
                <th className="py-2 text-right font-semibold">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2.5">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-brand-900 hover:underline">{order.number}</Link>
                  </td>
                  <td className="py-2.5">{order.customerName}</td>
                  <td className="py-2.5 text-muted">{formatDateTime(order.createdAt)}</td>
                  <td className="py-2.5"><span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span></td>
                  <td className="py-2.5 text-right font-bold">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
