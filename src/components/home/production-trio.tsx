import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "./section-title";

const items = [
  {
    image: "prod-bread",
    alt: "Свежий хлеб",
    text: "Мы печём хлеб пять раз в день. Первая партия — с утра, последняя — к вечеру. Поэтому он всегда свежий. Даже если вы заедете поздно вечером.",
  },
  {
    image: "prod-bowl",
    alt: "Готовые блюда",
    text: "Мы не зацикливаемся на одной кухне. Поэтому у нас есть и овсянка на завтрак, и бизнес-ланч в обед, и ужин с пастой или роллами. Выбирайте, что хочется сегодня.",
  },
  {
    image: "prod-cake",
    alt: "Десерты",
    text: "Торты и пирожные мы делаем сами и не храним их днями. С утра — свежие, мягкие, с начинкой, которая чувствуется в каждом кусочке.",
  },
];

export function ProductionTrio() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container-x">
        <SectionTitle title="Собственное производство" href="/own-production" linkLabel="Подробнее" />
        <div className="grid gap-6 md:grid-cols-3 lg:gap-10">
          {items.map((item) => (
            <Link key={item.image} href="/own-production" className="group">
              <div className="relative aspect-[400/365] overflow-hidden rounded-[18px] bg-cream">
                <Image
                  src={`/images/figma/${item.image}.webp`}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-[14px] leading-[1.45] text-ink">{item.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
