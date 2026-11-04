import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Croissant, CakeSlice, ChefHat, Milk, Thermometer, Timer, Truck } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { absoluteImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Собственное производство",
  description: "Молочная, пекарня, кондитерская и кухня «Ирбис Март»: полный цикл производства, свежесть и честный состав.",
  alternates: { canonical: "/own-production" },
  openGraph: { title: "Собственное производство — Ирбис Март", description: "От коровы до прилавка — без посредников.", url: "/own-production", images: [absoluteImage("/images/chef.jpg")] },
};

const lines = [
  {
    icon: Milk,
    title: "Молочная",
    image: "/images/dairy.jpg",
    text: "Принимаем молоко с фермы утром, пастеризуем и разливаем в тот же день. Кефир, творог, сметана и сыр — без растительных жиров и сухого молока.",
    facts: ["Молоко — 7 суток", "Творог — 5 суток", "Сыры — собственной сыроварни"],
  },
  {
    icon: Croissant,
    title: "Пекарня",
    image: "/images/bread-loaves.jpg",
    text: "Хлеб на закваске, багеты, круассаны и синнабоны. Пять выпечек в день: к открытию, к обеду, к вечеру и дважды между ними.",
    facts: ["Закваска своего выведения", "Без улучшителей", "Выпекаем каждые 3 часа"],
  },
  {
    icon: CakeSlice,
    title: "Кондитерская",
    image: "/images/cake.jpg",
    text: "Торты, медовик, чизкейки и десерты. Собираем вручную, без полуфабрикатов и замороженных коржей. Можно заказать торт к дате.",
    facts: ["Медовик — 8 коржей", "Предзаказ за 24 часа", "Надпись на торте"],
  },
  {
    icon: ChefHat,
    title: "Кухня и кафе",
    image: "/images/bowl.jpg",
    text: "Салаты, супы, горячее, пицца и роллы. Готовим небольшими партиями и обновляем витрину каждые три часа — не храним до вечера.",
    facts: ["102 места в кафе", "Завтраки и бизнес-ланчи", "Готовые обеды с собой"],
  },
];

const control = [
  { icon: Truck, title: "Приёмка", text: "Проверяем температуру, сроки и документы каждой партии. Молоко — на кислотность." },
  { icon: Thermometer, title: "Производство", text: "Раздельные цеха, контроль температуры, журнал каждой варки и выпечки." },
  { icon: Timer, title: "Полка", text: "Обновляем витрину по графику. Продукт с истекающим сроком убираем, а не уцениваем." },
  { icon: Check, title: "Дегустация", text: "Каждую новую партию пробует сменный технолог. Если сомневается — партия не выходит." },
];

export default function OwnProductionPage() {
  return (
    <>
      <PageHero
        eyebrow="Собственное производство"
        title="Мы производим сами — и поэтому отвечаем"
        description="Четыре производства под одной крышей: молочная, пекарня, кондитерская и кухня. Свежесть — не обещание, а ежедневный процесс."
        crumbs={[{ label: "Своё производство" }]}
        image="/images/chef.jpg"
        imageAlt="Повар за работой"
        cta={{ href: "/catalog", label: "Попробовать" }}
      />

      <section className="section">
        <div className="container-x space-y-6">
          {lines.map((line, index) => (
            <article key={line.title} className="grid overflow-hidden rounded-[2rem] border border-line/80 bg-white lg:grid-cols-2">
              <div className={`relative min-h-[240px] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image src={line.image} alt={line.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <line.icon className="h-5 w-5 text-brand-900" />
                <h2 className="mt-3 font-display text-2xl font-bold text-ink">{line.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{line.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {line.facts.map((fact) => (
                    <li key={fact} className="badge-green">{fact}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-brand-950 text-white">
        <div className="container-x">
          <p className="eyebrow text-accent-300">Контроль качества</p>
          <h2 className="mt-2.5 max-w-2xl text-h2 font-bold text-white">Четыре барьера до вашей корзины</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {control.map((step, index) => (
              <div key={step.title} className="border-t border-cream/20 pt-4">
                <span className="text-[11px] font-bold text-accent-300">0{index + 1}</span>
                <step.icon className="mt-3 h-5 w-5 text-white/90" />
                <h3 className="mt-2 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/80">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/quality" className="inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-[13px] font-bold text-brand-900">
              Гарантия качества <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/cafe" className="inline-flex h-11 items-center rounded-full border border-cream/25 px-5 text-[13px] font-semibold text-white/80">
              Кафе и кухня
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
