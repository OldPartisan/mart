import Link from "next/link";
import { ArrowRight, Gift, Sparkles, Wallet } from "lucide-react";

export function LoyaltyBlock() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container-x">
        <div
          className="relative overflow-hidden rounded-[18px] bg-brand-700 px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1.6px, transparent 1.7px)",
            backgroundSize: "14px 14px",
          }}
        >
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/75">Программа лояльности</p>
              <h2 className="mt-2 font-display text-[30px] font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-[40px]">
                Бонусы 1 = 1 ₽
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-[1.5] text-white/90">
                1 бонус за каждые 100 ₽ покупки. Оплачивайте бонусами до половины заказа — без купонов и
                минимальной суммы. 300 бонусов — сразу за регистрацию.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Sparkles, title: "300 бонусов", text: "за регистрацию" },
                  { icon: Wallet, title: "до 50%", text: "оплата бонусами" },
                  { icon: Gift, title: "1 год", text: "срок действия" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/25 bg-white/10 p-3.5">
                    <item.icon className="h-4 w-4 text-white/80" />
                    <p className="mt-2 font-display text-[18px] font-bold leading-none">{item.title}</p>
                    <p className="mt-1 text-[11px] text-white/70">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/register" className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent-500 px-6 text-[14px] font-semibold text-white transition hover:bg-accent-600">
                  Получить 300 бонусов <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/loyalty" className="inline-flex h-12 items-center rounded-lg border border-white/50 px-6 text-[14px] font-semibold text-white transition hover:bg-white/10">
                  Правила программы
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[340px]">
              <div className="rotate-[-3deg] rounded-[18px] bg-white p-5 text-ink shadow-float">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Карта лояльности</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-brand-800">ИРБИС МАРТ</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-muted">Ваш баланс</p>
                <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  480 <span className="text-lg font-bold text-brand-700">бонусов</span>
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                  <span>Алия Г.</span>
                  <span>Уровень: Серебряный</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 rotate-[4deg] rounded-xl bg-accent-500 px-4 py-3 text-white shadow-float">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/80">Заказ на 1 240 ₽</p>
                <p className="mt-0.5 text-[13px] font-bold">+12 бонусов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
