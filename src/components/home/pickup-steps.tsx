import Link from "next/link";
import { ArrowRight, Clock, CreditCard, ShoppingBasket, Store } from "lucide-react";
import { site } from "@/lib/site";

const steps = [
  { icon: ShoppingBasket, title: "Соберите корзину", text: "Выберите товары на сайте — от молока до комбо." },
  { icon: CreditCard, title: "Оплатите или заплатите при получении", text: "Картой онлайн, бонусами до 50% или на кассе." },
  { icon: Clock, title: "Заберите через 2 часа", text: `Храним заказ ${site.pickupStorage}. Соберём к выбранному времени.` },
  { icon: Store, title: "По пути домой", text: "Отдельная стойка самовывоза у входа, без очереди." },
];

export function PickupSteps() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-x">
        <div className="rounded-[2rem] border border-line/80 bg-[#FBF8F1] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Самовывоз и доставка</p>
              <h2 className="mt-2 text-h2 font-bold text-ink">Заказ готов через 2 часа</h2>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
                Бесплатный самовывоз в Новой Туре. Доставка по ближним посёлкам — от 149 ₽, бесплатно от {site.deliveryFreeFrom} ₽.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/pickup" className="btn-primary">
                Как работает самовывоз <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/delivery" className="btn-secondary">
                Доставка и оплата
              </Link>
            </div>
          </div>

          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-900 text-[12px] font-bold text-cream">
                  {index + 1}
                </span>
                <div>
                  <step.icon className="mb-1.5 h-4 w-4 text-brand-900" aria-hidden="true" />
                  <p className="text-[13px] font-bold leading-tight text-ink">{step.title}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
