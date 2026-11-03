import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Gift, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getBonusHistory, getTotalSpent } from "@/lib/queries";
import { BONUS_RULES, getLevel, nextLevel, LOYALTY_LEVELS } from "@/lib/bonuses";
import { formatPrice } from "@/lib/money";
import { formatDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Бонусы и уровень" };

const typeLabels: Record<string, string> = {
  ACCRUAL: "Начисление",
  SPEND: "Списание",
  WELCOME: "Приветственные",
  REFERRAL: "За друга",
  REFUND: "Возврат",
  EXPIRE: "Сгорание",
};

export default async function BonusesPage() {
  const user = (await getCurrentUser())!;
  const [history, spent] = await Promise.all([getBonusHistory(user.id), getTotalSpent(user.id)]);
  const level = getLevel(spent);
  const next = nextLevel(spent);
  const progress = next ? Math.min(100, Math.round((spent / next.level.threshold) * 100)) : 100;

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Программа лояльности</p>
        <h1 className="mt-2 font-display text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">Бонусы</h1>
        <p className="mt-1.5 text-[13px] text-muted">1 бонус = 1 ₽. Начисляем после оплаты, списываем до 50% заказа.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-brand-900 p-6 text-cream">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/50">Доступно бонусов</p>
              <p className="mt-1 font-display text-5xl font-extrabold tracking-tight">{user.bonusBalance}</p>
              <p className="mt-1 text-[12px] text-cream/55">≈ {formatPrice(user.bonusBalance)} скидки</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-accent-300">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cream/60">Уровень «{level.name}»</span>
              <span className="text-cream/60">{next ? `до «${next.level.name}» ${formatPrice(next.remaining)}` : "максимум"}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream/15">
              <div className="h-full rounded-full bg-accent-400" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-[10px] text-cream/45">Потрачено за 12 месяцев: {formatPrice(spent)}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-line/80 bg-white p-5">
          <h2 className="font-display text-lg font-bold">Ваши привилегии</h2>
          <ul className="mt-3 space-y-2">
            {level.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-[12px] text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-900" />
                {perk}
              </li>
            ))}
          </ul>
          <Link href="/loyalty" className="mt-4 inline-block text-[11px] font-semibold text-brand-900 hover:text-accent-600">
            Все правила программы →
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Wallet, title: "1 бонус за 100 ₽", text: `Базовое начисление. На «Золотом» — 2 бонуса за 100 ₽.` },
          { icon: Gift, title: "До 50% заказа", text: "Списывайте бонусы при оформлении, но не больше половины суммы." },
          { icon: CalendarClock, title: "365 дней", text: `Бонусы действуют ${BONUS_RULES.ttlDays} дней с момента начисления.` },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-line/80 bg-white p-4">
            <card.icon className="h-4 w-4 text-brand-900" />
            <p className="mt-2 text-[12.5px] font-bold">{card.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{card.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-line/80 bg-white p-5">
        <h2 className="font-display text-lg font-bold">Уровни</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {LOYALTY_LEVELS.map((item) => (
            <div key={item.id} className={cn("rounded-2xl border p-4", item.id === level.id ? "border-brand-700 bg-brand-50" : "border-line")}>
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-bold">{item.name}</p>
                <TrendingUp className="h-3.5 w-3.5 text-muted" />
              </div>
              <p className="mt-1 text-[11px] text-muted">от {formatPrice(item.threshold)} за 12 месяцев</p>
              <p className="mt-2 text-[11px] font-semibold text-brand-900">×{item.multiplier} бонуса</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-line/80 bg-white p-5">
        <h2 className="font-display text-lg font-bold">История начислений</h2>
        {history.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-muted">Пока пусто. Первый заказ — и бонусы появятся здесь.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Дата</th>
                  <th className="py-2 font-semibold">Описание</th>
                  <th className="py-2 font-semibold">Тип</th>
                  <th className="py-2 text-right font-semibold">Бонусы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {history.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 text-muted">{formatDate(tx.createdAt)}</td>
                    <td className="py-2.5 font-medium text-ink">{tx.description}</td>
                    <td className="py-2.5"><span className="badge-outline">{typeLabels[tx.type] ?? tx.type}</span></td>
                    <td className={cn("py-2.5 text-right font-bold", tx.amount > 0 ? "text-brand-900" : "text-accent-600")}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
