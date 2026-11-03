import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { absoluteImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог товаров",
  description:
    "Каталог «Ирбис Март»: молочная продукция, мясо и птица, выпечка, фермерские товары, бакалея, напитки, готовая еда и комбо-наборы.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Каталог товаров — Ирбис Март",
    description: "Свежие продукты собственного производства и фермерская полка Татарстана.",
    url: "/catalog",
    images: [absoluteImage("/images/produce.jpg")],
  },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CatalogView searchParams={await searchParams} basePath="/catalog" />;
}
