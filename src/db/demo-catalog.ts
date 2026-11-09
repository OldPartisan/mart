/**
 * Синтетический каталог для проверки масштаба.
 * Не использует данные или фотографии сторонних магазинов.
 */

export type DemoCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type DemoProduct = {
  name: string;
  slug: string;
  description: string;
  composition: string;
  storageInfo: string;
  producer: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  categorySlug: string;
  isOwnProduction: boolean;
  isFarm: boolean;
  isNew: boolean;
  isHit: boolean;
  unit: string;
  weight: string;
  stock: number;
  bonusPoints: number;
  popularity: number;
};

export const demoCategories: DemoCategory[] = [
  {
    name: "Кафе",
    slug: "kafe",
    description: "Кофе, выпечка и блюда из кафе «Ирбис Март».",
    image: "/images/cafe-interior.jpg",
    sortOrder: 10,
  },
  {
    name: "Собственное производство",
    slug: "sobstvennoe-proizvodstvo",
    description: "Хлеб, сыры, колбасы и готовая кулинария собственной кухни.",
    image: "/images/figma/prod-bread.webp",
    sortOrder: 11,
  },
];

type Family = {
  base: string;
  variants: string[];
  unit: string;
  weights: string[];
  min: number;
  max: number;
  images: string[];
  composition: string;
  storage: string;
  producer: string;
};

type CategoryConfig = {
  slug: string;
  families: Family[];
  description: string;
};

const ownProducer = "Собственное производство ГК IRBIS";
const farmProducer = "Фермерское хозяйство «Ак Барс», Зеленодольский район";
const cafeProducer = "Кафе «Ирбис Март», с. Новая Тура";

const variants = ["классический", "домашний", "фермерский", "премиум", "по-деревенски", "с травами", "на закваске", "малый", "семейный"];

const F = (
  base: string,
  min: number,
  max: number,
  images: string[],
  weights: string[],
  composition: string,
  producer: string,
  unit = "шт",
): Family => ({
  base,
  variants,
  unit,
  weights,
  min,
  max,
  images,
  composition,
  storage: "Хранить при +2…+6 °C. Срок годности указан на упаковке.",
  producer,
});

