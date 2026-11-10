import Link from "next/link";
import { ArrowUpRight, Download, Search, Users, Wallet, Repeat, ReceiptText } from "lucide-react";
import { getRfmOrderRows } from "@/lib/rfm-query";
import { buildRfmReport, SEGMENT_META, type RfmSegmentKey } from "@/lib/rfm";
import { formatPrice } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "RFM-анализ" };

const periods = [
  { value: "30", label: "30 дней" },
  { value: "90", label: "90 дней" },
  { value: "180", label: "180 дней" },
  { value: "365", label: "12 месяцев" },
  { value: "0", label: "Всё время" },
];

function scoreTone(score: number) {
  if (score >= 4) return "bg-brand-700 text-white";
  if (score === 3) return "bg-brand-100 text-brand-900";
  return "bg-[#F3F3F3] text-muted";
}

export default async function RfmPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; segment?: string; q?: string }>;
}) {
  const params = await searchParams;
  const days = Number(params.days ?? "365");
  const periodDays = Number.isFinite(days) && days > 0 ? days : undefined;
  const segment = params.segment && params.segment in SEGMENT_META ? (params.segment as RfmSegmentKey) : null;
  const q = (params.q ?? "").trim().toLowerCase();
  const rows = await getRfmOrderRows(periodDays);
  const report = buildRfmReport(rows);
  const filtered = report.customers.filter((customer) => {
    const matchesSegment = !segment || customer.segment === segment;
    const matchesQuery = !q || customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q);
    return matchesSegment && matchesQuery;
  });
  const activeSegments = report.segments.filter((item) => item.count > 0);
  const periodLabel = periods.find((item) => item.value === String(days))?.label ?? "12 месяцев";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Маркетинг</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">RFM-анализ</h1>
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
            Recency · Frequency · Monetary. Клиенты по давности, частоте и сумме покупок. Только оплаченные и не отменённые заказы.
          </p>
        </div>
        <form action="/api/admin/export/rfm" method="get" className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-2">
          <input type="hidden" name="days" value={periodDays ?? 0} />
          {params.q && <input type="hidden" name="q" value={params.q} />}
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
            Сегмент
            <select name="segment" defaultValue={segment ?? ""} className="h-8 rounded-lg border border-line bg-white px-2 text-[11px] text-ink">
              <option value="">Все клиенты</option>
              {report.segments.map((item) => <option key={item.key} value={item.key}>{item.label} ({item.count})</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
            Формат
            <select name="format" defaultValue="xls" className="h-8 rounded-lg border border-line bg-white px-2 text-[11px] text-ink">
              <option value="xls">Excel (.xls)</option>
              <option value="csv">CSV</option>
            </select>
          </label>
          <button type="submit" className="btn-primary h-8 px-3 text-[11px]"><Download className="h-3.5 w-3.5" /> Скачать</button>
        </form>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users, label: "Клиентов в анализе", value: String(report.totals.customers), hint: periodLabel },
          { icon: Wallet, label: "Выручка", value: formatPrice(report.totals.revenue), hint: "оплачено" },
          { icon: ReceiptText, label: "Средний чек", value: formatPrice(report.totals.avgCheck), hint: `${report.totals.totalOrders} заказов` },
          { icon: Repeat, label: "Повторные покупки", value: `${report.totals.repeatRate}%`, hint: "клиентов с 2+ заказами" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-line/70 bg-white p-5">
            <card.icon className="h-4 w-4 text-brand-900" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted">{card.label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">{card.value}</p>
            <p className="mt-1 text-[10.5px] text-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-muted">Период:</span>
        {periods.map((item) => (
          <Link
            key={item.value}
            href={`/admin/marketing/rfm?days=${item.value}${segment ? `&segment=${segment}` : ""}`}
            className={cn("rounded-full px-3 py-1.5 text-[11px] font-semibold", String(days) === item.value ? "bg-brand-700 text-white" : "border border-line bg-white text-muted hover:text-ink")}
          >
            {item.label}
          </Link>
        ))}
        <form method="get" className="ml-auto flex items-center gap-1.5">
          <input type="hidden" name="days" value={days} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Имя или email" className="field h-8 w-44 rounded-full pl-8 text-[11px]" />
          </div>
          <button type="submit" className="btn-secondary btn-sm h-8">Найти</button>
        </form>
      </div>

      <p className="mt-2 text-[10px] text-muted">Выгрузка учитывает выбранный период, сегмент и поиск. Excel-файл содержит листы «RFM клиенты» и «Сегменты».</p>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Сегменты</h2>
          <span className="text-[10px] text-muted">{activeSegments.length} активных</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {report.segments.map((item) => (
            <Link
              key={item.key}
              href={`/admin/marketing/rfm?days=${days}${segment === item.key ? "" : `&segment=${item.key}`}`}
              className={cn("rounded-2xl border p-3 transition", segment === item.key ? "border-brand-700 ring-1 ring-brand-700" : "border-line bg-white hover:border-brand-700/40", item.count === 0 && "opacity-50")}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", item.tone)}>{item.label}</span>
                <span className="font-display text-lg font-extrabold">{item.count}</span>
              </div>
              <p className="mt-2 line-clamp-2 min-h-[28px] text-[10px] leading-snug text-muted">{item.description}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                <span>{item.share}% выручки</span>
                <span>{formatPrice(item.revenue)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {segment && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-[11px] text-brand-900">
          Фильтр: <strong>{SEGMENT_META[segment].label}</strong>
          <Link href={`/admin/marketing/rfm?days=${days}`} className="ml-auto font-semibold underline">Сбросить</Link>
        </div>
      )}

      <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <h2 className="font-display text-lg font-bold">Клиенты</h2>
          <span className="text-[10px] text-muted">{filtered.length} из {report.customers.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead className="border-b border-line bg-[#F7F8F9] text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Клиент</th>
                <th className="px-3 py-2.5 font-semibold">R</th>
                <th className="px-3 py-2.5 font-semibold">F</th>
                <th className="px-3 py-2.5 font-semibold">M</th>
                <th className="px-3 py-2.5 font-semibold">Сегмент</th>
                <th className="px-3 py-2.5 font-semibold">Последний заказ</th>
                <th className="px-3 py-2.5 text-right font-semibold">Заказов</th>
                <th className="px-4 py-2.5 text-right font-semibold">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filtered.map((customer) => (
                <tr key={customer.userId} className="hover:bg-cream/30">
                  <td className="px-4 py-2.5">
                    <p className="font-semibold text-ink">{customer.name}</p>
                    <p className="text-[10px] text-muted">{customer.email}</p>
                    {customer.phone && <p className="text-[10px] text-muted">{customer.phone}</p>}
                  </td>
                  {[customer.r, customer.f, customer.m].map((value, index) => (
                    <td key={index} className="px-3 py-2.5"><span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold", scoreTone(value))}>{value}</span></td>
                  ))}
                  <td className="px-3 py-2.5"><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", SEGMENT_META[customer.segment].tone)}>{SEGMENT_META[customer.segment].label}</span></td>
                  <td className="px-3 py-2.5 text-muted">{formatDate(customer.lastOrderAt)} <span className="text-[10px]">({customer.recencyDays} дн.)</span></td>
                  <td className="px-3 py-2.5 text-right">{customer.frequency}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{formatPrice(customer.monetary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-[13px] text-muted">Нет клиентов под выбранный фильтр.</p>
            <Link href={`/admin/marketing/rfm?days=${days}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-900">Сбросить фильтр <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
        )}
      </section>

      <p className="mt-4 text-[10px] leading-relaxed text-muted">
        R — давность последней оплаты, F — число оплаченных заказов, M — сумма покупок. Оценки 1–5 строятся по квинтилям внутри выбранного периода.
        Сегменты: {report.segments.map((item) => item.label).join(" · ")}.
      </p>
    </div>
  );
}
