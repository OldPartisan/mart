import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import type { Category } from "@/db/schema";
import { getCategories, getProducts } from "@/lib/queries";
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
  const categories = await getCategories();
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

  const title = q ? `Поиск: «${q}»` : category?.name ?? "Каталог товаров";
  const description =
    category?.description ??
    "Молочная продукция, мясо, выпечка, фермерские товары и готовые блюда из кухни «Ирбис Март». Заказывайте с самовывозом или доставкой.";

  return (
    <div className="bg-[#FBF8F1]">
      <div className="border-b border-line/70 bg-cream">
        <div className="container-x py-6 md:py-9">
          <Breadcrumbs items={[{ label: "Каталог", href: category ? "/catalog" : undefined }, ...(category ? [{ label: category.name }] : [])]} />
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-h1 font-bold text-ink">{title}</h1>
              <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">{description}</p>
            </div>
            <p className="text-[12px] font-semibold text-muted">
              {result.total} {pluralize(result.total, "товар", "товара", "товаров")} · {result.perPage} на странице
            </p>
          </div>
        </div>
      </div>

      <div className="container-x py-8 md:py-10">
        <div className="flex gap-8">
          <Suspense fallback={<aside className="hidden w-[236px] shrink-0 lg:block" />}>
            <CatalogFilters categories={categories} activeCategory={category?.slug} total={result.total} />
          </Suspense>

          <div className="min-w-0 flex-1">
            <div className="mb-5 hidden items-center justify-between gap-3 border-b border-line/70 pb-3 lg:flex">
              <div className="flex flex-wrap items-center gap-1.5">
                {first(searchParams.own) === "1" && <span className="badge-green">Своё производство</span>}
                {first(searchParams.farm) === "1" && <span className="badge-orange">Фермерское</span>}
                {first(searchParams.sale) === "1" && <span className="badge bg-accent-100 text-accent-700">Со скидкой</span>}
                {q && <span className="badge-outline">«{q}»</span>}
                {(first(searchParams.minPrice) || first(searchParams.maxPrice)) && (
                  <span className="badge-outline">
                    {first(searchParams.minPrice) || "0"} — {first(searchParams.maxPrice) || "∞"} ₽
                  </span>
                )}
              </div>
              <Suspense fallback={null}>
                <SortSelect />
              </Suspense>
            </div>

            {result.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-brand-800">
                  <PackageSearch className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">Ничего не нашлось</h2>
                <p className="mt-2 max-w-sm text-[13px] text-muted">
                  Попробуйте убрать часть фильтров или поискать по-другому: «молоко», «хлеб», «комбо».
                </p>
                <Link href="/catalog" className="btn-primary btn-sm mt-5">
                  Сбросить фильтры
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-5 md:grid-cols-3">
                  {result.items.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 3} />
                  ))}
                </div>
                <Pagination page={result.page} pages={result.pages} params={searchParams} basePath={basePath} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
