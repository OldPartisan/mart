import { SectionTitle } from "./section-title";
import { ProductCard } from "@/components/shop/product-card";
import type { ProductCard as Product } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ProductSection({
  title,
  href,
  linkLabel,
  products,
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  products: Product[];
  className?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className={cn("bg-white py-8 sm:py-10", className)}>
      <div className="container-x">
        <SectionTitle title={title} href={href} linkLabel={linkLabel} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-10">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
