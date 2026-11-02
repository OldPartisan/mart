import Image from "next/image";
import Link from "next/link";

const tiles = [
  { image: "tile-market", alt: "Супермаркет Ирбис Март", href: "/catalog", className: "lg:col-span-2" },
  { image: "tile-cafe", alt: "Кафе Ирбис Март", href: "/cafe", className: "" },
  { image: "tile-made", alt: "Сделано у нас", href: "/own-production", className: "" },
];

export function Tiles() {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.image}
            href={tile.href}
            className={`group relative overflow-hidden rounded-[18px] ${tile.className} ${tile.image === "tile-market" ? "sm:col-span-2" : ""}`}
          >
            <span className="relative block aspect-[2/1] sm:aspect-[310/294] lg:aspect-auto lg:h-[294px]">
              <Image
                src={`/images/figma/${tile.image}.webp`}
                alt={tile.alt}
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
