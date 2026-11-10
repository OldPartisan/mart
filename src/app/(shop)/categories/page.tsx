import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { getPublishedCmsPage } from "@/lib/cms";
import { CmsBlocks } from "@/components/cms/cms-blocks";
import { PageHero } from "@/components/content/page-hero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedCmsPage("categories");
  return {
    title: cms?.page.seoTitle ?? "Категории товаров",
    description: cms?.page.seoDescription ?? "Все категории супермаркета «Ирбис Март»: молочная продукция, мясо, выпечка, фермерские товары, кафе и собственное производство.",
    alternates: { canonical: "/categories" },
  };
}

export default async function CategoriesPage() {
  const [categories, cms] = await Promise.all([getCategories(), getPublishedCmsPage("categories")]);

  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Категории"
        description="Выберите раздел — от свежей выпечки и фермерской полки до кафе и собственного производства."
        crumbs={[{ label: "Категории" }]}
      />
      {cms && cms.blocks.length > 0 && (
        <section className="bg-white pt-4">
          <div className="container-x"><CmsBlocks blocks={cms.blocks.map((block) => ({ id: block.id, type: block.type, data: block.data, isVisible: block.isVisible, sortOrder: block.sortOrder }))} /></div>
        </section>
      )}
      <section className="section bg-white">
        <div className="container-x grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/catalog/${category.slug}`} className="group overflow-hidden rounded-[18px] border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-float">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F8F9]">
                {category.image && <Image src={category.image} alt={category.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-[13px] font-semibold text-ink">{category.name}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
