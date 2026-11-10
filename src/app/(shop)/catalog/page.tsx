import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { absoluteImage } from "@/lib/seo";
import { getPublishedCmsPage } from "@/lib/cms";
import { CmsBlocks } from "@/components/cms/cms-blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedCmsPage("catalog");
  return {
    title: cms?.page.seoTitle ?? "Каталог товаров",
    description: cms?.page.seoDescription ?? "Каталог «Ирбис Март»: молочная продукция, мясо и птица, выпечка, фермерские товары, бакалея, напитки, готовая еда и комбо-наборы.",
    alternates: { canonical: "/catalog" },
    openGraph: { title: cms?.page.seoTitle ?? "Каталог товаров — Ирбис Март", description: cms?.page.seoDescription ?? "Свежие продукты собственного производства и фермерская полка Татарстана.", url: "/catalog", images: [absoluteImage(cms?.page.ogImage ?? "/images/produce.jpg")] },
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cms = await getPublishedCmsPage("catalog");
  return (
    <>
      {cms && cms.blocks.length > 0 && (
        <section className="bg-white pt-4">
          <div className="container-x"><CmsBlocks blocks={cms.blocks.map((block) => ({ id: block.id, type: block.type, data: block.data, isVisible: block.isVisible, sortOrder: block.sortOrder }))} /></div>
        </section>
      )}
      <CatalogView searchParams={await searchParams} basePath="/catalog" />
    </>
  );
}
