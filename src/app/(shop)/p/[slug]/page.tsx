import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contentBlocks, pages } from "@/db/schema";
import { CmsBlocks } from "@/components/cms/cms-blocks";
import { absoluteImage } from "@/lib/seo";
import { processScheduledPages } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

async function getPage(slug: string) {
  await processScheduledPages();
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  if (!page || page.status !== "PUBLISHED") return null;
  const blocks = await db.select().from(contentBlocks).where(eq(contentBlocks.pageId, page.id)).orderBy(contentBlocks.sortOrder);
  return { page, blocks };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPage(slug);
  if (!data) return {};
  return {
    title: { absolute: data.page.seoTitle ?? data.page.title },
    description: data.page.seoDescription ?? undefined,
    alternates: { canonical: `/p/${data.page.slug}` },
    openGraph: {
      title: { absolute: data.page.seoTitle ?? data.page.title },
      description: data.page.seoDescription ?? undefined,
      images: data.page.ogImage ? [absoluteImage(data.page.ogImage)] : undefined,
    },
  };
}

export default async function CmsLandingPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPage(slug);
  if (!data) notFound();

  return (
    <main className="container-x py-6 sm:py-10">
      <CmsBlocks
        blocks={data.blocks.map((block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
          isVisible: block.isVisible,
          sortOrder: block.sortOrder,
        }))}
      />
    </main>
  );
}
