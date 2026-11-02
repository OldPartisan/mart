import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Leaf, MapPin, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/queries";
import { discountPercent, formatPrice } from "@/lib/money";
import { absoluteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductGallery } from "@/components/shop/product-gallery";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductDetails } from "@/components/shop/product-details";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/ui/section-heading";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { getDb } = await import("@/db");
  const { products } = await import("@/db/schema");
  const db = await getDb();
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await getProductBySlug(slug);
  if (!row) return { title: "Товар не найден" };
  const { product } = row;
  return {
    title: product.name,
    description: product.description.slice(0, 180),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — Ирбис Март`,
      description: product.description.slice(0, 180),
      url: `/product/${product.slug}`,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getProductBySlug(slug);
  if (!row || !row.product.isActive) notFound();

  const { product, categoryName, categorySlug } = row;
  const [related, productReviews] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getProductReviews(product.id),
  ]);
  const discount = discountPercent(product.price, product.oldPrice);
  const bonus = Math.floor(product.price / 100);
  const inStock = product.stock > 0;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images.map((image) => absoluteUrl(image)),
      sku: product.id,
      brand: { "@type": "Brand", name: product.isOwnProduction ? "Ирбис Март" : "ГК IRBIS" },
      category: categoryName,
      offers: {
        "@type": "Offer",
        url: absoluteUrl(`/product/${product.slug}`),
        priceCurrency: "RUB",
        price: product.price,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Ирбис Март" },
      },
      ...(productReviews.length
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1),
              reviewCount: productReviews.length,
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog") },
        { "@type": "ListItem", position: 3, name: categoryName, item: absoluteUrl(`/catalog/${categorySlug}`) },
        { "@type": "ListItem", position: 4, name: product.name, item: absoluteUrl(`/product/${product.slug}`) },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x pt-5">
        <Breadcrumbs
          items={[
            { label: "Каталог", href: "/catalog" },
            { label: categoryName, href: `/catalog/${categorySlug}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-x grid gap-8 py-6 lg:grid-cols-2 lg:gap-14 lg:py-10">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <div className="flex flex-wrap gap-1.5">
            {discount && <span className="badge bg-accent-500 text-white">−{discount}%</span>}
            {product.isOwnProduction && <span className="badge bg-brand-800 text-cream">Собственное производство</span>}
            {product.isFarm && <span className="badge bg-accent-100 text-accent-700">Фермерское</span>}
            {product.isNew && <span className="badge-outline">Новинка</span>}
            {product.isHit && <span className="badge bg-ink text-cream">Хит</span>}
          </div>

          <h1 className="mt-4 text-h1 font-bold text-ink text-balance">{product.name}</h1>
          <p className="mt-2 text-[13px] text-muted">
            {product.weight ?? product.unit} · {categoryName}
          </p>
          <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="price text-4xl">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="price-old text-base">{formatPrice(product.oldPrice)}</span>
            )}
            {bonus > 0 && (
              <span className="badge-green ml-1">
                <Sparkles className="h-3 w-3" /> +{bonus} бонусов
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-[12px]">
            <span className={`flex h-2 w-2 rounded-full ${inStock ? "bg-brand-600" : "bg-accent-500"}`} />
            <span className={inStock ? "font-semibold text-brand-800" : "font-semibold text-accent-600"}>
              {inStock ? `В наличии · ${product.stock} шт.` : "Нет в наличии"}
            </span>
            <span className="text-muted">· можно забрать сегодня</span>
          </div>

          <div className="mt-6 max-w-sm">
            <AddToCart product={product} variant="full" />
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-2xl border border-line/80 bg-white p-3.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="text-[12px] font-bold text-ink">Самовывоз через 2 часа</p>
                <p className="mt-0.5 text-[11px] text-muted">бесплатно, хранение 24 часа</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-2xl border border-line/80 bg-white p-3.5">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="text-[12px] font-bold text-ink">Доставка от 149 ₽</p>
                <p className="mt-0.5 text-[11px] text-muted">бесплатно от 1 500 ₽</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-muted">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-700" /> Проверено магазином</span>
            <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-brand-700" /> Свежая партия</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-700" /> Можно оплатить бонусами</span>
          </div>

          {product.isFarm && (
            <div className="mt-6 rounded-3xl bg-accent-50 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-700">
                <MapPin className="h-3.5 w-3.5" /> История фермера
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                {product.producer ?? "Фермерское хозяйство Татарстана"}. Мы работаем напрямую, без посредников: продукт
                приезжает в магазин в день сбора или изготовления.
              </p>
              <Link href="/farmers" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-accent-700">
                Все фермеры <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container-x grid gap-6 pb-12 lg:grid-cols-[1.2fr_0.8fr]">
        <ProductDetails
          description={product.description}
          composition={product.composition}
          storage={product.storageInfo}
          producer={product.producer}
        />
        <div className="rounded-3xl bg-brand-900 p-6 text-cream">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-300">Хранение и качество</p>
          <p className="mt-3 font-display text-xl font-bold">Не понравится — вернём деньги</p>
          <p className="mt-2 text-[13px] leading-relaxed text-cream/65">
            Если продукт оказался не свежим, покажите чек на кассе или напишите нам. Заменим или вернём стоимость —
            без споров и анкет.
          </p>
          <dl className="mt-5 space-y-3 border-t border-cream/15 pt-4 text-[12px]">
            <div className="flex justify-between gap-4">
              <dt className="text-cream/55">Производитель</dt>
              <dd className="text-right font-semibold">{product.producer ?? "Ирбис Март"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cream/55">Срок годности</dt>
              <dd className="text-right font-semibold">{product.storageInfo?.split(".")[0] ?? "см. упаковку"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cream/55">Категория</dt>
              <dd className="text-right font-semibold">{categoryName}</dd>
            </div>
          </dl>
          <Link href="/quality" className="mt-5 inline-flex text-[12px] font-semibold text-accent-300 hover:text-accent-200">
            Гарантия качества →
          </Link>
        </div>
      </section>

      {productReviews.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="mb-4 text-h3 font-bold">Отзывы о товаре</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {productReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-line bg-white p-4">
                <p className="text-[12px] font-bold">{review.authorName}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-line/70 bg-white py-12">
          <div className="container-x">
            <SectionHeading eyebrow="С этим берут" title="Похожие товары" href={`/catalog/${categorySlug}`} />
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-5 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
