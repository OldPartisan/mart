import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategoryRail({ categories }: { categories: Category[] }) {
  return (
    <section className="border-y border-line/70 bg-white py-12 md:py-14">
      <div className="container-x">
        <SectionHeading
          eyebrow="Каталог"
          title="Что нужно — уже на полке"
          description="Девять разделов: от молочной полки и фермерских сыров до готового ужина и комбо."
          href="/catalog"
          className="mb-7 md:mb-8"
        />
        <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible md:grid-cols-5 lg:grid-cols-9">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group flex w-[104px] shrink-0 snap-start flex-col items-center gap-2.5 text-center sm:w-auto"
            >
              <span className="relative block aspect-square w-full overflow-hidden rounded-full border border-line/70 bg-cream-dark p-1 transition group-hover:border-brand-700/40">
                <span className="relative block h-full w-full overflow-hidden rounded-full">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 120px, 100px"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  )}
                </span>
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink transition-colors group-hover:text-brand-800">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
