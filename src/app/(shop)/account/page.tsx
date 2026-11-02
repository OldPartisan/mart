import Link from "next/link";
import { ArrowRight, Gift, Package, Sparkles, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getBonusHistory, getTotalSpent, getUserOrders } from "@/lib/queries";
import { getLevel, nextLevel } from "@/lib/bonuses";
import { formatPrice } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const [orders, spent, bonusHistory] = await Promise.all([
    getUserOrders(user.id),
    getTotalSpent(user.id),
    getBonusHistory(user.id),
  ]);
  const level = getLevel(spent);
  const next = nextLevel(spent);
  const progress = next ? Math.min(100, Math.round((spent / next.level.threshold) * 100)) : 100;
  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Личный кабинет</p>
        <h1 className="mt-2 font-display text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">Привет, {user.name.split(" ")[0]}!</h1>
        <p className="mt-1.5 text-[13px] text-muted">Здесь заказы, бонусы и персональные предложения.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-brand-900 p-5 text-cream">
          <Sparkles className="h-5 w-5 text-accent-300" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-cream/55">Бонусный баланс</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{user.bonusBalance}</p>
          <p className="mt-1 text-[11px] text-cream/55">1 бонус = 1 ₽ · до 50% заказа</p>
          <Link href="/account/bonuses" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent-300">
            История начислений <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-3xl border border-line/80 bg-white p-5">
          <Package className="h-5 w-5 text-brand-700" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted">Заказов</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{orders.length}</p>
          <p className="mt-1 text-[11px] text-muted">за всё время</p>
          <Link href="/account/orders" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800">
            Все заказы <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-3xl border border-line/80 bg-white p-5">
          <TrendingUp className="h-5 w-5 text-brand-700" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted">Уровень</p>
          <p className="mt-1 font-display text-xl font-extrabold">{level.name}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-dark">
            <div className="h-full rounded-full bg-brand-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {next ? `До «${next.level.name}» — ${formatPrice(next.remaining)}` : "Максимальный уровень"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-line/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Последние заказы</h2>
            <Link href="/account/orders" className="text-[11px] font-semibold text-brand-800">Все</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[13px] text-muted">Пока нет заказов. Самое время начать с молочной полки.</p>
              <Link href="/catalog" className="btn-primary btn-sm mt-3">В каталог</Link>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-line/70">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link href={`/account/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3 transition hover:bg-cream/40">
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{order.number}</p>
                      <p className="text-[11px] text-muted">{formatDate(order.createdAt)} · {order.deliveryType === "PICKUP" ? "самовывоз" : "доставка"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("badge", ORDER_STATUSES[order.status]?.tone)}>{ORDER_STATUSES[order.status]?.label}</span>
                      <span className="text-[13px] font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-line/80 bg-white p-5">
          <h2 className="font-display text-lg font-bold">Ваш код друга</h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            Поделитесь кодом: другу — 300 бонусов за регистрацию, вам — 300 бонусов за приглашение.
          </p>
          <p className="mt-3 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-3 py-2.5 text-center font-display text-sm font-bold tracking-wider text-brand-900">
            {user.referralCode}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-cream p-3">
            <Gift className="h-4 w-4 text-accent-500" />
            <p className="text-[11px] text-ink-soft">Бонусы действуют 365 дней с момента начисления.</p>
          </div>
        </section>
      </div>

      {bonusHistory.length > 0 && (
        <section className="rounded-3xl border border-line/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Бонусы в движении</h2>
            <Link href="/account/bonuses" className="text-[11px] font-semibold text-brand-800">Вся история</Link>
          </div>
          <ul className="mt-3 divide-y divide-line/70">
            {bonusHistory.slice(0, 4).map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-[12px] font-semibold text-ink">{tx.description}</p>
                  <p className="text-[10px] text-muted">{formatDate(tx.createdAt)}</p>
                </div>
                <span className={cn("text-[13px] font-bold", tx.amount > 0 ? "text-brand-800" : "text-accent-600")}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
