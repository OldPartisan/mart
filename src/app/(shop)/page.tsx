import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { PromoGrid } from "@/components/home/promo-grid";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductSection } from "@/components/home/product-section";
import { OwnProduction } from "@/components/home/own-production";
import { CafeBlock } from "@/components/home/cafe-block";
import { FarmBlock } from "@/components/home/farm-block";
import { ComboSection } from "@/components/home/combo-section";
import { LoyaltyBlock } from "@/components/home/loyalty-block";
import { PickupSteps } from "@/components/home/pickup-steps";
import { ReviewsSection } from "@/components/home/reviews-section";
import { MapBlock } from "@/components/home/map-block";
import { getCategories, getHomeProducts, getPromotions, getReviews } from "@/lib/queries";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Ирбис Март — фермерский супермаркет у Новой Туры" },
  description:
    "Свежие фермерские продукты и собственная продукция ГК IRBIS прямо от производителя. Готовая еда, кафе, самовывоз через 2 часа и бонусы 1 = 1 ₽.",
  alternates: { canonical: "/" },
  openGraph: {
    title: { absolute: "Ирбис Март — фермерский супермаркет у Новой Туры" },
    description: "Молочная, мясная, выпечка и фермерские товары Татарстана. Самовывоз за 2 часа и доставка.",
    url: "/",
    images: ["/images/store.jpg"],
  },
};

export default async function HomePage() {
  const [home, categories, promotions, reviews] = await Promise.all([
    getHomeProducts(),
    getCategories(),
    getPromotions(3),
    getReviews(6),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "GroceryStore",
      name: "Ирбис Март",
      description: site.description,
      url: absoluteUrl("/"),
      telephone: site.phone,
      image: absoluteUrl("/images/store.jpg"),
      priceRange: "₽₽",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Совхозная, 1",
        addressLocality: "с. Новая Тура",
        addressRegion: "Республика Татарстан",
        addressCountry: "RU",
      },
      geo: { "@type": "GeoCoordinates", latitude: site.coords.lat, longitude: site.coords.lng },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "23:00",
        },
      ],
      sameAs: [site.social.vk, site.social.telegram],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Каталог Ирбис Март",
        itemListElement: categories.slice(0, 9).map((category) => ({
          "@type": "OfferCatalog",
          name: category.name,
          url: absoluteUrl(`/catalog/${category.slug}`),
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Ирбис Март",
      url: absoluteUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/catalog")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <TrustStrip />
      <PromoGrid promotions={promotions} />
      <CategoryRail categories={categories} />

      <ProductSection
        eyebrow="Хиты полки"
        title="То, что разбирают первым"
        description="Наш медовик, молоко «Ирбис», бородинский хлеб и фермерский мёд — постоянные участники корзины."
        href="/catalog?sort=popular"
        linkLabel="Смотреть каталог"
        products={home.hits.slice(0, 8)}
      />

      <OwnProduction />
      <CafeBlock />
      <FarmBlock />
      <ComboSection products={home.combos} />

      <ProductSection
        eyebrow="Новинки"
        title="На полке впервые"
        description="Новые позиции от кухни и фермеров — пробуем вместе."
        href="/catalog?sort=new"
        linkLabel="Все новинки"
        products={home.fresh}
        tone="white"
      />

      <LoyaltyBlock />
      <PickupSteps />
      <ReviewsSection reviews={reviews} />
      <MapBlock />
    </>
  );
}
