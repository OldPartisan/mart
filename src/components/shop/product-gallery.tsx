"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : ["/images/store.jpg"];

  const go = (next: number) => setActive((next + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-full",
              active === index ? "border-brand-800" : "border-transparent opacity-70 hover:opacity-100",
            )}
            aria-label={`Фото ${index + 1}`}
            aria-current={active === index}
          >
            <Image src={image} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="group relative aspect-square flex-1 overflow-hidden rounded-[2rem] bg-cream-dark">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-500"
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition hover:bg-white"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition hover:bg-white"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {gallery.map((image, index) => (
                <button
                  key={`dot-${image}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Фото ${index + 1}`}
                  className={cn("h-1.5 rounded-full transition-all", active === index ? "w-5 bg-white" : "w-1.5 bg-white/60")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
