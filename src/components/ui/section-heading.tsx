import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Смотреть все",
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between", align === "center" && "md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 className="text-h2 font-bold text-ink text-balance">{title}</h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="link-underline shrink-0 self-start md:self-auto">
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
