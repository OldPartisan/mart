import { and, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) return apiOk({ items: [] });

    const db = await getDb();
    const term = `%${q}%`;
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
        categoryName: categories.name,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), or(ilike(products.name, term), ilike(products.description, term))))
      .orderBy(desc(products.popularity))
      .limit(6);

    return apiOk({ items: rows });
  } catch (error) {
    return handleApiError(error);
  }
}
