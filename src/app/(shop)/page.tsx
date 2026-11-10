import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CategoryRail } from "@/components/home/category-rail";
import { Tiles } from "@/components/home/tiles";
import { ProductSection } from "@/components/home/product-section";
import { ProductionTrio } from "@/components/home/production-trio";
import { PizzaBanner } from "@/components/home/pizza-banner";
import { AboutStrip } from "@/components/home/about-strip";
import { LoyaltyBlock } from "@/components/home/loyalty-block";
import { ReviewsSection } from "@/components/home/reviews-section";
import { MapBlock } from "@/components/home/map-block";
import { getCategories, getProducts, getReviews } from "@/lib/queries";
import { getDb } from "@/db";
import { contentBlocks, pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CmsBlocks } from "@/components/cms/cms-blocks";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { absoluteImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Ирбис Март — фермерский супермаркет у Новой Туры" },
  description:
    "Свежие фермерские продукты и собственная продукция ГК IRBIS прямо от производителя. Готовая еда, кафе, самовывоз через 2 часа и бонусы 1 = 1 ₽.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ирбис Март — фермерский супермаркет у Новой Туры",
    description: "Молочная, мясная, выпечка и фермерские товары Татарстана. Самовывоз за 2 часа и доставка.",
    url: "/",
    images: [absoluteImage("/images/store.jpg")],
  },
};

export default async function HomePage() {
  const db = await getDb();
  const [homePage] = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1);
  const homeBlocks = homePage && homePage.status === "PUBLISHED"
    ? await db.select().from(contentBlocks).where(eq(contentBlocks.pageId, homePage.id)).orderBy(contentBlocks.sortOrder)
    : [];
  const hasCmsHero = homeBlocks.some((block) => block.type === "hero" && block.isVisible);

  const [categories, sale, ready, farm, reviews] = await Promise.all([
    getCategories(),
    getProducts({ sale: true, perPage: 4, sort: "popular" }),
    getProducts({ category: "gotovaya-eda", perPage: 4 }),
    getProducts({ farm: true, perPage: 4 }),
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
      image: absoluteImage("/images/store.jpg"),
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
      {!hasCmsHero && <Hero />}
      {homeBlocks.length > 0 && (
        <section className="bg-white py-4 sm:py-6">
          <div className="container-x">
            <CmsBlocks blocks={homeBlocks.map((block) => ({ id: block.id, type: block.type, data: block.data, isVisible: block.isVisible, sortOrder: block.sortOrder }))} />
          </div>
        </section>
      )}
      <CategoryRail />
      <Tiles />
      <ProductSection title="Скидки недели" href="/promotions" linkLabel="Все акции" products={sale.items.slice(0, 4)} />
      <ProductionTrio />
      <PizzaBanner />
      <ProductSection title="Готовим каждый день" href="/catalog/gotovaya-eda" linkLabel="Всё меню" products={ready.items.slice(0, 4)} />
      <ProductSection title="Фермерская полка" href="/catalog/fermerskie-tovary" linkLabel="Все фермеры" products={farm.items.slice(0, 4)} />
      <AboutStrip />
      <LoyaltyBlock />
      <ReviewsSection reviews={reviews} />
      <MapBlock />
    </>
  );
}
