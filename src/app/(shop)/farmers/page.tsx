import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Quote, Sprout } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { absoluteImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Наши фермеры",
  description: "Фермеры Татарстана, с которыми работает «Ирбис Март»: мёд, яйца, козий сыр, ягоды и овощи. Прямые поставки без посредников.",
  alternates: { canonical: "/farmers" },
  openGraph: { title: "Наши фермеры — Ирбис Март", description: "12 хозяйств Татарстана: знаем каждого по имени.", url: "/farmers", images: [absoluteImage("/images/farmer.jpg")] },
};

const farmers = [
  {
    name: "Рашид Гимадиев",
    farm: "Пасека в Осиново",
    place: "с. Осиново, Зеленодольский район",
    products: "Мёд цветочный, разнотравье",
    image: "/images/honey.jpg",
    quote: "Мёд привозим через день после откачки. Всё, что не продаётся, забираем обратно — на полке должен стоять свежий продукт.",
  },
  {
    name: "КФХ «Ак Барс»",
    farm: "Молочное и яичное хозяйство",
    place: "Зеленодольский район",
    products: "Яйца С1, молоко, творог",
    image: "/images/eggs.jpg",
    quote: "Куры на свободном выгуле, без стимуляторов. Яйцо собираем утром — в магазин привозим в тот же день.",
  },
  {
    name: "Сыроварня «Туган Як»",
    farm: "Козий сыр ручной работы",
    place: "Высокогорский район",
    products: "Козий сыр с травами, молодой сыр",
    image: "/images/cheese.jpg",
    quote: "Работаем маленькими партиями. Если молоко не то — сыр не варим, лучше подождём следующей недели.",
  },
  {
    name: "«Ягодная поляна»",
    farm: "Ягоды и сад",
    place: "Лаишевский район",
    products: "Клубника, голубика, смородина",
    image: "/images/strawberry.jpg",
    quote: "Собираем рано утром, пока прохладно. Ягода доезжает до полки в день сбора — это видно по вкусу.",
  },
];

const principles = [
  { title: "Прямые договоры", text: "Без перекупщиков и посредников: цена и качество зависят только от хозяйства." },
  { title: "Небольшие партии", text: "Лучше чаще привезти свежее, чем один раз закупить много и продавать неделю." },
  { title: "Имя на карточке", text: "Вы всегда знаете, кто вырастил или сделал продукт, — и можете задать вопрос." },
  { title: "Сезонность", text: "Клубника — летом, тыква — осенью. Не делаем вид, что всё есть круглый год." },
];

export default function FarmersPage() {
  return (
    <>
      <PageHero
        eyebrow="Фермерская полка"
        title="Люди, которые растят то, что вы едите"
        description="Мы работаем с двенадцатью хозяйствами Татарстана — напрямую, небольшими партиями и с именем производителя на каждой карточке."
        crumbs={[{ label: "Наши фермеры" }]}
        image="/images/farmer.jpg"
        imageAlt="Фермер в поле"
      />

      <section className="section">
        <div className="container-x grid gap-4 md:grid-cols-2">
          {farmers.map((farmer) => (
            <article key={farmer.name} className="overflow-hidden rounded-[2rem] border border-line/80 bg-white">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={farmer.image} alt={farmer.farm} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-xl font-bold text-ink">{farmer.name}</h2>
                    <p className="text-[12px] font-semibold text-brand-800">{farmer.farm}</p>
                  </div>
                  <span className="badge-outline"><MapPin className="h-3 w-3" /> {farmer.place}</span>
                </div>
                <p className="mt-2 text-[11.5px] text-muted">{farmer.products}</p>
                <div className="mt-3 flex gap-2 rounded-2xl bg-cream p-3">
                  <Quote className="h-4 w-4 shrink-0 text-brand-700" />
                  <p className="text-[12px] italic leading-relaxed text-ink-soft">{farmer.quote}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Наш подход</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Четыре правила фермерской полки</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Мы не называем фермерским продукт из распределительного центра. Полка маленькая — и это осознанно.
            </p>
            <Link href="/catalog/fermerskie-tovary" className="btn-primary mt-5">Фермерские товары <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-2xl border border-line/80 bg-white p-4">
                <Sprout className="h-4 w-4 text-brand-700" />
                <p className="mt-2 text-[12.5px] font-bold">{principle.title}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
