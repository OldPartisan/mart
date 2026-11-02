/**
 * Экспорт каталога в public/products.json для статической демо-версии
 * (поиск на GitHub Pages работает без сервера).
 */
import { writeFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { categories, products } from "../src/db/schema";

async function main() {
  const db = await getDb();
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
    .where(eq(products.isActive, true))
    .orderBy(products.name);

  writeFileSync("public/products.json", JSON.stringify(rows, null, 0));
  console.log(`[static] products.json: ${rows.length} items`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
