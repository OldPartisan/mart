import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, MapPin, ShieldCheck, Store, Users } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { site } from "@/lib/site";
import { absoluteImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "О магазине",
  description: "История «Ирбис Март»: загородный супермаркет 2 609 м² у Новой Туры с собственным производством, кафе на 102 места и фермерской полкой.",
  alternates: { canonical: "/about" },
  openGraph: { title: "О магазине — Ирбис Март", description: "Супермаркет с собственным производством и кафе на трассе М-7.", url: "/about", images: [absoluteImage("/images/store.jpg")] },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О нас"
        title="Загородный супермаркет, в который хочется заехать"
        description="«Ирбис Март» — это 2 609 м² свежих продуктов, собственное производство, кафе на 102 места и фермерская полка в Новой Туре."
        crumbs={[{ label: "О магазине" }]}
        image="/images/store.jpg"
        imageAlt="Супермаркет Ирбис Март"
      />

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div className="prose-irbis">
            <p className="eyebrow">История</p>
            <h2 className="mt-2 text-h2 font-bold text-ink">Выросли из понимания, что нужно соседям</h2>
            <p>
              ГК IRBIS много лет работает в Зеленодольском районе: АЗС, производство, локальные проекты. Мы видели, как
              жителям Новой Туры, ТураНовы и ближних посёлков не хватает одного — места, где можно купить не только
              «хлеб и молоко», но и свежую фермерскую продукцию, готовый ужин и по-человечески посидеть с семьёй.
            </p>
            <p>
              Поэтому «Ирбис Март» — не магазин при заправке и не очередная «Пятёрочка». Это отдельный загородный
              супермаркет с собственной молочной, пекарней, кондитерской и кухней. Мы отвечаем за продукт на всех этапах:
              от фермы и рецептуры до полки и стойки самовывоза.
            </p>
            <p>
              Наш принцип простой: если продукт не нравится нам самим, он не попадёт в магазин. Поэтому мы лично знаем
              фермеров, проверяем каждую партию и обновляем полку несколько раз в день.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/farmers" className="btn-primary">Наши фермеры <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/own-production" className="btn-secondary">Собственное производство</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "2 609", label: "м² площадь магазина" },
              { value: "102", label: "места в кафе" },
              { value: "4", label: "собственных производства" },
              { value: "12", label: "фермерских хозяйств" },
            ].map((stat) => (
              <div key={stat.label} className="flex min-h-[130px] flex-col justify-end rounded-3xl bg-cream p-5">
                <p className="font-display text-4xl font-extrabold tracking-tight text-brand-900">{stat.value}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-muted">{stat.label}</p>
              </div>
            ))}
            <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src="/images/cafe-interior.jpg" alt="Кафе Ирбис Март" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-brand-950 text-cream">
        <div className="container-x">
          <p className="eyebrow text-accent-300">Принципы</p>
          <h2 className="mt-2.5 max-w-2xl text-h2 font-bold text-cream">Три вещи, которые мы делаем иначе</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: Leaf, title: "Свежесть без компромиссов", text: "Печём пять раз в день, кухня обновляет витрину каждые три часа, молочная работает с утра. Если срок подходит — продукт убираем, а не уцениваем до последнего." },
              { icon: Users, title: "Локальность по-настоящему", text: "Двенадцать хозяйств Татарстана, прямые договоры, имена фермеров на карточках. Деньги остаются в районе, а не уходят в федеральную сеть." },
              { icon: ShieldCheck, title: "Честный состав", text: "Никаких «усилителей вкуса» без указания. Пишем полный состав, производителя и срок хранения. Если не можем объяснить ингредиент — не берём." },
            ].map((value) => (
              <div key={value.title} className="rounded-3xl border border-cream/15 bg-cream/5 p-6">
                <value.icon className="h-5 w-5 text-accent-300" />
                <h3 className="mt-4 font-display text-xl font-bold">{value.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/60">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow">Команда</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Люди, которые за это отвечают</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Небольшая команда, которая знает магазин изнутри — и готова ответить на вопрос лично.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { name: "Айрат Сафин", role: "Директор супермаркета", text: "Отвечает за ассортимент и стандарты сервиса." },
                { name: "Гузель Хайруллина", role: "Руководитель производства", text: "Молочная, пекарня, кухня и кондитерская." },
                { name: "Рашид Гимадиев", role: "Фермер, пасека в Осиново", text: "Мёд, который стоит на нашей полке." },
              ].map((person) => (
                <div key={person.name} className="flex items-start gap-3 rounded-2xl border border-line/80 bg-white p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-900">
                    {person.name.split(" ").map((part) => part[0]).join("")}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{person.name}</p>
                    <p className="text-[11px] text-brand-800">{person.role}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">{person.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-cream p-6 sm:p-8">
            <p className="eyebrow">Как добраться</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">{site.address}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              15 минут от Казани и Зеленодольска по М-7. Своя парковка на 80 мест, отдельный вход в кафе и стойка
              самовывоза у входа.
            </p>
            <div className="mt-4 space-y-2 text-[12px]">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-700" /> {site.addressFull}</p>
              <p className="flex items-center gap-2"><Store className="h-4 w-4 text-brand-700" /> {site.hours}</p>
              <p className="flex items-center gap-2"><Heart className="h-4 w-4 text-accent-500" /> Детская комната и парковка для семей</p>
            </div>
            <Link href="/contacts" className="btn-primary btn-sm mt-5">Контакты и карта <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