const categoryConfigs: CategoryConfig[] = [
  {
    slug: "molochnaya-produktsiya",
    description: "Свежая молочная продукция с местной фермы и собственного производства.",
    families: [
      F("Молоко «Ирбис»", 89, 189, ["/images/milk-carton.jpg", "/images/milk-pour.jpg", "/images/dairy.jpg"], ["900 мл", "1 л"], "Молоко цельное пастеризованное.", ownProducer),
      F("Кефир «Ирбис»", 79, 149, ["/images/milk-pour.jpg", "/images/dairy.jpg"], ["900 мл", "1 л"], "Молоко нормализованное, закваска.", ownProducer),
      F("Творог «Ирбис»", 99, 249, ["/images/yogurt.jpg", "/images/dairy.jpg"], ["300 г", "500 г"], "Молоко пастеризованное, закваска.", ownProducer),
      F("Сметана «Ирбис»", 89, 199, ["/images/yogurt.jpg", "/images/dairy.jpg"], ["300 г", "500 г"], "Сливки, молоко, закваска.", ownProducer),
      F("Сыр «Ирбис»", 199, 549, ["/images/cheese.jpg", "/images/figma/p-cheese.webp"], ["200 г", "350 г"], "Молоко, соль, закваска, фермент.", ownProducer),
      F("Йогурт «Ирбис»", 69, 179, ["/images/yogurt.jpg", "/images/milkshake.jpg"], ["150 г", "300 г"], "Молоко, закваска, фруктовый наполнитель.", ownProducer),
      F("Масло сливочное", 149, 399, ["/images/dairy.jpg", "/images/cheese.jpg"], ["180 г", "250 г"], "Сливки пастеризованные.", ownProducer),
      F("Молочный коктейль", 119, 229, ["/images/milkshake.jpg", "/images/milk-pour.jpg"], ["300 мл", "500 мл"], "Молоко, мороженое, сироп.", ownProducer),
    ],
  },
  {
    slug: "myaso-i-ptitsa",
    description: "Охлаждённое мясо, птица, колбасы и рыба. Разделка и упаковка в магазине.",
    families: [
      F("Куриная грудка", 199, 399, ["/images/meat.jpg", "/images/deli.jpg"], ["500 г", "1 кг"], "Филе куриной грудки охлаждённое.", "Мясной цех ГК IRBIS"),
      F("Говядина", 349, 799, ["/images/meat.jpg", "/images/deli.jpg"], ["500 г", "1 кг"], "Говядина охлаждённая, бедро.", "Мясной цех ГК IRBIS"),
      F("Свинина", 249, 599, ["/images/meat.jpg", "/images/sausage.jpg"], ["500 г", "1 кг"], "Свинина охлаждённая, шея.", "Мясной цех ГК IRBIS"),
      F("Фарш домашний", 229, 449, ["/images/meat.jpg", "/images/deli.jpg"], ["400 г", "500 г"], "Говядина, свинина, лук, специи.", "Мясной цех ГК IRBIS"),
      F("Колбаса «Ирбис»", 299, 649, ["/images/sausage.jpg", "/images/deli.jpg"], ["300 г", "500 г"], "Мясо, шпик, соль, специи.", ownProducer),
      F("Сосиски «Ирбис»", 219, 459, ["/images/sausage.jpg", "/images/deli.jpg"], ["300 г", "500 г"], "Мясо, молоко, соль, специи.", ownProducer),
      F("Рыба охлаждённая", 249, 899, ["/images/salmon.jpg", "/images/fish-fillet.jpg"], ["300 г", "500 г"], "Рыба охлаждённая, без кожи.", "Рыбный цех ГК IRBIS"),
      F("Стейк из лосося", 499, 1290, ["/images/salmon.jpg", "/images/figma/cat-fish.webp"], ["250 г", "400 г"], "Лосось охлаждённый, порционный кусок.", "Рыбный цех ГК IRBIS"),
    ],
  },
  {
    slug: "vypechka",
    description: "Хлеб на закваске, круассаны, пироги и торты из нашей пекарни.",
    families: [
      F("Хлеб «Бородинский»", 49, 119, ["/images/figma/p-bread.webp", "/images/bread-loaves.jpg"], ["400 г", "500 г"], "Мука ржаная, мука пшеничная, солод, закваска.", ownProducer),
      F("Батон пшеничный", 39, 89, ["/images/figma/prod-bread.webp", "/images/bakery.jpg"], ["350 г", "450 г"], "Мука пшеничная, вода, соль, дрожжи.", ownProducer),
      F("Круассан с миндалём", 89, 169, ["/images/croissant.jpg", "/images/figma/p-bread.webp"], ["80 г", "120 г"], "Мука, масло, миндаль, сахар.", ownProducer),
      F("Пирог яблочный", 199, 449, ["/images/figma/hero-pie.webp", "/images/cake.jpg"], ["500 г", "900 г"], "Мука, яблоки, масло, сахар, корица.", ownProducer),
      F("Торт «Медовик»", 690, 1290, ["/images/cake.jpg", "/images/figma/prod-cake.webp"], ["900 г", "1,2 кг"], "Мука, мёд, сметана, сахар, яйца.", ownProducer),
      F("Печенье овсяное", 69, 149, ["/images/bakery.jpg", "/images/croissant.jpg"], ["200 г", "300 г"], "Овсяные хлопья, мука, масло, сахар.", ownProducer),
      F("Синнабон с корицей", 99, 189, ["/images/croissant.jpg", "/images/bakery.jpg"], ["100 г", "150 г"], "Мука, масло, корица, сахар.", ownProducer),
      F("Пирожок с яблоком", 39, 79, ["/images/figma/p-bread.webp", "/images/dough.jpg"], ["80 г", "120 г"], "Мука, яблоки, сахар, дрожжи.", ownProducer),
    ],
  },
  {
    slug: "fermerskie-tovary",
    description: "Мёд, яйца, овощи, сыры и сезонные ягоды от хозяйств Татарстана.",
    families: [
      F("Мёд цветочный", 249, 899, ["/images/honey.jpg", "/images/figma/p-peach.webp"], ["250 г", "500 г"], "Мёд натуральный цветочный.", farmProducer),
      F("Яйца куриные С1", 89, 169, ["/images/eggs.jpg", "/images/figma/p-tomato.webp"], ["10 шт", "30 шт"], "Яйца куриные столовые.", farmProducer),
      F("Сыр фермерский", 299, 749, ["/images/cheese.jpg", "/images/figma/p-cheese.webp"], ["200 г", "350 г"], "Молоко, соль, закваска.", farmProducer),
      F("Клубника садовая", 199, 449, ["/images/strawberry.jpg", "/images/berries.jpg"], ["250 г", "500 г"], "Клубника свежая.", farmProducer),
      F("Томаты грунтовые", 129, 299, ["/images/tomatoes.jpg", "/images/figma/p-tomato.webp"], ["500 г", "1 кг"], "Томаты свежие.", farmProducer),
      F("Огурцы тепличные", 99, 199, ["/images/vegetables.jpg", "/images/produce.jpg"], ["500 г", "1 кг"], "Огурцы свежие.", farmProducer),
      F("Молоко фермерское", 119, 229, ["/images/milk-pour.jpg", "/images/dairy.jpg"], ["1 л", "1,5 л"], "Молоко цельное.", farmProducer),
      F("Сметана фермерская", 149, 299, ["/images/yogurt.jpg", "/images/dairy.jpg"], ["300 г", "500 г"], "Сливки, закваска.", farmProducer),
    ],
  },
  {
    slug: "ovoshchi-i-frukty",
    description: "Свежий урожай с местных полей, фрукты и ягоды по сезону.",
    families: [
      F("Яблоки сезонные", 69, 179, ["/images/apples.jpg", "/images/produce.jpg"], ["500 г", "1 кг"], "Яблоки свежие.", farmProducer, "кг"),
      F("Бананы", 79, 159, ["/images/figma/p-banana.webp", "/images/produce.jpg"], ["500 г", "1 кг"], "Бананы свежие.", "Импорт", "кг"),
      F("Томаты", 129, 329, ["/images/tomatoes.jpg", "/images/figma/p-tomato.webp"], ["500 г", "1 кг"], "Томаты свежие.", farmProducer, "кг"),
      F("Огурцы", 99, 219, ["/images/vegetables.jpg", "/images/produce.jpg"], ["500 г", "1 кг"], "Огурцы свежие.", farmProducer, "кг"),
      F("Картофель", 39, 99, ["/images/potato.jpg", "/images/figma/p-potato.webp"], ["1 кг", "2 кг"], "Картофель продовольственный.", farmProducer, "кг"),
      F("Морковь", 39, 99, ["/images/vegetables.jpg", "/images/produce.jpg"], ["500 г", "1 кг"], "Морковь столовая.", farmProducer, "кг"),
      F("Арбуз", 39, 89, ["/images/figma/cat-watermelon.webp", "/images/berries.jpg"], ["1 кг", "3 кг"], "Арбуз свежий.", farmProducer, "кг"),
      F("Клубника", 199, 449, ["/images/strawberry.jpg", "/images/berries.jpg"], ["250 г", "500 г"], "Клубника свежая.", farmProducer),
    ],
  },
  {
    slug: "bakaleya",
    description: "Паста, крупы, масла и специи — основа домашней кухни.",
    families: [
      F("Паста «Ирбис»", 89, 249, ["/images/figma/p-pasta.webp", "/images/pasta.jpg"], ["400 г", "500 г"], "Мука пшеничная, вода.", "ГК IRBIS"),
      F("Рис длиннозёрный", 99, 249, ["/images/figma/p-pasta.webp", "/images/bowl.jpg"], ["500 г", "1 кг"], "Рис длиннозёрный.", "ГК IRBIS"),
      F("Гречка", 79, 199, ["/images/figma/p-pasta.webp", "/images/bowl.jpg"], ["500 г", "1 кг"], "Крупа гречневая.", "ГК IRBIS"),
      F("Масло оливковое", 249, 699, ["/images/figma/p-pasta.webp", "/images/coffee.jpg"], ["250 мл", "500 мл"], "Масло оливковое.", "ГК IRBIS"),
      F("Сахар", 59, 149, ["/images/figma/p-pasta.webp", "/images/bowl.jpg"], ["1 кг", "2 кг"], "Сахар белый.", "ГК IRBIS"),
      F("Мука пшеничная", 49, 129, ["/images/dough.jpg", "/images/bakery.jpg"], ["1 кг", "2 кг"], "Мука пшеничная.", "ГК IRBIS"),
      F("Специи для кухни", 39, 199, ["/images/figma/p-pasta.webp", "/images/bowl.jpg"], ["20 г", "50 г"], "Смесь пряностей.", "ГК IRBIS"),
      F("Крупа кукурузная", 69, 159, ["/images/figma/p-pasta.webp", "/images/bowl.jpg"], ["500 г", "1 кг"], "Крупа кукурузная.", "ГК IRBIS"),
    ],
  },
  {
    slug: "napitki",
    description: "Соки, морсы, вода, кофе и чай. Есть что взять в дорогу.",
    families: [
      F("Вода питьевая", 39, 99, ["/images/water.jpg", "/images/juice.jpg"], ["0,5 л", "1,5 л"], "Вода питьевая негазированная.", "ГК IRBIS"),
      F("Сок яблочный", 89, 199, ["/images/juice.jpg", "/images/water.jpg"], ["0,5 л", "1 л"], "Сок яблочный прямого отжима.", "ГК IRBIS"),
      F("Морс ягодный", 79, 179, ["/images/berries.jpg", "/images/juice.jpg"], ["0,5 л", "1 л"], "Морс из ягод.", "ГК IRBIS"),
      F("Кофе зерновой", 499, 1290, ["/images/coffee.jpg", "/images/figma/cat-coffee.webp"], ["250 г", "1 кг"], "Кофе натуральный жареный в зёрнах.", "ГК IRBIS"),
      F("Чай чёрный", 149, 399, ["/images/figma/cat-coffee.webp", "/images/coffee.jpg"], ["50 г", "100 г"], "Чай чёрный.", "ГК IRBIS"),
      F("Лимонад", 69, 159, ["/images/juice.jpg", "/images/water.jpg"], ["0,5 л", "1 л"], "Лимонад.", "ГК IRBIS"),
      F("Молоко с собой", 99, 189, ["/images/milk-pour.jpg", "/images/milk-carton.jpg"], ["0,5 л", "1 л"], "Молоко пастеризованное.", ownProducer),
      F("Смузи", 149, 299, ["/images/milkshake.jpg", "/images/juice.jpg"], ["300 мл", "500 мл"], "Смузи фруктовый.", cafeProducer),
    ],
  },
  {
    slug: "gotovaya-eda",
    description: "Обеды и ужины из кухни «Ирбис Март»: салаты, супы, пицца, роллы, бургеры.",
    families: [
      F("Салат «Цезарь»", 219, 399, ["/images/figma/p-salad.webp", "/images/salad-plate.jpg"], ["250 г", "350 г"], "Курица, салат, соус, сыр.", ownProducer),
      F("Салат овощной", 149, 299, ["/images/salad.jpg", "/images/figma/p-salad.webp"], ["200 г", "300 г"], "Овощи, зелень, масло.", ownProducer),
      F("Суп дня", 159, 299, ["/images/bowl.jpg", "/images/figma/p-bowl.webp"], ["350 г", "500 г"], "Овощи, бульон, зелень.", ownProducer),
      F("Пицца «Маргарита»", 399, 749, ["/images/figma/p-pizza.webp", "/images/pizza.jpg"], ["30 см", "40 см"], "Тесто, томаты, моцарелла, базилик.", ownProducer),
      F("Роллы «Ирбис»", 299, 649, ["/images/figma/p-rolls.webp", "/images/sushi.jpg"], ["8 шт", "16 шт"], "Рис, нори, лосось, огурец.", ownProducer),
      F("Бургер «Ирбис»", 249, 499, ["/images/burger.jpg", "/images/figma/cat-breakfast.webp"], ["250 г", "350 г"], "Булочка, котлета, сыр, соус.", ownProducer),
      F("Картофель по-деревенски", 129, 249, ["/images/figma/p-potato.webp", "/images/potato.jpg"], ["200 г", "300 г"], "Картофель, масло, специи.", ownProducer),
      F("Готовая паста", 229, 449, ["/images/figma/p-pasta.webp", "/images/pasta.jpg"], ["300 г", "400 г"], "Паста, соус, сыр.", ownProducer),
    ],
  },
  {
    slug: "kombo-nabory",
    description: "Готовые наборы на семью, обед и пикник — дешевле, чем покупать по отдельности.",
    families: [
      F("Комбо «Семейный ужин»", 1290, 1990, ["/images/figma/p-pizza.webp", "/images/figma/p-rolls.webp"], ["4 персоны", "6 персон"], "Пицца, салат, картофель, напитки.", ownProducer, "набор"),
      F("Комбо «Обед на работе»", 399, 699, ["/images/figma/p-bowl.webp", "/images/bowl.jpg"], ["1 человек", "2 человека"], "Суп, салат, напиток.", ownProducer, "набор"),
      F("Комбо «Завтрак за городом»", 349, 649, ["/images/figma/p-bread.webp", "/images/croissant.jpg"], ["2 человека", "4 человека"], "Круассан, кофе, сок.", ownProducer, "набор"),
      F("Комбо «Пикник»", 899, 1590, ["/images/figma/pizza-boxes-hero.webp", "/images/figma/p-pizza.webp"], ["3 человека", "5 человек"], "Пицца, закуски, напитки.", ownProducer, "набор"),
      F("Комбо «Детский праздник»", 1490, 2490, ["/images/figma/prod-cake.webp", "/images/cake.jpg"], ["6 человек", "10 человек"], "Пицца, сладости, напитки.", ownProducer, "набор"),
      F("Комбо «Витаминный»", 599, 999, ["/images/figma/p-peach.webp", "/images/apples.jpg"], ["2 человека", "4 человека"], "Фрукты, ягоды, сок.", ownProducer, "набор"),
      F("Комбо «Кофе-брейк»", 499, 899, ["/images/coffee.jpg", "/images/croissant.jpg"], ["4 человека", "8 человек"], "Кофе, круассаны, печенье.", cafeProducer, "набор"),
      F("Комбо «Фермерский»", 990, 1690, ["/images/honey.jpg", "/images/cheese.jpg"], ["2 человека", "4 человека"], "Сыр, мёд, яйца, хлеб.", farmProducer, "набор"),
    ],
  },
  {
    slug: "kafe",
    description: "Кофе, выпечка, сэндвичи и десерты из кафе «Ирбис Март».",
    families: [
      F("Капучино", 149, 249, ["/images/coffee.jpg", "/images/figma/cat-coffee.webp"], ["250 мл", "350 мл"], "Кофе, молоко.", cafeProducer),
      F("Латте", 169, 279, ["/images/coffee.jpg", "/images/milk-pour.jpg"], ["300 мл", "400 мл"], "Кофе, молоко.", cafeProducer),
      F("Круассан с миндалём", 89, 169, ["/images/croissant.jpg", "/images/bakery.jpg"], ["80 г", "120 г"], "Мука, масло, миндаль.", cafeProducer),
      F("Сэндвич с курицей", 149, 289, ["/images/figma/p-bread.webp", "/images/figma/p-salad.webp"], ["180 г", "250 г"], "Хлеб, курица, овощи, соус.", cafeProducer),
      F("Чизкейк", 199, 349, ["/images/cake.jpg", "/images/figma/prod-cake.webp"], ["120 г", "180 г"], "Сыр, сливки, печенье.", cafeProducer),
      F("Лимонад домашний", 119, 219, ["/images/juice.jpg", "/images/water.jpg"], ["300 мл", "500 мл"], "Вода, лимон, сироп.", cafeProducer),
      F("Сырники", 179, 299, ["/images/yogurt.jpg", "/images/figma/p-bowl.webp"], ["200 г", "300 г"], "Творог, яйца, мука.", cafeProducer),
      F("Овсяная каша", 129, 229, ["/images/bowl.jpg", "/images/figma/cat-breakfast.webp"], ["250 г", "350 г"], "Овсяные хлопья, молоко, ягоды.", cafeProducer),
    ],
  },
  {
    slug: "sobstvennoe-proizvodstvo",
    description: "Хлеб, сыры, колбасы, паштеты и кулинария собственной кухни.",
    families: [
      F("Хлеб на закваске", 69, 159, ["/images/figma/prod-bread.webp", "/images/bread-loaves.jpg"], ["400 г", "600 г"], "Мука, вода, закваска, соль.", ownProducer),
      F("Сыр собственный", 249, 599, ["/images/cheese.jpg", "/images/figma/p-cheese.webp"], ["200 г", "350 г"], "Молоко, соль, закваска.", ownProducer),
      F("Колбаса домашняя", 299, 649, ["/images/sausage.jpg", "/images/deli.jpg"], ["300 г", "500 г"], "Мясо, шпик, специи.", ownProducer),
      F("Паштет куриный", 149, 299, ["/images/figma/prod-bowl.webp", "/images/deli.jpg"], ["150 г", "250 г"], "Курица, печень, масло.", ownProducer),
      F("Салат «Ирбис»", 179, 349, ["/images/figma/prod-bowl.webp", "/images/salad-plate.jpg"], ["200 г", "300 г"], "Овощи, курица, соус.", ownProducer),
      F("Торт собственный", 690, 1290, ["/images/figma/prod-cake.webp", "/images/cake.jpg"], ["900 г", "1,2 кг"], "Мука, сливки, сахар.", ownProducer),
      F("Пирог с ягодами", 299, 599, ["/images/figma/hero-pie.webp", "/images/berries.jpg"], ["500 г", "900 г"], "Мука, ягоды, сахар.", ownProducer),
      F("Кулинария на ужин", 249, 499, ["/images/figma/prod-bowl.webp", "/images/figma/p-bowl.webp"], ["300 г", "500 г"], "Овощи, мясо, соус.", ownProducer),
    ],
  },
];


