import Image from "next/image";
import Link from "next/link";

export function AboutStrip() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container-x grid items-start gap-8 lg:grid-cols-[1fr_290px] lg:gap-12">
        <div>
          <h2 className="font-display text-[26px] font-normal leading-tight tracking-[-0.02em] text-ink sm:text-[30px] lg:text-[36px]">
            Еда, которая не отнимает весь день
          </h2>
          <div className="mt-4 space-y-3 text-[14px] leading-[1.5] text-ink">
            <p>
              В IRBIS MART мы считаем, что полноценная еда не должна отнимать у вас весь день. Готовить сутки
              напролёт — не наш метод. Мы просто берём свежие продукты, готовим из них завтраки, обеды и ужины,
              а вы забираете их с собой по пути. Без доставки, без ожидания, без лишних хлопот.
            </p>
            <p>
              У нас есть и салаты, и супы, и горячее, и десерты. Всё, что нужно для полноценного обеда или ужина —
              без полуфабрикатов и консервантов. Можно съесть здесь, в кафе, или взять с собой домой, в машину,
              на работу. Мы не притворяемся рестораном, мы просто готовим честную еду из продуктов, в которых уверены.
            </p>
            <p>
              Меню обновляется каждый день — потому что мы готовим с утра, а не храним днями. Если какое-то блюдо
              не пошло, мы его не повторяем. Если понравилось — возвращаем. Рецепты придумываем сами и пробуем
              на себе, прежде чем предложить вам.
            </p>
          </div>
          <Link href="/about" className="mt-3 inline-block text-[14px] text-muted underline decoration-line underline-offset-4 transition hover:text-brand-900">
            Читать далее
          </Link>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[290px] overflow-hidden rounded-[18px] bg-cream lg:mx-0">
          <Image src="/images/figma/woman-bag.webp" alt="Покупательница Ирбис Март" fill sizes="290px" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
