/**
 * Идемпотентно добавляет синтетический каталог в текущую БД.
 * Запуск: DATABASE_URL=... pnpm tsx scripts/seed-demo-catalog.ts
 */
import { getDb } from "../src/db";
import { categories, products } from "../src/db/schema";
import { like } from "drizzle-orm";
import { buildDemoCatalog, demoCategories } from "../src/db/demo-catalog";

async function main() {
const db = await getDb();

const existingCategories = await db.select().from(categories);
const bySlug = new Map(existingCategories.map((category) => [category.slug, category]));

for (const category of demoCategories) {
  if (!bySlug.has(category.slug)) {
    const [inserted] = await db.insert(categories).values(category).returning();
    bySlug.set(inserted.slug, inserted);
    console.log("category added:", category.slug);
  }
}

if (process.env.RESET_DEMO === "1") {
  await db.delete(products).where(like(products.slug, "demo-%"));
  console.log("removed previous demo products");
}

const existingProducts = await db.select({ slug: products.slug }).from(products);
const existingSlugs = new Set(existingProducts.map((product) => product.slug));
const demo = buildDemoCatalog().filter((product) => !existingSlugs.has(product.slug));

let inserted = 0;
for (let index = 0; index < demo.length; index += 100) {
  const chunk = demo.slice(index, index + 100).map((product) => ({
    ...product,
    categoryId: bySlug.get(product.categorySlug)!.id,
  }));
  await db.insert(products).values(chunk).onConflictDoNothing();
  inserted += chunk.length;
  console.log(`inserted ${Math.min(index + chunk.length, demo.length)}/${demo.length}`);
}

const total = await db.select({ count: products.id }).from(products);
console.log(`done: +${inserted} demo products, total products: ${total.length}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
