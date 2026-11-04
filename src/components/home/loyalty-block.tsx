import Image from "next/image";
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
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">Программа лояльности</p>
              <h2 className="mt-2 font-display text-[30px] font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-[40px]">
                Бонусы 1 = 1 ₽
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-[1.5] text-white">
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
                    <item.icon className="h-4 w-4 text-white" />
                    <p className="mt-2 font-display text-[18px] font-bold leading-none">{item.title}</p>
                    <p className="mt-1 text-[11px] text-white">{item.text}</p>
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

            <div className="relative mx-auto w-full max-w-[520px]">
              <Image
                src="/images/figma/loyalty-card.webp"
                width={1600}
                height={998}
                alt="Карта постоянного покупателя «Ирбис Март»"
                sizes="(min-width: 1024px) 520px, 90vw"
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
