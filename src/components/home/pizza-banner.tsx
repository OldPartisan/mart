import Image from "next/image";
import Link from "next/link";

export function PizzaBanner() {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[18px] bg-brand-700">
          <div className="relative z-10 max-w-[560px] px-6 py-8 sm:px-10 sm:py-10 lg:py-12">
            <h2 className="font-display text-[28px] font-extrabold uppercase leading-none tracking-[-0.02em] text-white sm:text-[36px]">
              Пицца-трио
            </h2>
            <p className="mt-4 text-[13.5px] leading-[1.5] text-white/95 sm:text-[14px]">
              Иногда хочется попробовать всё, а не выбирать что-то одно. Поэтому мы придумали пиццу-трио — три
              маленькие пиццы по 15 см в одной коробке. Каждая со своей начинкой, каждая в своей секции.
              Удобно, когда едете с семьёй или с коллегами — каждый берёт свой кусок. Берите с собой в дорогу
              или домой: коробка компактная, а пицца остаётся горячей.
            </p>
            <Link
              href="/catalog/gotovaya-eda"
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-accent-500 px-6 text-[14px] font-semibold text-white transition hover:bg-accent-600"
            >
              Заказать пиццу
            </Link>
          </div>
          <div className="relative mt-2 h-[220px] sm:h-[280px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[62%]">
            <Image
              src="/images/figma/pizza-boxes.png"
              alt="Пицца-трио в коробках"
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-contain object-right p-3 sm:p-6 lg:p-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
