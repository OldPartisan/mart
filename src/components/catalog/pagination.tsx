import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pages,
  params,
  basePath,
}: {
  page: number;
  pages: number;
  params: Record<string, string | string[] | undefined>;
  basePath: string;
}) {
  if (pages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (!value || key === "page") continue;
      if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
      else query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const numbers = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pages || Math.abs(number - page) <= 1,
  );

  return (
    <nav aria-label="Пагинация" className="mt-10 flex items-center justify-center gap-1.5">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white", page === 1 && "pointer-events-none opacity-40")}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {numbers.map((number, index) => {
        const previous = numbers[index - 1];
        return (
          <span key={number} className="flex items-center gap-1.5">
            {previous && number - previous > 1 && <span className="px-1 text-muted">…</span>}
            <Link
              href={href(number)}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-[13px] font-semibold transition",
                number === page ? "bg-brand-800 text-cream" : "border border-line bg-white text-ink hover:border-brand-700/40",
              )}
            >
              {number}
            </Link>
          </span>
        );
      })}
      <Link
        href={href(Math.min(pages, page + 1))}
        aria-disabled={page === pages}
        className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white", page === pages && "pointer-events-none opacity-40")}
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
