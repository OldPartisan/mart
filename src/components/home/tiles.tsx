import Image from "next/image";
import Link from "next/link";

const tiles = [
  {
    image: "tile-market",
    alt: "Супермаркет Ирбис Март",
    href: "/catalog",
    className: "lg:col-span-2 sm:col-span-2",
    aspect: "aspect-[1000/474] sm:aspect-[620/294] lg:aspect-auto lg:h-[294px]",
    sizes: "(min-width: 1024px) 620px, 100vw",
    position: "object-center",
  },
  {
    image: "tile-cafe",
    alt: "Кафе Ирбис Март",
    href: "/cafe",
    className: "",
    aspect: "aspect-square sm:aspect-[310/294] lg:aspect-auto lg:h-[294px]",
    sizes: "(min-width: 1024px) 310px, (min-width: 640px) 50vw, 100vw",
    position: "object-bottom",
  },
  {
    image: "tile-made",
    alt: "Сделано у нас",
    href: "/own-production",
    className: "",
    aspect: "aspect-square sm:aspect-[310/294] lg:aspect-auto lg:h-[294px]",
    sizes: "(min-width: 1024px) 310px, (min-width: 640px) 50vw, 100vw",
    position: "object-bottom",
  },
];

export function Tiles() {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.image}
            href={tile.href}
            className={`group relative overflow-hidden rounded-[18px] ${tile.className}`}
          >
            <span className={`relative block ${tile.aspect}`}>
              <Image
                src={`/images/figma/${tile.image}.webp`}
                alt={tile.alt}
                fill
                sizes={tile.sizes}
                className={`object-cover ${tile.position} transition duration-500 group-hover:scale-[1.03]`}
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
