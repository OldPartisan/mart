import { Ticket } from "lucide-react";
import { getAdminPromos } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { Flash } from "@/components/admin/flash";
import { savePromo, togglePromo } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const promos = await getAdminPromos();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Маркетинг</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Промокоды</h1>
        <p className="mt-1 text-[12px] text-muted">Скидка применяется на оформлении заказа после проверки суммы.</p>
      </div>

      <Flash ok={ok} error={error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden rounded-2xl border border-line/70 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead className="border-b border-line bg-cream/50 text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-3 font-semibold">Код</th>
                  <th className="px-3 py-3 font-semibold">Скидка</th>
                  <th className="px-3 py-3 font-semibold">Условия</th>
                  <th className="px-3 py-3 font-semibold">Использован</th>
                  <th className="px-3 py-3 font-semibold">Статус</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {promos.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-3 py-2.5 font-display text-[13px] font-bold">{promo.code}</td>
                    <td className="px-3 py-2.5">
                      {promo.discountType === "PERCENT" ? `${promo.discountValue}%` : formatPrice(promo.discountValue)}
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-muted">
                      от {formatPrice(promo.minOrderAmount)}
                      {promo.validUntil ? ` · до ${formatDate(promo.validUntil)}` : ""}
                    </td>
                    <td className="px-3 py-2.5 text-[11px]">{promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ""}</td>
                    <td className="px-3 py-2.5">
                      <form action={togglePromo}>
                        <input type="hidden" name="id" value={promo.id} />
                        <button type="submit" className={`badge ${promo.isActive ? "bg-brand-100 text-brand-900" : "bg-red-50 text-red-700"}`}>
                          {promo.isActive ? "активен" : "выключен"}
                        </button>
                      </form>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <details className="relative">
                        <summary className="cursor-pointer rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold">Изменить</summary>
                        <div className="absolute right-0 top-8 z-20 w-64 rounded-2xl border border-line bg-white p-3 shadow-float">
                          <form action={savePromo} className="space-y-2">
                            <input type="hidden" name="id" value={promo.id} />
                            <input name="code" defaultValue={promo.code} className="field h-8 text-[11px]" />
                            <div className="grid grid-cols-2 gap-2">
                              <select name="discountType" defaultValue={promo.discountType} className="field h-8 text-[11px]">
                                <option value="PERCENT">%</option>
                                <option value="FIXED">₽</option>
                              </select>
                              <input name="discountValue" type="number" defaultValue={promo.discountValue} className="field h-8 text-[11px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input name="minOrderAmount" type="number" defaultValue={promo.minOrderAmount} className="field h-8 text-[11px]" />
                              <input name="usageLimit" type="number" defaultValue={promo.usageLimit} className="field h-8 text-[11px]" />
                            </div>
                            <input name="validUntil" type="date" defaultValue={promo.validUntil ? promo.validUntil.toISOString().slice(0, 10) : ""} className="field h-8 text-[11px]" />
                            <label className="flex items-center gap-1.5 text-[10px]"><input type="checkbox" name="isActive" defaultChecked={promo.isActive} className="h-3.5 w-3.5 accent-[#2E7D32]" /> Активен</label>
                            <button type="submit" className="btn-primary btn-sm w-full">Сохранить</button>
                          </form>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form action={savePromo} className="h-fit rounded-2xl border border-line/70 bg-white p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold"><Ticket className="h-4 w-4 text-brand-700" /> Новый промокод</h2>
          <div className="mt-3 space-y-2.5">
            <div><label htmlFor="code" className="label">Код</label><input id="code" name="code" required className="field h-9 text-[12px]" placeholder="SPRING15" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="discountType" className="label">Тип</label>
                <select id="discountType" name="discountType" className="field h-9 text-[12px]">
                  <option value="PERCENT">Процент</option>
                  <option value="FIXED">Фиксированная</option>
                </select>
              </div>
              <div><label htmlFor="discountValue" className="label">Значение</label><input id="discountValue" name="discountValue" type="number" required className="field h-9 text-[12px]" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label htmlFor="minOrderAmount" className="label">Мин. сумма</label><input id="minOrderAmount" name="minOrderAmount" type="number" defaultValue={0} className="field h-9 text-[12px]" /></div>
              <div><label htmlFor="usageLimit" className="label">Лимит</label><input id="usageLimit" name="usageLimit" type="number" defaultValue={0} className="field h-9 text-[12px]" /></div>
            </div>
            <div><label htmlFor="validUntil" className="label">Действует до</label><input id="validUntil" name="validUntil" type="date" className="field h-9 text-[12px]" /></div>
            <label className="flex items-center gap-2 text-[11px]"><input type="checkbox" name="isActive" defaultChecked className="h-3.5 w-3.5 accent-[#2E7D32]" /> Активен сразу</label>
            <button type="submit" className="btn-primary btn-sm w-full">Создать</button>
          </div>
        </form>
      </div>
    </div>
  );
}
