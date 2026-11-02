import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";
import { discountPercent, formatPrice } from "@/lib/money";
import type { ProductCard as ProductCardType } from "@/lib/queries";
import { cn } from "@/lib/utils";

const badgeLabels = {
  isOwnProduction: { label: "Своё", className: "bg-brand-800 text-cream" },
  isFarm: { label: "Фермерское", className: "bg-accent-500 text-white" },
  isHit: { label: "Хит", className: "bg-ink text-cream" },
  isNew: { label: "Новинка", className: "bg-white text-brand-900" },
} as const;

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
  const badges = (Object.keys(badgeLabels) as Array<keyof typeof badgeLabels>)
    .filter((key) => product[key])
    .slice(0, 2);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-cream-dark">
        <Link href={`/product/${product.slug}`} className="block" aria-label={product.name}>
          <div className="relative aspect-[4/3]">
            <Image
              src={product.images[0] ?? "/images/store.jpg"}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              priority={priority}
            />
          </div>
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discount && <span className="badge bg-accent-500 text-white">−{discount}%</span>}
          {badges.map((key) => (
            <span key={key} className={cn("badge backdrop-blur", badgeLabels[key].className)}>
              {badgeLabels[key].label}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3">
          <AddToCart product={{ ...product, stock: product.stock }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        {showCategory && product.categoryName && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{product.categoryName}</span>
        )}
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink transition-colors hover:text-brand-800">
          {product.name}
        </Link>
        <div className="mt-1 text-[12px] text-muted">
          {product.weight ?? product.unit}
          {product.isFarm && <span className="ml-2 text-accent-600">фермерское</span>}
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-2.5">
          <span className="price text-[19px]">{formatPrice(product.price)}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="price-old">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
