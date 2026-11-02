import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { formatPrice } from "@/lib/money";
import type { ProductCard } from "@/lib/queries";

export function ComboSection({ products }: { products: ProductCard[] }) {
  if (products.length === 0) return null;
  return (
    <section className="section bg-[#FFF3E7]">
      <div className="container-x">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent-600">Комбо-наборы</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink text-balance">Ужин без готовки и без очереди</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Собрали наборы на семью, обед и пикник. Дешевле, чем покупать по отдельности, — и готово к вашему приезду.
            </p>
          </div>
          <Link href="/catalog/kombo-nabory" className="link-underline shrink-0 self-start md:self-auto">
            Все комбо <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => {
            const saving = product.oldPrice ? product.oldPrice - product.price : 0;
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group overflow-hidden rounded-[2rem] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-float"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={product.images[0] ?? "/images/pizza.jpg"}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  {saving > 0 && <span className="absolute left-4 top-4 badge bg-accent-500 text-white">экономия {formatPrice(saving)}</span>}
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{product.weight}</p>
                  <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-ink">{product.name}</h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="price text-2xl">{formatPrice(product.price)}</span>
                      {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-cream transition group-hover:bg-accent-500">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 border-t border-line/70 pt-3 text-[11px] text-muted">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> соберём за 2 часа</span>
                    <span className="flex items-center gap-1"><Check className="h-3 w-3 text-brand-700" /> свежее</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
