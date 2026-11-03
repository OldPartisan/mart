import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { getCategoryBySlug, getProducts } from "@/lib/queries";
import { absoluteImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { getCategories } = await import("@/lib/queries");
  const rows = await getCategories();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Категория не найдена" };
  return {
    title: category.name,
    description: category.description ?? `Купить ${category.name.toLowerCase()} в супермаркете «Ирбис Март» с самовывозом и доставкой.`,
    alternates: { canonical: `/catalog/${category.slug}` },
    openGraph: {
      title: `${category.name} — Ирбис Март`,
      description: category.description ?? undefined,
      url: `/catalog/${category.slug}`,
      images: category.image ? [absoluteImage(category.image)] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  return <CatalogView category={category} searchParams={await searchParams} basePath={`/catalog/${slug}`} />;
}
