import Image from "next/image";

const paragraphs = [
  "Иногда хочется попробовать всё, а не выбирать что-то одно. Поэтому мы придумали пиццу-трио — три маленькие пиццы по 15 см в одной коробке. Каждая со своей начинкой, каждая в своей секции. Ничего не смешивается, всё остаётся таким, как задумано.",
  "Удобно, когда едете с семьёй или с коллегами — каждый берёт свой кусок. Или когда самому хочется и пепперони, и с грибами, и с сыром. Берите с собой в дорогу или домой — коробка компактная, не разваливается, а пицца остаётся горячей.",
];

export function PizzaBanner() {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="container-x">
        <div className="relative grid overflow-hidden rounded-[18px] bg-white lg:h-[400px] lg:grid-cols-2">
          <div className="relative z-10 bg-brand-500 px-6 py-8 sm:px-10 lg:px-[68px] lg:py-[57px]">
            <div className="max-w-[504px] space-y-4 text-[15px] leading-[1.35] text-ink sm:text-[17px] lg:text-[20px] lg:leading-[22px]">
              {paragraphs.map((text) => (
                <p key={text.slice(0, 24)}>{text}</p>
              ))}
            </div>
          </div>

          <div className="relative min-h-[240px] bg-white sm:min-h-[300px] lg:min-h-0">
            <Image
              src="/images/figma/pizza-boxes.png"
              alt="Пицца-трио в коробках Ирбис Март"
              width={2078}
              height={976}
              sizes="(min-width: 1024px) 1040px, 100vw"
              className="absolute inset-0 mx-auto h-full w-full object-contain object-right p-3 sm:p-6 lg:left-[-9.4%] lg:top-[-14.5%] lg:h-[122%] lg:w-[162%] lg:max-w-none lg:p-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
