import { Quote, Star } from "lucide-react";
import type { Review } from "@/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { initials } from "@/lib/utils";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Отзывы гостей"
          title="Что говорят соседи"
          description="Собрали отзывы покупателей из Новой Туры, ТураНовы, Осинова и Зеленодольска."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <figure key={review.id} className="relative flex flex-col rounded-3xl border border-line/80 bg-[#FBF8F1] p-6">
              <div className="flex items-center gap-1" aria-label={`Оценка ${review.rating} из 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-3.5 w-3.5 ${index < review.rating ? "fill-accent-500 text-accent-500" : "text-line"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{review.text}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line/70 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-900">
                  {initials(review.authorName)}
                </span>
                <div>
                  <p className="text-[12px] font-bold text-ink">{review.authorName}</p>
                  <p className="text-[10px] text-muted">{review.location}</p>
                </div>
                <Quote className="ml-auto h-5 w-5 text-brand-200" aria-hidden="true" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
