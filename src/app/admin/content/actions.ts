"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { appSettings, contentBlocks, contentRevisions, pages } from "@/db/schema";
import { getCurrentUser, requireStaff } from "@/lib/auth";

type BlockInput = {
  id?: string;
  type: string;
  data: Record<string, unknown>;
  isVisible?: boolean;
};

type PageInput = {
  id: string;
  title: string;
  slug: string;
  type: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  blocks: BlockInput[];
  submitForReview?: boolean;
};

const allowedTypes = new Set(["hero", "banner", "text", "image", "faq"]);
const allowedPageTypes = new Set(["HOME", "PROMOTIONS", "CATALOG", "CATEGORY", "LANDING"]);

export async function savePage(input: PageInput) {
  const user = await requireStaff();
  const db = await getDb();

  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");
  if (!input.title.trim() || !slug) throw new Error("Укажите название и slug");
  if (!allowedPageTypes.has(input.type)) throw new Error("Неизвестный тип страницы");

  const [existing] = await db.select().from(pages).where(eq(pages.id, input.id)).limit(1);
  if (!existing) throw new Error("Страница не найдена");

  const [slugOwner] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  if (slugOwner && slugOwner.id !== input.id) throw new Error("Такой slug уже занят");

  await db
    .update(pages)
    .set({
      title: input.title.trim(),
      slug,
      type: input.type,
      seoTitle: input.seoTitle.trim() || null,
      seoDescription: input.seoDescription.trim() || null,
      ogImage: input.ogImage.trim() || null,
      status: input.submitForReview ? "IN_REVIEW" : "DRAFT",
      updatedAt: new Date(),
    })
    .where(eq(pages.id, input.id));

  await db.delete(contentBlocks).where(eq(contentBlocks.pageId, input.id));
  const blocks = input.blocks.filter((block) => allowedTypes.has(block.type));
  if (blocks.length) {
    await db.insert(contentBlocks).values(
      blocks.map((block, index) => ({
        pageId: input.id,
        type: block.type,
        data: block.data,
        isVisible: block.isVisible !== false,
        sortOrder: index,
      })),
    );
  }

  await db.insert(contentRevisions).values({
    pageId: input.id,
    userId: user.id,
    snapshot: { page: { ...input, slug }, blocks },
    note: input.submitForReview ? "Отправлено на согласование" : "Черновик сохранён",
  });

  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${input.id}`);
  revalidatePath(`/p/${slug}`);
  return { ok: true, slug };
}

export async function publishPage(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Публиковать может только администратор");
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (!page) throw new Error("Страница не найдена");

  await db
    .update(pages)
    .set({ status: "PUBLISHED", publishedAt: new Date(), approvedBy: user.id, updatedAt: new Date() })
    .where(eq(pages.id, id));

  await db.insert(contentRevisions).values({
    pageId: id,
    userId: user.id,
    snapshot: { published: true, slug: page.slug },
    note: "Опубликовано",
  });

  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
  revalidatePath(`/p/${page.slug}`);
  return { ok: true };
}

export async function saveIntegrationSettings(value: Record<string, unknown>) {
  const user = await requireStaff();
  if (user.role !== "ADMIN") throw new Error("Настройки интеграции может менять только администратор");
  const db = await getDb();
  await db
    .insert(appSettings)
    .values({ key: "onec", value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } });
  revalidatePath("/admin/integration");
  return { ok: true };
}

export async function restoreRevision(revisionId: string) {
  const user = await requireStaff();
  const db = await getDb();
  const [revision] = await db.select().from(contentRevisions).where(eq(contentRevisions.id, revisionId)).limit(1);
  if (!revision) throw new Error("Версия не найдена");
  const snapshot = revision.snapshot as {
    page?: { title?: string; slug?: string; type?: string; seoTitle?: string; seoDescription?: string; ogImage?: string };
    blocks?: Array<{ type: string; data: Record<string, unknown>; isVisible?: boolean }>;
  };
  if (!snapshot.page || !Array.isArray(snapshot.blocks)) throw new Error("В этой версии нет данных страницы");

  await db
    .update(pages)
    .set({
      title: snapshot.page.title ?? "Без названия",
      slug: snapshot.page.slug ?? `restored-${Date.now()}`,
      type: allowedPageTypes.has(snapshot.page.type ?? "") ? snapshot.page.type! : "LANDING",
      seoTitle: snapshot.page.seoTitle ?? null,
      seoDescription: snapshot.page.seoDescription ?? null,
      ogImage: snapshot.page.ogImage ?? null,
      status: "DRAFT",
      updatedAt: new Date(),
    })
    .where(eq(pages.id, revision.pageId));

  await db.delete(contentBlocks).where(eq(contentBlocks.pageId, revision.pageId));
  if (snapshot.blocks.length) {
    await db.insert(contentBlocks).values(
      snapshot.blocks.map((block, index) => ({
        pageId: revision.pageId,
        type: allowedTypes.has(block.type) ? block.type : "text",
        data: block.data,
        isVisible: block.isVisible !== false,
        sortOrder: index,
      })),
    );
  }
  await db.insert(contentRevisions).values({
    pageId: revision.pageId,
    userId: user.id,
    snapshot,
    note: "Восстановлена версия",
  });
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${revision.pageId}`);
  return { ok: true };
}

export async function schedulePage(input: { id: string; publishAt: string; unpublishAt?: string }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Планировать публикацию может только администратор");
  const publishAt = new Date(input.publishAt);
  if (Number.isNaN(publishAt.getTime())) throw new Error("Укажите дату публикации");
  const unpublishAt = input.unpublishAt ? new Date(input.unpublishAt) : null;
  if (unpublishAt && unpublishAt <= publishAt) throw new Error("Снятие должно быть позже публикации");
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.id, input.id)).limit(1);
  if (!page) throw new Error("Страница не найдена");
  const status = publishAt <= new Date() ? "PUBLISHED" : "SCHEDULED";
  await db.update(pages).set({ status, publishAt, unpublishAt, publishedAt: status === "PUBLISHED" ? new Date() : page.publishedAt, updatedAt: new Date() }).where(eq(pages.id, input.id));
  await db.insert(contentRevisions).values({ pageId: input.id, userId: user.id, snapshot: { scheduled: true, publishAt: publishAt.toISOString(), unpublishAt: unpublishAt?.toISOString() ?? null }, note: status === "PUBLISHED" ? "Опубликовано по расписанию" : "Запланирована публикация" });
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${input.id}`);
  revalidatePath(`/p/${page.slug}`);
  return { ok: true, status };
}
