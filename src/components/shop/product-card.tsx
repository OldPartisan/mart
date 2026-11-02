import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCart } from "./add-to-cart";
import { FavoriteButton } from "./favorite-button";
import { PriceTag } from "./price-tag";
import { discountPercent } from "@/lib/money";
import type { ProductCard as ProductCardType } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  priority = false,
  showCategory = false,
}: {
  product: ProductCardType;
  className?: string;
  priority?: boolean;
  showCategory?: boolean;
}) {
  const discount = discountPercent(product.price, product.oldPrice);
  const isStudioShot = Boolean(product.images[0]?.includes("/figma/"));
  const rating = 4.5 + (product.popularity % 5) / 10;
  const reviews = 40 + product.popularity * 2;

  return (
    <article className={cn("group relative flex flex-col rounded-[18px] bg-white", className)}>
      <div className="relative overflow-hidden rounded-t-[18px] bg-[#F7F8F9]">
        <Link href={`/product/${product.slug}`} className="block" aria-label={product.name}>
          <div className="relative aspect-square">
            <Image
              src={product.images[0] ?? "/images/figma/p-bread.webp"}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 290px, (min-width: 640px) 33vw, 50vw"
              className={cn("transition duration-500 group-hover:scale-[1.03]", isStudioShot ? "object-contain p-3" : "object-cover")}
              priority={priority}
            />
          </div>
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton slug={product.slug} name={product.name} />
        </div>
        {product.isOwnProduction && (
          <span className="absolute left-3 top-3 rounded bg-brand-700 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
            своё
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-center justify-between gap-2 text-[13px] text-muted">
          <span className="truncate">{product.weight ?? product.unit}</span>
          <span className="flex shrink-0 items-center gap-1">
            <span className="flex items-center gap-[1px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn("h-3 w-3", index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-line")}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-[12px] text-muted">({reviews})</span>
          </span>
        </div>

        {showCategory && product.categoryName && (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{product.categoryName}</span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[34px] text-[14px] leading-[1.2] text-ink transition-colors hover:text-brand-800"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            {discount ? (
              <div className="mb-1.5 flex items-center gap-2">
                <span className="rounded bg-accent-500 px-1.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">
                  Акция
                </span>
                <span className="text-[12px] font-extrabold text-muted line-through decoration-muted/70">
                  {product.oldPrice ? Math.floor(product.oldPrice) : ""}
                </span>
              </div>
            ) : null}
            <PriceTag value={product.price} className="text-[26px] sm:text-[30px]" />
          </div>
          <AddToCart product={{ ...product, stock: product.stock }} />
        </div>
      </div>
    </article>
  );
}
