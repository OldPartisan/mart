import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Promotion } from "@/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";

export function PromoGrid({ promotions }: { promotions: Promotion[] }) {
  const [lead, ...rest] = promotions;
  if (!lead) return null;
  const secondary = rest.slice(0, 2);

  return (
    <section className="section bg-[#FBF8F1]">
      <div className="container-x">
        <SectionHeading
          eyebrow="Акции недели"
          title="Выгодно — и по-настоящему свежее"
          description="Скидки на собственную продукцию, фермерскую полку и готовую еду. Обновляем каждый понедельник."
          href="/promotions"
          linkLabel="Все акции"
        />

        <div className="grid gap-3.5 lg:grid-cols-2">
          <Link
            href={`/promotions/${lead.slug}`}
            className="group relative flex min-h-[380px] overflow-hidden rounded-[2rem] bg-brand-900 p-6 text-cream sm:min-h-[440px] sm:p-8"
          >
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/35 to-brand-950/10" />
            <div className="relative z-10 mt-auto max-w-md">
              {lead.badge && <span className="badge mb-4 bg-accent-500 text-white">{lead.badge}</span>}
              <h3 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">{lead.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-cream/80">{lead.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-[13px] font-bold text-brand-900 transition group-hover:bg-white">
                Подробнее <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="grid gap-3.5">
            {secondary.map((promotion) => (
              <Link
                key={promotion.id}
                href={`/promotions/${promotion.slug}`}
                className="group relative flex min-h-[186px] overflow-hidden rounded-[2rem] bg-cream-dark p-6 sm:min-h-[212px]"
              >
                <div className="relative z-10 max-w-[62%]">
                  {promotion.badge && (
                    <span className={`badge mb-3 ${promotion.accent === "orange" ? "bg-accent-500 text-white" : "bg-brand-800 text-cream"}`}>
                      {promotion.badge}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight text-ink sm:text-2xl">{promotion.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-ink-soft/75">{promotion.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-brand-800">
                    Смотреть <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/2">
                  <Image src={promotion.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cream-dark via-cream-dark/20 to-transparent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
