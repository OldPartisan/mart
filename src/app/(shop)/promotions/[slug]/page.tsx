import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Tag } from "lucide-react";
import { getPromotionBySlug, getPromotions } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { getPromotions } = await import("@/lib/queries");
  const rows = await getPromotions();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const promotion = await getPromotionBySlug(slug);
  if (!promotion) return { title: "Акция не найдена" };
  return {
    title: promotion.title,
    description: promotion.subtitle,
    alternates: { canonical: `/promotions/${promotion.slug}` },
    openGraph: {
      title: `${promotion.title} — Ирбис Март`,
      description: promotion.subtitle,
      url: `/promotions/${promotion.slug}`,
      images: [absoluteImage(promotion.image)],
    },
  };
}

export default async function PromotionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const promotion = await getPromotionBySlug(slug);
  if (!promotion || !promotion.isActive) notFound();
  const others = (await getPromotions()).filter((item) => item.id !== promotion.id).slice(0, 3);

  return (
    <>
      <div className="container-x pt-5">
        <Breadcrumbs items={[{ label: "Акции", href: "/promotions" }, { label: promotion.title }]} />
      </div>

      <article className="container-x py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            {promotion.badge && <span className="badge bg-accent-500 text-white">{promotion.badge}</span>}
            <h1 className="mt-3 text-h1 font-bold text-ink text-balance">{promotion.title}</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{promotion.subtitle}</p>
            {promotion.endsAt && (
              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-muted">
                <CalendarDays className="h-3.5 w-3.5" /> Действует до {formatDate(promotion.endsAt)}
              </p>
            )}

            <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[2rem]">
              <Image src={promotion.image} alt={promotion.title} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>

            <div className="prose-irbis mt-7">
              {promotion.description.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-line/80 bg-white p-5 lg:sticky lg:top-[150px]">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Tag className="h-4 w-4 text-brand-700" /> Условия
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{promotion.terms}</p>
              <ul className="mt-4 space-y-2 border-t border-line/70 pt-4">
                {["Скидка применяется автоматически в корзине", "Бонусы начисляются после оплаты", "Можно забрать через 2 часа"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/catalog" className="btn-primary mt-5 w-full">
                К товарам акции <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/promotions" className="mt-2 flex h-9 items-center justify-center gap-1 text-[11px] font-semibold text-muted hover:text-brand-800">
                <ArrowLeft className="h-3.5 w-3.5" /> Все акции
              </Link>
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <div className="mt-12 border-t border-line/70 pt-8">
            <h2 className="mb-4 font-display text-xl font-bold">Другие акции</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {others.map((item) => (
                <Link key={item.id} href={`/promotions/${item.slug}`} className="group flex items-center gap-3 rounded-2xl border border-line/80 bg-white p-3 transition hover:border-brand-700/40">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-tight text-ink">{item.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[10.5px] text-muted">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
