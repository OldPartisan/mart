import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Phone, ShoppingBasket, Store } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { Faq } from "@/components/content/faq";
import { site as shop } from "@/lib/site";

export const metadata: Metadata = {
  title: "Самовывоз",
  description: "Самовывоз из «Ирбис Март»: заказ готов через 2 часа, бесплатно, хранение 24 часа. Как оформить и забрать.",
  alternates: { canonical: "/pickup" },
  openGraph: { title: "Самовывоз — Ирбис Март", description: "Соберите заказ онлайн и заберите в Новой Туре через 2 часа.", url: "/pickup", images: ["/images/figma/tile-market.webp"] },
};

const faq = [
  { q: "Где забрать заказ?", a: "Стойка самовывоза сразу у входа в супермаркет, слева от касс. Назовите номер заказа — его уже собрали." },
  { q: "Сколько хранится заказ?", a: "24 часа с выбранного времени. Если не успеваете — позвоните, продлим до конца дня." },
  { q: "Можно ли изменить заказ после оформления?", a: "Пока заказ не собран — да, позвоните на стойку. После сборки добавьте покупки на кассе отдельно." },
  { q: "Нужно ли платить заранее?", a: "Нет. Можно выбрать оплату при получении: картой или наличными. Онлайн-оплата тоже доступна." },
];

export default function PickupPage() {
  return (
    <>
      <PageHero
        eyebrow="Самовывоз"
        title="Заказ готов через 2 часа. Без очереди и доставки"
        description="Соберите корзину на сайте, выберите удобный интервал — и заберите в Новой Туре. Бесплатно, хранение 24 часа."
        crumbs={[{ label: "Самовывоз" }]}
        image="/images/figma/tile-market.webp"
        imageAlt="Торговый зал Ирбис Март"
        cta={{ href: "/catalog", label: "Собрать заказ" }}
      />

      <section className="section">
        <div className="container-x">
          <ol className="grid gap-4 md:grid-cols-4">
            {[
              { icon: ShoppingBasket, title: "Собираете корзину", text: "Добавляйте товары и следите за суммой — бонусы и промокоды применяются на оформлении." },
              { icon: Clock, title: "Выбираете время", text: "Интервалы с 10:00 до 22:00 на ближайшие 5 дней. Минимум 2 часа на сборку." },
              { icon: Check, title: "Оплачиваете", text: "Картой онлайн, бонусами до 50% или при получении на кассе." },
              { icon: Store, title: "Забираете", text: "Стойка у входа. Назовите номер — отдадим собранный заказ." },
            ].map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-line/80 bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-[12px] font-bold text-cream">{index + 1}</span>
                <step.icon className="mt-4 h-4 w-4 text-brand-700" />
                <p className="mt-1.5 text-[13px] font-bold">{step.title}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-4 rounded-[2rem] bg-brand-900 p-6 text-cream sm:p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-300">Адрес</p>
              <p className="mt-2 font-display text-2xl font-bold">{shop.address}</p>
              <p className="mt-1 text-[13px] text-cream/60">{shop.hours} · стойка самовывоза у входа</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={shop.phoneHref} className="inline-flex h-10 items-center gap-2 rounded-full bg-cream px-4 text-[12px] font-bold text-brand-900">
                  <Phone className="h-3.5 w-3.5" /> {shop.phone}
                </a>
                <a href={`https://yandex.ru/maps/?pt=${shop.coords.lng},${shop.coords.lat}&z=16`} target="_blank" rel="noreferrer noopener" className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/25 px-4 text-[12px] font-semibold text-cream/85">
                  <MapPin className="h-3.5 w-3.5" /> На карте
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-cream/10 p-4 text-[12px] leading-relaxed text-cream/75">
              <p className="font-semibold text-cream">Что взять с собой</p>
              <ul className="mt-2 space-y-1.5">
                <li>· Номер заказа (придёт в SMS и на email)</li>
                <li>· Телефон для подтверждения</li>
                <li>· Если оплачиваете на месте — карту или наличные</li>
              </ul>
              <p className="mt-3 text-[11px] text-cream/50">Заказ хранится 24 часа. Скоропортящиеся продукты — в холодильнике стойки.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/delivery" className="link-underline">Условия доставки <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      <Faq items={faq} title="Вопросы о самовывозе" />
    </>
  );
}
