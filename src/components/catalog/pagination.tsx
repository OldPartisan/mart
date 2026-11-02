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
    (number) => number === 1 || number === pages || Math.abs(number - page) <= 2,
  );

  return (
    <nav aria-label="Пагинация" className="mt-6 flex items-center justify-center gap-3 text-[13px]">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-label="Предыдущая страница"
        className={cn("text-muted hover:text-ink", page === 1 && "pointer-events-none opacity-30")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {numbers.map((number, index) => {
        const previous = numbers[index - 1];
        return (
          <span key={number} className="flex items-center gap-3">
            {previous && number - previous > 1 && <span className="text-muted">…</span>}
            <Link
              href={href(number)}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "min-w-5 text-center transition",
                number === page ? "font-semibold text-ink" : "text-muted hover:text-ink",
              )}
            >
              {number}
            </Link>
          </span>
        );
      })}
      <Link
        href={href(Math.min(pages, page + 1))}
        aria-label="Следующая страница"
        className={cn("text-muted hover:text-ink", page === pages && "pointer-events-none opacity-30")}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
