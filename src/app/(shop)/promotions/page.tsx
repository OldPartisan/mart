import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getPromotions } from "@/lib/queries";
import { PageHero } from "@/components/content/page-hero";
import { formatDate } from "@/lib/utils";
import { absoluteImage } from "@/lib/seo";
import { getPublishedCmsPage, cmsHero } from "@/lib/cms";
import { CmsBlocks } from "@/components/cms/cms-blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedCmsPage("promotions");
  return {
    title: cms?.page.seoTitle ?? "Акции и скидки",
    description: cms?.page.seoDescription ?? "Действующие акции «Ирбис Март»: скидки на собственную продукцию, фермерскую полку, комбо-наборы и готовую еду.",
    alternates: { canonical: "/promotions" },
    openGraph: { title: cms?.page.seoTitle ?? "Акции недели — Ирбис Март", description: cms?.page.seoDescription ?? "Скидки до 20% на своё производство и фермерские продукты.", url: "/promotions", images: [absoluteImage(cms?.page.ogImage ?? "/images/honey.jpg")] },
  };
}

export default async function PromotionsPage() {
  const [promotions, cms] = await Promise.all([getPromotions(), getPublishedCmsPage("promotions")]);
  const hero = cms ? cmsHero(cms.blocks.map((block) => ({ type: block.type, isVisible: block.isVisible, data: block.data }))) : null;
  const extraBlocks = cms ? cms.blocks.filter((block) => block.type !== "hero").map((block) => ({ id: block.id, type: block.type, data: block.data, isVisible: block.isVisible, sortOrder: block.sortOrder })) : [];

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Акции"}
        title={hero?.title || "Скидки, которые не прячутся в мелком шрифте"}
        description={hero?.description || "Каждую неделю обновляем предложения на собственную продукцию, фермерскую полку и готовую еду. Условия — на странице акции, без звёздочек."}
        crumbs={[{ label: "Акции" }]}
        cta={hero?.ctaLabel ? { href: hero.ctaHref || "/catalog", label: hero.ctaLabel } : undefined}
      />

      {extraBlocks.length > 0 && (
        <section className="section pb-0">
          <div className="container-x"><CmsBlocks blocks={extraBlocks} /></div>
        </section>
      )}

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
                  <span className={`badge absolute left-4 top-4 ${promotion.accent === "orange" ? "bg-accent-500 text-white" : "bg-brand-700 text-white"}`}>
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-brand-900 transition group-hover:bg-brand-700 group-hover:text-white">
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
