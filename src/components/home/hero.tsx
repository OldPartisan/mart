"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Заезжайте\nза свежей\nвыпечкой",
    text: "Готовим для вас\nс любовью!",
    image: "/images/figma/hero-pie.webp",
    alt: "Свежий пирог с яблоками",
    href: "/catalog/vypechka",
    label: "Перейти в каталог",
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
    image: "/images/figma/pizza-boxes.png",
    alt: "Пицца-трио в коробках",
    href: "/catalog/gotovaya-eda",
    label: "Готовая еда",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), 8000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[index];

  return (
    <section
      className="bg-white py-4 sm:py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="карусель"
      aria-label="Главные предложения"
    >
      <div className="container-x">
        <div className="relative grid overflow-hidden rounded-[18px] bg-brand-900 lg:grid-cols-2">
          <div
            className="relative flex min-h-[300px] flex-col justify-center px-6 py-9 sm:px-10 lg:min-h-[565px] lg:px-[70px]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1.6px, transparent 1.7px)",
              backgroundSize: "14px 14px",
            }}
          >
            <div key={`text-${index}`} className="animate-fade-up">
              <h1 className="whitespace-pre-line font-display text-[38px] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-[52px] lg:text-[68px] xl:text-[72px]">
                {slide.title}
              </h1>
              <p className="mt-4 whitespace-pre-line text-[20px] font-normal leading-[1.15] text-white sm:text-[26px] lg:mt-8 lg:text-[34px]">
                {slide.text}
              </p>
              <Link
                href={slide.href}
                className="mt-6 inline-flex h-[52px] items-center justify-center rounded-lg bg-accent-500 px-7 text-[15px] font-semibold text-white transition hover:bg-accent-600 lg:mt-9 lg:h-14 lg:px-8 lg:text-[17px]"
              >
                {slide.label}
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => go(itemIndex)}
                  aria-label={`Слайд ${itemIndex + 1}`}
                  aria-current={itemIndex === index}
                  className="flex h-6 min-w-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all",
                      itemIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[260px] bg-[#F3F3F3] sm:min-h-[340px] lg:min-h-[565px]">
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(min-width: 1024px) 640px, 100vw"
              className={cn("animate-fade-up", index === 2 ? "object-contain p-6" : "object-cover")}
            />
          </div>

          <div className="absolute bottom-4 right-4 hidden gap-1.5 lg:flex">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Предыдущий слайд"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Следующий слайд"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
