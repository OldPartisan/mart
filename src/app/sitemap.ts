import type { MetadataRoute } from "next";
import { getCategories, getPromotions } from "@/lib/queries";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb();
  const [categories, productRows, promotions] = await Promise.all([
    getCategories(),
    db.select({ slug: products.slug }).from(products),
    getPromotions(),
  ]);

  const staticPages = [
    "",
    "/catalog",
    "/promotions",
    "/delivery",
    "/pickup",
    "/loyalty",
    "/about",
    "/farmers",
    "/own-production",
    "/cafe",
    "/contacts",
    "/quality",
    "/vacancies",
    "/legal/privacy",
    "/legal/terms",
    "/legal/offer",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticPages,
    ...categories.map((category) => ({
      url: absoluteUrl(`/catalog/${category.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productRows.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...promotions.map((promotion) => ({
      url: absoluteUrl(`/promotions/${promotion.slug}`),
      lastModified: promotion.startsAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
