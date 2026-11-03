import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import type { Category } from "@/db/schema";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/queries";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductCard } from "@/components/shop/product-card";
import { CatalogFilters } from "./catalog-filters";
import { SortSelect } from "./sort-select";
import { Pagination } from "./pagination";
import { pluralize } from "@/lib/money";

type SearchParams = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function CatalogView({
  category,
  searchParams,
  basePath,
}: {
  category?: Category | null;
  searchParams: SearchParams;
  basePath: string;
}) {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);
  const q = first(searchParams.q)?.trim();
  const minPrice = first(searchParams.minPrice) ? Number(first(searchParams.minPrice)) : undefined;
  const maxPrice = first(searchParams.maxPrice) ? Number(first(searchParams.maxPrice)) : undefined;
  const sort = (first(searchParams.sort) as "popular" | "price-asc" | "price-desc" | "new" | undefined) ?? "popular";
  const page = Math.max(1, Number(first(searchParams.page) ?? 1));
  const perPage = [12, 24, 48].includes(Number(first(searchParams.perPage))) ? Number(first(searchParams.perPage)) : 12;

  const result = await getProducts({
    category: category?.slug,
    q,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    own: first(searchParams.own) === "1",
    farm: first(searchParams.farm) === "1",
    sale: first(searchParams.sale) === "1",
    sort,
    page,
    perPage,
  });

  const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
  const title = q ? `Поиск: «${q}»` : category?.name ?? "Каталог товаров";
  const countMap = Object.fromEntries(counts);

  const nextHref = (() => {
    if (page >= result.pages) return null;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (!value || key === "page") continue;
      if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
      else query.set(key, value);
    }
    query.set("page", String(page + 1));
    return `${basePath}?${query.toString()}`;
  })();

  return (
    <div className="bg-white">
      <div className="container-x py-4">
        <Breadcrumbs items={[{ label: "Каталог", href: category ? "/catalog" : undefined }, ...(category ? [{ label: category.name }] : [])]} />
      </div>

      <div className="container-x pb-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
          <Suspense fallback={<aside className="hidden w-[290px] shrink-0 lg:block" />}>
            <CatalogFilters categories={categories} counts={countMap} activeCategory={category?.slug} total={result.total} />
          </Suspense>

          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[26px] font-normal leading-tight tracking-[-0.02em] text-ink sm:text-[32px] lg:text-[36px]">
              {title}
            </h1>
            <p className="mt-1 text-[12px] text-muted">
              {result.total} {pluralize(result.total, "товар", "товара", "товаров")}
            </p>
            {staticDemo && (
              <p className="mt-2 rounded-lg bg-[#F7F8F9] px-3 py-2 text-[11px] text-muted">
                Демо-витрина: работают категории и поиск. Сортировка, фильтры по цене и страницы доступны в полной версии.
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {first(searchParams.own) === "1" && <span className="badge-green">Своё производство</span>}
                {first(searchParams.farm) === "1" && <span className="badge bg-brand-100 text-brand-900">Фермерское</span>}
                {first(searchParams.sale) === "1" && <span className="badge bg-accent-100 text-accent-600">Со скидкой</span>}
              </div>
              {!staticDemo && (
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              )}
            </div>

            {result.items.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-[18px] bg-[#F7F8F9] px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-900">
                  <PackageSearch className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-ink">Ничего не нашлось</h2>
                <p className="mt-1.5 max-w-sm text-[13px] text-muted">Попробуйте убрать фильтры или поискать по-другому.</p>
                <Link href="/catalog" className="btn-primary btn-sm mt-4">Сбросить фильтры</Link>
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 md:grid-cols-3 lg:gap-x-6">
                  {result.items.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 3} />
                  ))}
                </div>

                {!staticDemo && nextHref && (
                  <div className="mt-8 flex justify-center">
                    <Link href={nextHref} className="inline-flex h-[51px] items-center rounded-lg bg-[#F3F3F3] px-6 text-[13px] font-medium text-ink transition hover:bg-line">
                      Показать еще
                    </Link>
                  </div>
                )}

                {!staticDemo && <Pagination page={result.page} pages={result.pages} params={searchParams} basePath={basePath} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
