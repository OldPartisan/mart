"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Leaf, Snowflake, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: "Собственное производство",
    title: "Свежее — от своих.",
    text: "Молоко, мясо и выпечка собственного производства. Каждое утро — с фермы и из нашей пекарни на полку.",
    image: "/images/milk-pour.jpg",
    alt: "Свежее молоко собственного производства",
    primary: { href: "/own-production", label: "Наше производство" },
    secondary: { href: "/catalog/molochnaya-produktsiya", label: "Молочная полка" },
    sticker: { value: "−20%", label: "на молочную полку" },
    badge: "Своё производство",
    chips: ["Молоко", "Творог", "Сыры"],
  },
  {
    eyebrow: "Фермерская полка",
    title: "Знакомьтесь: ваши фермеры.",
    text: "Мёд, сыры, ягоды и овощи от хозяйств Татарстана. Мы знаем каждого поставщика по имени — и пишем его на упаковке.",
    image: "/images/farm.jpg",
    alt: "Фермерское хозяйство в Татарстане",
    primary: { href: "/farmers", label: "Наши фермеры" },
    secondary: { href: "/catalog/fermerskie-tovary", label: "Фермерские товары" },
    sticker: { value: "12", label: "местных хозяйств" },
    badge: "Фермерское",
    chips: ["Мёд", "Козий сыр", "Ягоды"],
  },
  {
    eyebrow: "Готовая еда и комбо",
    title: "Ужин за 30 минут.",
    text: "Пицца, салаты и комбо для семьи. Закажите на сайте — соберём к вашему приезду, без очереди и готовки.",
    image: "/images/pizza.jpg",
    alt: "Пицца из кухни Ирбис Март",
    primary: { href: "/catalog/kombo-nabory", label: "Комбо-наборы" },
    secondary: { href: "/catalog/gotovaya-eda", label: "Готовая еда" },
    sticker: { value: "30 мин", label: "и ужин на столе" },
    badge: "Кухня IRBIS",
    chips: ["Пицца", "Роллы", "Бургеры"],
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((current) => (current + 1) % slides.length), 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden border-b border-line/70 bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="карусель"
      aria-label="Главные предложения"
    >
      <div className="container-x relative grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-14">
        <div key={`text-${index}`} className="animate-fade-up">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="badge bg-brand-800 text-cream">
              <Leaf className="h-3 w-3" /> {slide.eyebrow}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <MapPinMini /> с. Новая Тура · трасса М-7
            </span>
          </div>

          <h1 className="max-w-xl font-display text-display font-extrabold text-ink text-balance">{slide.title}</h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft/85 sm:text-base">{slide.text}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={slide.primary.href} className="btn-primary">
              {slide.primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={slide.secondary.href} className="btn-secondary">
              {slide.secondary.label}
            </Link>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-line/80 pt-5">
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <Clock className="h-3.5 w-3.5 text-brand-700" /> Самовывоз
              </dt>
              <dd className="mt-1 font-display text-[15px] font-bold text-ink">через 2 часа</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <Snowflake className="h-3.5 w-3.5 text-brand-700" /> Свежесть
              </dt>
              <dd className="mt-1 font-display text-[15px] font-bold text-ink">своё производство</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <Star className="h-3.5 w-3.5 text-accent-500" /> Бонусы
              </dt>
              <dd className="mt-1 font-display text-[15px] font-bold text-ink">1 бонус = 1 ₽</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[2.5rem] bg-brand-900 shadow-float sm:aspect-[5/5] lg:aspect-[4/5]">
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 520px, 90vw"
              className="animate-fade-up object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-transparent to-transparent" />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-brand-900 shadow-card backdrop-blur">
              <Leaf className="h-3.5 w-3.5 text-brand-700" /> {slide.badge}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="rounded-2xl bg-white/95 p-3 shadow-card backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">На полке сегодня</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {slide.chips.map((chip) => (
                    <span key={chip} className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-accent-500 text-center text-white shadow-lg sm:h-24 sm:w-24">
                <span className="font-display text-lg font-extrabold leading-none sm:text-xl">{slide.sticker.value}</span>
                <span className="mt-1 max-w-[80%] text-[8px] font-semibold leading-tight sm:text-[9px]">{slide.sticker.label}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Слайды">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={itemIndex === index}
                  aria-label={`Слайд ${itemIndex + 1}: ${item.title}`}
                  onClick={() => go(itemIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    itemIndex === index ? "w-8 bg-brand-800" : "w-1.5 bg-brand-800/25 hover:bg-brand-800/50",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Предыдущий слайд"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Следующий слайд"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:bg-white"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPinMini() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent-500" fill="none" aria-hidden="true">
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="6.5" r="1.6" fill="currentColor" />
    </svg>
  );
}
