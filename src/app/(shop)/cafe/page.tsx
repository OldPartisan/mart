import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Coffee, Users, UtensilsCrossed } from "lucide-react";
import { getProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { PageHero } from "@/components/content/page-hero";
import { CafePreorderForm } from "@/components/content/cafe-preorder-form";
import { AddToCart } from "@/components/shop/add-to-cart";
import { absoluteImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Кафе IRBIS MART",
  description: "Кафе на 102 места в «Ирбис Март»: завтраки до 11:00, бизнес-ланчи, пицца, роллы, десерты и кофе. Предзаказ столика и блюд.",
  alternates: { canonical: "/cafe" },
  openGraph: { title: "Кафе IRBIS MART", description: "Горячие завтраки, бизнес-ланчи и кофе на трассе М-7.", url: "/cafe", images: [absoluteImage("/images/cafe-interior.jpg")] },
};

const sections: Array<{ title: string; note: string; slugs: string[] }> = [
  { title: "Завтраки", note: "до 11:00", slugs: ["kruassan-s-mindalyom", "sinnabon-s-koritsey", "kappuchino", "kombo-zavtrak-za-gorodom"] },
  { title: "Салаты и боулы", note: "с 11:00", slugs: ["salat-tsezar", "boul-s-kinoa"] },
  { title: "Супы", note: "с 11:00", slugs: ["sup-pyure-tykvennyy"] },
  { title: "Горячее и бургеры", note: "с 12:00", slugs: ["burger-irbis", "shaurma-kurinaya", "sendvich-s-indeykoy"] },
  { title: "Пицца", note: "из дровяной печи", slugs: ["pizza-margarita"] },
  { title: "Роллы и сеты", note: "крутим под заказ", slugs: ["roll-philadelphia", "sushi-set-irbis"] },
  { title: "Десерты и выпечка", note: "из кондитерской", slugs: ["tort-medovik", "pirog-s-yablokami", "kruassan-s-mindalyom"] },
  { title: "Напитки", note: "кофе, соки, морсы", slugs: ["kappuchino", "sok-apelsinovyy", "mors-klyukvennyy", "limonad-tarhun"] },
];

export default async function CafePage() {
  const all = await getProducts({ perPage: 48 });
  const bySlug = new Map(all.items.map((product) => [product.slug, product]));

  return (
    <>
      <PageHero
        eyebrow="Кафе IRBIS MART"
        title="Место, где можно поесть по пути или посидеть с семьёй"
        description="102 посадочных места, горячие завтраки, бизнес-ланчи, пицца из дровяной печи, роллы, десерты и кофе собственной обжарки."
        crumbs={[{ label: "Кафе" }]}
        image="/images/cafe-interior.jpg"
        imageAlt="Интерьер кафе Ирбис Март"
      />

      <section className="section">
        <div className="container-x grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, title: "Завтраки до 11:00", text: "Круассан и капучино — 249 ₽" },
            { icon: UtensilsCrossed, title: "Бизнес-ланч 12:00–15:00", text: "Суп, горячее и напиток — 490 ₽" },
            { icon: Users, title: "102 места", text: "Детский стул, парковка, отдельный вход" },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-line/80 bg-white p-5">
              <item.icon className="h-5 w-5 text-brand-900" />
              <p className="mt-3 text-[13px] font-bold">{item.title}</p>
              <p className="mt-1 text-[11.5px] text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-cream" id="menu">
        <div className="container-x">
          <div className="mb-7">
            <p className="eyebrow">Меню</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Кухня и кофейня</h2>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              Меню меняется по сезону. Любое блюдо можно заказать с собой или добавить в общий заказ на самовывоз.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {sections.map((section) => {
              const products = section.slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
              if (products.length === 0) return null;
              return (
                <div key={section.title} className="rounded-3xl border border-line/80 bg-white p-5">
                  <div className="flex items-baseline justify-between border-b border-line/70 pb-3">
                    <h3 className="font-display text-lg font-bold">{section.title}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{section.note}</span>
                  </div>
                  <ul className="divide-y divide-line/60">
                    {products.map((product) => (
                      <li key={`${section.title}-${product!.id}`} className="flex items-center gap-3 py-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                          <Image src={product!.images[0] ?? "/images/store.jpg"} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${product!.slug}`} className="block truncate text-[12.5px] font-semibold text-ink hover:text-brand-900">
                            {product!.name}
                          </Link>
                          <p className="text-[10.5px] text-muted">{product!.weight}</p>
                        </div>
                        <span className="text-[12.5px] font-bold">{formatPrice(product!.price)}</span>
                        <AddToCart product={product!} variant="icon" className="h-8 w-8 shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-900 px-5 py-4 text-cream">
            <p className="text-[12.5px]"><Coffee className="mr-1.5 inline h-4 w-4 text-accent-300" /> Кофе собственной обжарки · десерты из кондитерской · детское меню</p>
            <Link href="/catalog/gotovaya-eda" className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent-300">
              Заказать с собой <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white" id="preorder">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="eyebrow">Предзаказ</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Забронируйте стол или блюда заранее</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              На день рождения, семейный ужин или обед с коллегами. Оставьте заявку — менеджер подтвердит бронь и поможет
              собрать меню. Для больших компаний — отдельный зал.
            </p>
            <div className="mt-5 space-y-3 text-[12.5px]">
              <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" /> Подтверждаем бронь в течение рабочего дня</p>
              <p className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" /> Компании до 20 человек, детские праздники</p>
              <p className="flex items-start gap-2"><UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" /> Можно предзаказать блюда из меню</p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["cafe-interior", "pizza", "cake"].map((image) => (
                <div key={image} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={`/images/${image}.jpg`} alt="" fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-line/80 bg-white p-5 sm:p-6">
            <CafePreorderForm />
          </div>
        </div>
      </section>
    </>
  );
}