export function buildDemoCatalog(perCategory = 65): DemoProduct[] {
  const result: DemoProduct[] = [];

  categoryConfigs.forEach((config, categoryIndex) => {
    for (let i = 0; i < perCategory; i += 1) {
      const family = config.families[i % config.families.length];
      const variant = family.variants[Math.floor(i / config.families.length) % family.variants.length];
      const name = `${family.base} ${variant}`;
      const price = Math.floor((family.min + ((i * 37 + categoryIndex * 19) % 11) * ((family.max - family.min) / 10)) / 10) * 10 + 9;
      const oldPrice = i % 6 === 0 ? Math.ceil((price * 1.18) / 10) * 10 + 9 : null;
      const weight = family.weights[i % family.weights.length];
      const imageA = family.images[i % family.images.length];
      const imageB = family.images[(i + 1) % family.images.length];

      result.push({
        name,
        slug: `demo-${config.slug}-${String(i + 1).padStart(3, "0")}`,
        description: `${name} — ${config.description} Свежая партия, проверено магазином «Ирбис Март».`,
        composition: family.composition,
        storageInfo: family.storage,
        producer: family.producer,
        price,
        oldPrice,
        images: imageA === imageB ? [imageA] : [imageA, imageB],
        categorySlug: config.slug,
        isOwnProduction: config.slug === "kafe" || config.slug === "sobstvennoe-proizvodstvo" || (["molochnaya-produktsiya", "vypechka", "gotovaya-eda"].includes(config.slug) && i % 4 === 0),
        isFarm: ["fermerskie-tovary", "ovoshchi-i-frukty"].includes(config.slug) && i % 3 === 0,
        isNew: i % 13 === 0,
        isHit: i % 17 === 0,
        unit: family.unit,
        weight,
        stock: i % 23 === 0 ? 0 : 5 + ((i * 13 + categoryIndex * 7) % 70),
        bonusPoints: Math.floor(price / 100),
        popularity: 30 + ((i * 7 + categoryIndex * 11) % 70),
      });
    }
  });

  return result;
}
