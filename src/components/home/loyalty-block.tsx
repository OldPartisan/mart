import Link from "next/link";
import { ArrowRight, Gift, Sparkles, Wallet } from "lucide-react";

export function LoyaltyBlock() {
  return (
    <section className="section bg-[#FBF8F1]">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-6 py-10 text-cream sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-cream/10" />
          <div className="pointer-events-none absolute -right-4 top-10 h-40 w-40 rounded-full border border-cream/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow text-accent-300">Программа лояльности</p>
              <h2 className="mt-3 max-w-xl text-h2 font-bold text-cream text-balance">Бонусы, которые возвращаются на полку</h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/65">
                1 бонус за каждые 100 ₽ покупки. 1 бонус = 1 ₽. Оплачивайте бонусами до половины заказа — без купонов,
                без минимальной суммы и без срока «только сегодня».
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Sparkles, title: "300 бонусов", text: "за регистрацию" },
                  { icon: Wallet, title: "до 50%", text: "оплата бонусами" },
                  { icon: Gift, title: "1 год", text: "срок действия" },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-cream/15 bg-cream/5 p-3.5">
                    <item.icon className="h-4 w-4 text-accent-300" />
                    <p className="mt-2 font-display text-lg font-bold leading-none">{item.title}</p>
                    <p className="mt-1 text-[11px] text-cream/55">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-500 px-5 text-[13px] font-bold text-white transition hover:bg-accent-600">
                  Получить 300 бонусов <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/loyalty" className="inline-flex h-11 items-center rounded-full border border-cream/25 px-5 text-[13px] font-semibold text-cream/80 transition hover:border-cream/50 hover:text-cream">
                  Правила программы
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[360px]">
              <div className="rotate-[-3deg] rounded-3xl bg-cream p-5 text-ink shadow-float">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Карта лояльности</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-brand-900">ИРБИС МАРТ</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-cream">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-muted">Ваш баланс</p>
                <p className="font-display text-4xl font-extrabold tracking-tight text-brand-900">
                  480 <span className="text-lg font-bold text-brand-700">бонусов</span>
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                  <span>Алия Г.</span>
                  <span>Уровень: Серебряный</span>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-2 rotate-[4deg] rounded-2xl bg-accent-500 px-4 py-3 text-white shadow-float sm:-right-5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/75">Заказ на 1 240 ₽</p>
                <p className="mt-0.5 text-[13px] font-bold">+12 бонусов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
