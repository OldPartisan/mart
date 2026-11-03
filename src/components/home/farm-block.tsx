import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Quote } from "lucide-react";

const farms = [
  { name: "Пасека Гимадиева", place: "Осиново", product: "мёд" },
  { name: "КФХ «Ак Барс»", place: "Зеленодольский район", product: "яйца, молоко" },
  { name: "Сыроварня «Туган Як»", place: "Высокогорский район", product: "козий сыр" },
  { name: "«Ягодная поляна»", place: "Лаишево", product: "клубника, голубика" },
];

export function FarmBlock() {
  return (
    <section className="section bg-white">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <p className="eyebrow">Фермерская полка</p>
          <h2 className="mt-3 text-h2 font-bold text-ink text-balance">У каждого продукта есть имя и хозяйство</h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Мы работаем с двенадцатью хозяйствами Татарстана. Покупаем небольшими партиями, проверяем каждую поставку
            и указываем производителя на карточке товара. Так вы знаете, что едите и у кого покупаете.
          </p>

          <div className="mt-6 rounded-2xl border border-line bg-cream/60 p-4">
            <Quote className="h-5 w-5 text-brand-900" aria-hidden="true" />
            <blockquote className="mt-2 text-[14px] italic leading-relaxed text-ink-soft">
              «Мы привозим мёд в магазин через день после откачки. Всё, что не продаётся, забираем обратно — нам важно,
              чтобы на полке стоял мёд, а не прошлогодний запас».
            </blockquote>
            <p className="mt-3 text-[12px] font-semibold text-ink">Рашид Гимадиев · пасека в Осиново</p>
          </div>

          <ul className="mt-6 divide-y divide-line/70">
            {farms.map((farm) => (
              <li key={farm.name} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-[13px] font-semibold text-ink">{farm.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted">
                    <MapPin className="h-3 w-3" /> {farm.place}
                  </p>
                </div>
                <span className="badge-outline">{farm.product}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/farmers" className="btn-primary">
              Познакомиться с фермерами <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog/fermerskie-tovary" className="btn-secondary">
              Фермерские товары
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
            <Image src="/images/farmer.jpg" alt="Фермер за работой" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -left-3 top-6 rounded-2xl bg-accent-500 px-4 py-3 text-white shadow-float sm:-left-6">
            <p className="font-display text-2xl font-extrabold leading-none">12</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">местных хозяйств</p>
          </div>
          <div className="absolute -bottom-4 right-4 rounded-2xl bg-white px-4 py-3 shadow-float sm:right-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Свежесть</p>
            <p className="mt-0.5 text-[13px] font-bold text-ink">привозим 3 раза в неделю</p>
          </div>
        </div>
      </div>
    </section>
  );
}
