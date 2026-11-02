import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Check, Gift, Sparkles, Star, Wallet } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { Faq } from "@/components/content/faq";
import { BONUS_RULES, LOYALTY_LEVELS } from "@/lib/bonuses";
import { formatPrice } from "@/lib/money";

export const metadata: Metadata = {
  title: "Программа лояльности",
  description: "Бонусная программа «Ирбис Март»: 1 бонус за 100 ₽, 1 бонус = 1 ₽, оплата до 50% заказа, 300 бонусов за регистрацию.",
  alternates: { canonical: "/loyalty" },
  openGraph: { title: "Программа лояльности — Ирбис Март", description: "1 бонус = 1 ₽. Копите и оплачивайте до 50% заказа.", url: "/loyalty", images: ["/images/coffee.jpg"] },
};

const faq = [
  { q: "Когда начисляются бонусы?", a: "После успешной оплаты заказа — обычно в течение минуты. При оплате при получении бонусы приходят после закрытия чека." },
  { q: "Сколько можно списать за раз?", a: "До 50% суммы заказа и не больше вашего баланса. Бонусы не обмениваются на деньги и не выдаются наличными." },
  { q: "Сгорают ли бонусы?", a: "Да, через 365 дней с момента начисления. В личном кабинете видна история — мы предупредим заранее, если срок подходит." },
  { q: "Как получить уровень выше?", a: "Уровень зависит от суммы оплаченных заказов за 12 месяцев. Серебряный — от 15 000 ₽, Золотой — от 50 000 ₽." },
  { q: "Можно ли копить бонусы на АЗС IRBIS?", a: "Программа готовится к объединению с АЗС. Сейчас бонусы действуют в супермаркете и кафе «Ирбис Март»." },
];

export default function LoyaltyPage() {
  return (
    <>
      <PageHero
        eyebrow="Бонусная программа"
        title="1 бонус = 1 ₽. Без сложных условий"
        description="Копите бонусы с каждой покупки и оплачивайте ими до половины заказа. Никаких купонов, периодов и «только для избранных»."
        crumbs={[{ label: "Программа лояльности" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn-primary">Получить 300 бонусов <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/account/bonuses" className="btn-secondary">Мой баланс</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, value: "300", label: "бонусов за регистрацию" },
            { icon: Wallet, value: "50%", label: "заказа можно оплатить бонусами" },
            { icon: Gift, value: "1 ₽", label: "стоит один бонус" },
            { icon: CalendarClock, value: "365", label: "дней срок действия" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-line/80 bg-white p-5">
              <item.icon className="h-5 w-5 text-brand-700" />
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">{item.value}</p>
              <p className="mt-1 text-[11.5px] leading-snug text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <p className="eyebrow">Как это работает</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Три шага — и бонусы ваши</h2>
            <ol className="mt-6 space-y-5">
              {[
                { title: "Зарегистрируйтесь", text: "Начислим 300 приветственных бонусов. Они сразу доступны для оплаты." },
                { title: "Покупайте как обычно", text: "1 бонус за каждые 100 ₽. На Серебряном уровне — 1,5 бонуса, на Золотом — 2." },
                { title: "Платите бонусами", text: "На оформлении включите «Списать бонусы» и выберите сумму до 50% заказа." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 font-display text-sm font-bold text-cream">{index + 1}</span>
                  <div>
                    <p className="font-display text-lg font-bold text-ink">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 rounded-3xl border border-line bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Пример</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                Заказ на <strong className="text-ink">2 400 ₽</strong>. Платите 480 бонусами — остаётся 1 920 ₽.
                За покупку начисляем 24 бонуса. Итого на следующем заказе у вас снова есть скидка.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-brand-900 p-6 text-cream sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-300">Уровни</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Растём вместе с вашими покупками</h2>
            <div className="mt-5 space-y-3">
              {LOYALTY_LEVELS.map((level) => (
                <div key={level.id} className="rounded-2xl border border-cream/15 bg-cream/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-base font-bold">{level.name}</p>
                    <span className="badge bg-cream/10 text-accent-300">×{level.multiplier}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-cream/55">от {formatPrice(level.threshold)} за 12 месяцев</p>
                  <ul className="mt-2 space-y-1">
                    {level.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-1.5 text-[11px] text-cream/70">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-300" /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Правила</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Коротко и по делу</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">Полные условия — в пользовательском соглашении. Здесь — главное.</p>
            <Link href="/legal/terms" className="link-underline mt-4">Пользовательское соглашение <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "Начисление", text: "1 бонус за каждые 100 ₽ оплаченного заказа. Бонусы начисляются после оплаты, а не в момент оформления." },
              { title: "Списание", text: "До 50% суммы заказа, но не более баланса. Бонусы списываются в момент создания заказа; при отмене возвращаются." },
              { title: "Срок действия", text: `Бонусы действуют ${BONUS_RULES.ttlDays} дней. Списываем сначала те, у которых срок истекает раньше.` },
              { title: "Возврат товара", text: "При возврате оплаченного заказа бонусы, начисленные за него, сторнируются. Списание возвращается на баланс." },
              { title: "Реферальная программа", text: "За друга, зарегистрировавшегося по вашему коду, — 300 бонусов вам и 300 другу после его первого заказа." },
            ].map((rule) => (
              <div key={rule.title} className="rounded-2xl border border-line/80 p-4">
                <p className="flex items-center gap-2 text-[12.5px] font-bold text-ink"><Star className="h-3.5 w-3.5 text-accent-500" /> {rule.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={faq} title="Вопросы о бонусах" />
    </>
  );
}
