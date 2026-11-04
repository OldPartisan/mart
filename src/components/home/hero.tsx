"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Заезжайте\nза свежей\nвыпечкой",
    text: "Готовим для вас\nс любовью!",
    image: "/images/figma/hero-pie.webp",
    alt: "Свежий пирог с яблоками",
    href: "/catalog/vypechka",
    label: "В каталог",
  },
  {
    title: "Фермерская\nполка —\nот своих",
    text: "Мёд, сыры и ягоды\nот хозяйств Татарстана",
    image: "/images/farmer.jpg",
    alt: "Фермер Татарстана",
    href: "/catalog/fermerskie-tovary",
    label: "Фермерские продукты",
  },
  {
    title: "Ужин\nза 30\nминут",
    text: "Пицца-трио, роллы\nи готовые блюда",
    image: "/images/figma/pizza-boxes-hero.webp",
    alt: "Пицца-трио в коробках",
    href: "/catalog/gotovaya-eda",
    label: "Готовая еда",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), 8000);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start !== null && end !== undefined && Math.abs(end - start) > 48) {
      go(index + (end < start ? 1 : -1));
    }
  };

  const slide = slides[index];

  return (
    <section className="bg-white py-3 sm:py-5" aria-roledescription="карусель" aria-label="Главные предложения">
      <div className="container-x">
        <div
          className="relative grid overflow-hidden rounded-[18px] bg-brand-700 lg:grid-cols-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 lg:hidden" aria-hidden="true">
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-700/85" />
          </div>

          <div
            className="relative z-10 flex min-h-[430px] flex-col justify-center px-6 py-7 sm:px-10 lg:min-h-[520px] lg:px-[64px] lg:py-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1.6px, transparent 1.7px)",
              backgroundSize: "14px 14px",
            }}
          >
            <div key={`text-${index}`} className="relative z-10 animate-fade-up">
              <h1 className="whitespace-pre-line font-display text-[34px] font-extrabold uppercase leading-[0.96] tracking-[-0.03em] text-white sm:text-[46px] lg:text-[62px] xl:text-[68px]">
                {slide.title}
              </h1>
              <p className="mt-3 whitespace-pre-line text-[18px] font-normal leading-[1.15] text-white sm:text-[23px] lg:mt-6 lg:text-[30px]">
                {slide.text}
              </p>
              <p className="mt-3 text-[12px] font-medium text-white/85 sm:text-[13px]">
                Самовывоз за 2 часа · доставка от 149 ₽
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-7">
                <Link
                  href={slide.href}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-accent-500 px-6 text-[14px] font-semibold text-white transition hover:bg-accent-600 lg:h-14 lg:px-8 lg:text-[16px]"
                >
                  {slide.label}
                </Link>
                <Link href="/delivery" className="text-[13px] font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  Доставка
                </Link>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex items-center gap-1.5 lg:mt-7">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    go(itemIndex);
                    setPaused(true);
                  }}
                  aria-label={`Слайд ${itemIndex + 1}`}
                  aria-current={itemIndex === index}
                  className="flex h-11 min-w-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all",
                      itemIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
                    )}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Включить автопрокрутку" : "Приостановить автопрокрутку"}
                className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] bg-[#F3F3F3] lg:block">
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(min-width: 1024px) 640px, 100vw"
              className={cn("animate-fade-up", index === 2 ? "object-contain p-4" : "object-cover")}
            />
          </div>

          <div className="absolute bottom-4 right-4 hidden gap-1.5 lg:flex">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Предыдущий слайд"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Следующий слайд"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
