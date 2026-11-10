import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { contentBlocks, pages } from "../src/db/schema";

async function main() {
const db = await getDb();

type SeedPage = {
  slug: string;
  title: string;
  type: string;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks: Array<{ type: string; data: Record<string, unknown> }>;
};

const seededPages: SeedPage[] = [
  {
    slug: "home",
    title: "Главная",
    type: "HOME",
    status: "PUBLISHED",
    seoTitle: "Ирбис Март — фермерский супермаркет у Новой Туры",
    seoDescription: "Свежие продукты, выпечка, кафе и самовывоз за 2 часа.",
    blocks: [],
  },
  { slug: "promotions", title: "Акции", type: "PROMOTIONS", status: "DRAFT", blocks: [] },
  { slug: "catalog", title: "Каталог", type: "CATALOG", status: "DRAFT", blocks: [] },
  { slug: "categories", title: "Категории", type: "CATEGORY", status: "DRAFT", blocks: [] },
  {
    slug: "seo-fermerskie-produkty",
    title: "Фермерские продукты в Новой Туре",
    type: "LANDING",
    status: "PUBLISHED",
    seoTitle: "Фермерские продукты в Новой Туре — Ирбис Март",
    seoDescription: "Мёд, сыры, яйца и сезонные продукты от хозяйств Татарстана.",
    blocks: [
      {
        type: "hero",
        data: {
          eyebrow: "Фермерская полка",
          title: "От своих — каждый день",
          text: "Мёд, сыры, яйца и сезонные продукты от хозяйств Татарстана.",
          ctaLabel: "В каталог",
          ctaHref: "/catalog/fermerskie-tovary",
          image: "/images/honey.jpg",
          alt: "Фермерские продукты",
        },
      },
      {
        type: "text",
        data: {
          title: "Почему фермерское",
          text: "Мы работаем с небольшими хозяйствами Зеленодольского района: свежесть, понятный состав и поддержка местных производителей.",
        },
      },
      {
        type: "faq",
        data: {
          title: "Частые вопросы",
          items: [
            { q: "Как быстро можно забрать заказ?", a: "Самовывоз доступен через 2 часа после оформления." },
            { q: "Можно ли оплатить бонусами?", a: "Да, до 50% заказа, если вы зарегистрированы." },
          ],
        },
      },
    ],
  },
  {
    slug: "seo-novaya-tura",
    title: "Доставка продуктов в Новую Туру",
    type: "LANDING",
    status: "PUBLISHED",
    seoTitle: "Доставка продуктов в Новую Туру — Ирбис Март",
    seoDescription: "Свежие продукты, выпечка и готовая еда с доставкой от 149 ₽.",
    blocks: [
      {
        type: "hero",
        data: {
          eyebrow: "Доставка",
          title: "Продукты к вашему столу",
          text: "Собираем заказ в магазине и привозим в Новую Туру и соседние посёлки.",
          ctaLabel: "Заказать доставку",
          ctaHref: "/delivery",
          image: "/images/store.jpg",
          alt: "Супермаркет Ирбис Март",
        },
      },
    ],
  },
];

for (const item of seededPages) {
  const [existing] = await db.select().from(pages).where(eq(pages.slug, item.slug)).limit(1);
  if (existing) {
    console.log("skip page:", item.slug);
    continue;
  }
  const [created] = await db
    .insert(pages)
    .values({
      slug: item.slug,
      title: item.title,
      type: item.type,
      status: item.status,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      publishedAt: item.status === "PUBLISHED" ? new Date() : null,
    })
    .returning();
  if (item.blocks.length) {
    await db.insert(contentBlocks).values(
      item.blocks.map((block, index) => ({
        pageId: created.id,
        type: block.type,
        data: block.data,
        sortOrder: index,
      })),
    );
  }
  console.log("created page:", item.slug);
}

console.log("cms seed done");
process.exit(0);
}

main().catch((error) => { console.error(error); process.exit(1); });
