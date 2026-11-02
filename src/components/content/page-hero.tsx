import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  imageAlt,
  children,
  cta,
  align = "split",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  cta?: { href: string; label: string };
  align?: "split" | "center";
}) {
  const hasImage = Boolean(image) && align === "split";
  return (
    <section className="border-b border-line/70 bg-cream">
      <div className="container-x py-6 md:py-10">
        <Breadcrumbs items={crumbs ?? []} />
        <div className={cn("mt-5 grid items-center gap-8", hasImage ? "lg:grid-cols-[1.1fr_0.9fr]" : "")}>
          <div className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
            {eyebrow && <p className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</p>}
            <h1 className="mt-2.5 text-h1 font-bold text-ink text-balance">{title}</h1>
            {description && <p className={cn("mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft/80", align === "center" && "mx-auto")}>{description}</p>}
            {children && <div className="mt-6">{children}</div>}
            {cta && (
              <Link href={cta.href} className="btn-primary mt-6">
                {cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          {hasImage && (
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
              <Image src={image!} alt={imageAlt ?? ""} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
