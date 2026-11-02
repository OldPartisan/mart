"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

type SearchHit = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  categoryName?: string;
};

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
  const [demoIndex, setDemoIndex] = useState<SearchHit[] | null>(null);

  useEffect(() => {
    if (!staticDemo) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/products.json`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items: SearchHit[]) => setDemoIndex(items))
      .catch(() => setDemoIndex([]));
  }, [staticDemo]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (staticDemo) {
      const normalized = term.toLowerCase();
      const found = (demoIndex ?? [])
        .filter((item) => item.name.toLowerCase().includes(normalized))
        .slice(0, 6);
      setResults(found);
      setOpen(true);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as { items: SearchHit[] };
        setResults(data.items ?? []);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, staticDemo, demoIndex]);

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(term)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      if (active >= 0 && results[active]) {
        event.preventDefault();
        setOpen(false);
        router.push(`/product/${results[active].slug}`);
      } else {
        submit(event);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search" className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
          }}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Найти молоко, хлеб или комбо…"
          aria-label="Поиск по каталогу"
          aria-expanded={open}
          aria-controls="search-results"
          role="combobox"
          className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-10 text-sm outline-none transition placeholder:text-muted/80 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/15"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-ink/5"
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold text-muted sm:block">
            ↵
          </span>
        )}
      </form>

      {open && (
        <div
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-3xl border border-line bg-white shadow-float"
        >
          {loading && (
            <div className="flex items-center gap-2 px-4 py-5 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Ищем на полках…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-5 text-sm text-muted">
              Ничего не нашли. Попробуйте «молоко», «хлеб» или «комбо».
            </div>
          )}
          {!loading && results.length > 0 && (
            <>
              <ul className="max-h-[380px] overflow-y-auto py-2">
                {results.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      role="option"
                      aria-selected={active === index}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 transition-colors",
                        active === index ? "bg-brand-50" : "hover:bg-brand-50/60",
                      )}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                        <Image src={item.images[0] ?? "/images/store.jpg"} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
                        <p className="text-[11px] text-muted">{item.categoryName}</p>
                      </div>
                      <span className="text-[13px] font-bold text-ink">{formatPrice(item.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => submit()}
                className="flex w-full items-center justify-center gap-1 border-t border-line bg-cream/50 px-4 py-3 text-[12px] font-semibold text-brand-800 hover:bg-cream"
              >
                Все результаты по запросу «{query.trim()}»
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
