import Image from "next/image";
import Link from "next/link";

const items = [
  { image: "cat-watermelon", label: "Сезон арбузов и дынь", href: "/catalog/ovoshchi-i-frukty" },
  { image: "cat-pizza", label: "Тройная пицца", href: "/catalog/kombo-nabory" },
  { image: "cat-breakfast", label: "Готовые завтраки", href: "/catalog/vypechka" },
  { image: "cat-kebab", label: "Сезон шашлыков", href: "/catalog/myaso-i-ptitsa" },
  { image: "cat-fish", label: "Свежий улов", href: "/catalog/myaso-i-ptitsa" },
  { image: "cat-coffee", label: "Кофе в зернах", href: "/catalog/napitki" },
];

export function CategoryRail() {
  return (
    <section className="bg-white pb-2 pt-4 sm:pt-6" aria-label="Подборки">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <Link key={item.image} href={item.href} className="group">
              <span className="relative block aspect-[180/77] overflow-hidden rounded-xl bg-cream">
                <Image
                  src={`/images/figma/${item.image}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 200px, 45vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-2 block text-[13px] leading-tight text-ink transition-colors group-hover:text-brand-800">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
