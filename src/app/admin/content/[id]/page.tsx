import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contentBlocks, pages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ContentEditor } from "@/components/admin/content-editor";

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (!page) notFound();
  const blocks = await db.select().from(contentBlocks).where(eq(contentBlocks.pageId, page.id)).orderBy(contentBlocks.sortOrder);
  const user = await getCurrentUser();

  return (
    <ContentEditor
      page={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        type: page.type,
        status: page.status,
        seoTitle: page.seoTitle ?? "",
        seoDescription: page.seoDescription ?? "",
        ogImage: page.ogImage ?? "",
        publishAt: page.publishAt?.toISOString() ?? "",
        unpublishAt: page.unpublishAt?.toISOString() ?? "",
      }}
      blocks={blocks.map((block) => ({
        id: block.id,
        type: block.type,
        data: block.data,
        isVisible: block.isVisible,
      }))}
      isAdmin={user?.role === "ADMIN"}
    />
  );
}
