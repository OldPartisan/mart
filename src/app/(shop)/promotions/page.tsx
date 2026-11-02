import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getPromotions } from "@/lib/queries";
import { PageHero } from "@/components/content/page-hero";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Акции и скидки",
  description: "Действующие акции «Ирбис Март»: скидки на собственную продукцию, фермерскую полку, комбо-наборы и готовую еду.",
  alternates: { canonical: "/promotions" },
  openGraph: { title: "Акции недели — Ирбис Март", description: "Скидки до 20% на своё производство и фермерские продукты.", url: "/promotions", images: ["/images/honey.jpg"] },
};

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <>
      <PageHero
        eyebrow="Акции"
        title="Скидки, которые не прячутся в мелком шрифте"
        description="Каждую неделю обновляем предложения на собственную продукцию, фермерскую полку и готовую еду. Условия — на странице акции, без звёздочек."
        crumbs={[{ label: "Акции" }]}
      />

      <section className="section">
        <div className="container-x grid gap-4 md:grid-cols-2">
          {promotions.map((promotion) => (
            <Link
              key={promotion.id}
              href={`/promotions/${promotion.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-line/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={promotion.image}
                  alt={promotion.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                {promotion.badge && (
                  <span className={`badge absolute left-4 top-4 ${promotion.accent === "orange" ? "bg-accent-500 text-white" : "bg-brand-800 text-cream"}`}>
                    {promotion.badge}
                  </span>
                )}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold leading-tight text-ink">{promotion.title}</h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{promotion.subtitle}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-brand-800 transition group-hover:bg-brand-800 group-hover:text-cream">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                {promotion.endsAt && (
                  <p className="mt-4 flex items-center gap-1.5 border-t border-line/70 pt-3 text-[11px] text-muted">
                    <CalendarDays className="h-3.5 w-3.5" /> до {formatDate(promotion.endsAt)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
