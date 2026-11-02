import { Star } from "lucide-react";
import type { Review } from "@/db/schema";
import { SectionTitle } from "./section-title";
import { initials } from "@/lib/utils";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container-x">
        <SectionTitle title="Отзывы гостей" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <figure key={review.id} className="flex flex-col rounded-[18px] bg-[#F7F8F9] p-5">
              <div className="flex items-center gap-1" aria-label={`Оценка ${review.rating} из 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-3.5 w-3.5 ${index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-line"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[14px] leading-[1.45] text-ink">{review.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-800">
                  {initials(review.authorName)}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-ink">{review.authorName}</p>
                  <p className="text-[10px] text-muted">{review.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
