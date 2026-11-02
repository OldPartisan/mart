import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import type { ProductCard as Product } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ProductSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  products,
  className,
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  products: Product[];
  className?: string;
  tone?: "default" | "cream" | "white";
}) {
  if (products.length === 0) return null;
  return (
    <section
      className={cn(
        "section",
        tone === "cream" && "bg-cream",
        tone === "white" && "bg-white",
        className,
      )}
    >
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} href={href} linkLabel={linkLabel} />
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
