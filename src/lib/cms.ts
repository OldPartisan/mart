import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contentBlocks, pages } from "@/db/schema";

export async function getPublishedCmsPage(slug: string) {
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  if (!page || page.status !== "PUBLISHED") return null;
  const blocks = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.pageId, page.id))
    .orderBy(contentBlocks.sortOrder);
  return { page, blocks };
}

export function cmsHero(pageBlocks: Array<{ type: string; isVisible: boolean; data: Record<string, unknown> }>) {
  const hero = pageBlocks.find((block) => block.type === "hero" && block.isVisible);
  if (!hero) return null;
  const text = (key: string) => (typeof hero.data[key] === "string" ? (hero.data[key] as string) : "");
  return { eyebrow: text("eyebrow"), title: text("title"), description: text("text"), ctaLabel: text("ctaLabel"), ctaHref: text("ctaHref") };
}
