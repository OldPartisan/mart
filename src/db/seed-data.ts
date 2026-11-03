import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import {
  bonusTransactions,
  categories,
  orderItems,
  orders,
  products,
  promoCodes,
  promotions,
  reviews,
  users,
  type Order,
} from "./schema";
import * as schema from "./schema";

type Db = PgliteDatabase<typeof schema>;

const img = (name: string) =>
  name.startsWith("figma/") ? `/images/${name}.webp` : `/images/${name}.jpg`;
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

/* ─────────────────────────────── Категории ─────────────────────────────── */

const categorySeed = [
  {
    name: "Молочная продукция",
    slug: "molochnaya-produktsiya",
    description: "Молоко, кефир, творог, сыры и масло — своё производство и фермерская полка.",
    image: img("dairy"),
    sortOrder: 1,
  },
  {
    name: "Мясо и птица",
    slug: "myaso-i-ptitsa",
    description: "Охлаждённое мясо, домашние колбасы и рыба. Разделка и упаковка — в магазине.",
    image: img("meat"),
    sortOrder: 2,
  },
  {
    name: "Выпечка",
    slug: "vypechka",
    description: "Хлеб на закваске, круассаны и торты из нашей пекарни. Печём каждый день.",
    image: img("figma/p-bread"),
    sortOrder: 3,
  },
  {
    name: "Фермерские товары",
    slug: "fermerskie-tovary",
    description: "Продукты хозяйств Татарстана: мёд, яйца, овощи, сыры и сезонные ягоды.",
    image: img("honey"),
    sortOrder: 4,
  },
  {
    name: "Овощи и фрукты",
    slug: "ovoshchi-i-frukty",
    description: "Свежий урожай с местных полей и теплиц, фрукты и ягоды по сезону.",
    image: img("figma/p-tomato"),
    sortOrder: 5,
  },
  {
    name: "Бакалея",
    slug: "bakaleya",
    description: "Паста, крупы, масла и специи — основа домашней кухни.",
    image: img("figma/p-pasta"),
    sortOrder: 6,
  },
  {
    name: "Напитки",
    slug: "napitki",
    description: "Соки, морсы, вода, кофе и чай. Есть что взять в дорогу.",
    image: img("juice"),
    sortOrder: 7,
  },
  {
    name: "Готовая еда",
    slug: "gotovaya-eda",
    description: "Обеды и ужины из кухни «Ирбис Март»: салаты, супы, пицца, роллы, бургеры.",
    image: img("figma/p-bowl"),
    sortOrder: 8,
  },
  {
    name: "Комбо-наборы",
    slug: "kombo-nabory",
    description: "Готовые наборы на семью, обед и пикник — дешевле, чем покупать по отдельности.",
    image: img("figma/p-pizza"),
    sortOrder: 9,
  },
];

/* ──────────────────────────────── Товары ───────────────────────────────── */

type SeedProduct = {
  n: string;
  s: string;
  p: number;
  o?: number;
  c: string;
  f?: Array<"own" | "farm" | "new" | "hit">;
  w: string;
  img: string;
  i2?: string;
  d: string;
  comp?: string;
  st?: string;
  pr?: string;
  stock?: number;
  pop?: number;
};

const own = "Собственное производство ГК IRBIS";
const farm = "Фермерское хозяйство «Ак Барс», Зеленодольский район";

const productSeed: SeedProduct[] = [
  // Молочная продукция
  { n: "Молоко «Ирбис» 3,2%", s: "moloko-irbis-3-2", p: 119, c: "molochnaya-produktsiya", f: ["own", "hit"], w: "900 мл", img: "milk-carton", i2: "milk-pour", d: "Цельное молоко с фермы в Новой Туре. Пастеризация щадящая — вкус остаётся сливочным, без привкуса кипячения.", comp: "Молоко цельное пастеризованное, сливки.", st: "Хранить при +2…+6 °C. Срок годности 7 суток после вскрытия — 2 суток.", pr: own, pop: 96 },
  { n: "Кефир «Ирбис» 2,5%", s: "kefir-irbis-2-5", p: 109, c: "molochnaya-produktsiya", f: ["own"], w: "900 мл", img: "milk-pour", d: "Кефир на живой закваске, мягкий и чуть острый. Хорош и утром, и перед сном.", comp: "Молоко нормализованное, закваска кефирная.", st: "При +2…+6 °C, 10 суток.", pr: own, pop: 81 },
  { n: "Творог «Ирбис» 5%", s: "tvorog-irbis-5", p: 149, c: "molochnaya-produktsiya", f: ["own", "hit"], w: "300 г", img: "yogurt", d: "Рассыпчатый творог без растительных жиров. Из него получается идеальная сырники-основа.", comp: "Молоко пастеризованное, закваска.", st: "При +2…+6 °C, 5 суток.", pr: own, pop: 88 },
  { n: "Сметана «Ирбис» 20%", s: "smetana-irbis-20", p: 139, c: "molochnaya-produktsiya", f: ["own"], w: "300 г", img: "yogurt", d: "Густая сметана, которая держит форму в ложке. Без загустителей и крахмала.", comp: "Сливки, молоко, закваска.", st: "При +2…+6 °C, 7 суток.", pr: own, pop: 74 },
  { n: "Сыр «Гауда» молодой", s: "syr-gauda-molodoy", p: 349, c: "molochnaya-produktsiya", f: ["own", "new"], w: "300 г", img: "figma/p-cheese", d: "Молодой гауда собственной сыроварни: сливочный, пластичный, с лёгкой ореховой ноткой.", comp: "Молоко пастеризованное, соль, закваска, сычужный фермент.", st: "При +2…+6 °C, 30 суток.", pr: own, pop: 69 },
  { n: "Масло сливочное 82,5%", s: "maslo-slivochnoe-82-5", p: 269, c: "molochnaya-produktsiya", f: ["own"], w: "180 г", img: "milk-carton", d: "Сливочное масло из свежих сливок. На бутерброд, в выпечку и на сковороду.", comp: "Сливки пастеризованные.", st: "При +2…+6 °C, 35 суток.", pr: own, pop: 71 },

  // Мясо и птица
  { n: "Куриная грудка охлаждённая", s: "kurinaya-grudka-ohla", p: 429, c: "myaso-i-ptitsa", f: ["farm"], w: "1 кг", img: "meat", d: "Филе с местной птицефабрики, охлаждённое — не замороженное. Для быстрого ужина и meal-prep.", comp: "Филе куриной грудки.", st: "При +2…+4 °C, 3 суток.", pr: "Птицефабрика «Зеленодольская»", pop: 93 },
  { n: "Фарш говяжий 80/20", s: "farsh-govyazhiy-80-20", p: 369, c: "myaso-i-ptitsa", f: ["own"], w: "500 г", img: "meat", d: "Говядина, рубленная крупно, с правильной жирностью. Котлеты получаются сочными без добавок.", comp: "Говядина (лопатка, грудинка).", st: "При +2…+4 °C, 48 часов.", pr: own, pop: 85 },
  { n: "Стейк «Рибай»", s: "steyk-ribay", p: 1890, c: "myaso-i-ptitsa", f: ["farm", "hit"], w: "1 кг", img: "meat", d: "Мраморная говядина зернового откорма. Толщина стейка — 3 см, достаточно соли и огня.", comp: "Говядина, отруб «Рибай».", st: "При 0…+2 °C, 5 суток.", pr: "КФХ «Салют», Алексеевский район", pop: 64 },
  { n: "Колбаса «Домашняя»", s: "kolbasa-domashnyaya", p: 389, c: "myaso-i-ptitsa", f: ["own"], w: "400 г", img: "sausage", d: "Колбаса из рубленой говядины и свинины в натуральной оболочке. Коптим на буковой щепе.", comp: "Говядина, свинина, соль, специи, чеснок.", st: "При +2…+6 °C, 10 суток.", pr: own, pop: 77 },
  { n: "Сосиски молочные", s: "sosiski-molochnye", p: 329, c: "myaso-i-ptitsa", f: ["own"], w: "500 г", img: "sausage", d: "Те самые молочные сосиски из детства, но без лишнего. Мясо — от локальных хозяйств.", comp: "Свинина, говядина, молоко, соль, специи.", st: "При +2…+6 °C, 7 суток.", pr: own, pop: 72 },
  { n: "Сёмга слабосолёная", s: "syomga-slabosolonaya", p: 649, c: "myaso-i-ptitsa", f: ["farm", "new"], w: "200 г", img: "salmon", d: "Филе сёмги сухого посола, нарезанное тонкими ломтиками. Без консервантов.", comp: "Филе сёмги, соль, сахар.", st: "При 0…+4 °C, 7 суток.", pr: "Рыбное хозяйство «Волга», Лаишево", pop: 58 },

  // Выпечка
  { n: "Хлеб «Бородинский»", s: "hleb-borodinskiy", p: 89, c: "vypechka", f: ["own", "hit"], w: "500 г", img: "figma/p-bread", i2: "figma/p-bread", d: "Плотный ржаной хлеб на закваске с кориандром. Корка тонкая, мякиш влажный — как в пекарне.", comp: "Мука ржаная, мука пшеничная, закваска, солод, кориандр, соль.", st: "При комнатной температуре, 48 часов в бумажном пакете.", pr: own, pop: 97 },
  { n: "Багет французский", s: "baget-frantsuzskiy", p: 99, c: "vypechka", f: ["own"], w: "250 г", img: "figma/p-bread", i2: "figma/p-bread", d: "Хрустящая корка, крупные поры и мягкий мякиш. Печём дважды в день — утром и к 16:00.", comp: "Мука пшеничная, вода, соль, дрожжи.", st: "Свежий — 24 часа; для хруста разогрейте 3 минуты при 200 °C.", pr: own, pop: 84 },
  { n: "Круассан с миндалём", s: "kruassan-s-mindalyom", p: 129, c: "vypechka", f: ["own", "new"], w: "120 г", img: "figma/p-bread", d: "Слоёный круассан на сливочном масле с миндальным кремом и лепестками миндаля.", comp: "Мука, масло сливочное, молоко, сахар, миндаль, дрожжи.", st: "При комнатной температуре, 24 часа.", pr: own, pop: 90 },
  { n: "Торт «Медовик»", s: "tort-medovik", p: 890, o: 1090, c: "vypechka", f: ["own", "hit"], w: "900 г", img: "cake", d: "Восемь тонких медовых коржей и крем на сметане. Тот самый, который заказывают на семейные праздники.", comp: "Мука, мёд, яйца, сметана, сахар, сливочное масло.", st: "При +2…+6 °C, 72 часа.", pr: own, pop: 95 },
  { n: "Пирог с яблоками", s: "pirog-s-yablokami", p: 490, c: "vypechka", f: ["own"], w: "700 г", img: "figma/p-bread", i2: "figma/p-peach", d: "Дрожжевой пирог с яблоками и корицей, много начинки и тонкое тесто.", comp: "Мука, яблоки, сахар, масло, корица, дрожжи.", st: "При +2…+6 °C, 48 часов.", pr: own, pop: 68 },
  { n: "Синнабон с корицей", s: "sinnabon-s-koritsey", p: 149, c: "vypechka", f: ["own", "new"], w: "150 г", img: "figma/p-bread", d: "Мягкая булочка-улитка с корицей и сливочной глазурью. Лучше всего тёплой.", comp: "Мука, масло, сахар, корица, сливочный сыр.", st: "При комнатной температуре, 24 часа.", pr: own, pop: 79 },

  // Фермерские
  { n: "Мёд цветочный", s: "myod-tsvetochnyy", p: 490, c: "fermerskie-tovary", f: ["farm", "hit"], w: "500 г", img: "honey", d: "Разнотравье с лугов Зеленодольского района. Натуральный, без сахарного сиропа — проверяем каждую партию.", comp: "Мёд натуральный цветочный.", st: "При +5…+20 °C, в тёмном месте. Срок годности 24 месяца.", pr: "Пасека Рашида Гимадиева, с. Осиново", pop: 87 },
  { n: "Яйца куриные С1, 10 шт", s: "yaytsa-kurinye-s1", p: 139, c: "fermerskie-tovary", f: ["farm"], w: "10 шт", img: "eggs", d: "Яйца от кур на свободном выгуле. Яркий желток и крепкая скорлупа.", comp: "Яйца куриные столовые первой категории.", st: "При +2…+8 °C, 25 суток.", pr: "КФХ «Ак Барс»", pop: 91 },
  { n: "Молоко фермерское 4,5%", s: "moloko-fermerskoe-4-5", p: 149, c: "fermerskie-tovary", f: ["farm", "new"], w: "1 л", img: "dairy", i2: "milk-pour", d: "Неоднородное по жирности, живое молоко от одного хозяйства. Перед употреблением взболтать.", comp: "Молоко цельное.", st: "При +2…+6 °C, 5 суток.", pr: farm, pop: 66 },
  { n: "Творог фермерский 9%", s: "tvorog-fermerskiy-9", p: 219, c: "fermerskie-tovary", f: ["farm"], w: "400 г", img: "yogurt", d: "Жирный деревенский творог, чуть кислый. Идеален с мёдом и ягодами.", comp: "Молоко, закваска.", st: "При +2…+6 °C, 5 суток.", pr: farm, pop: 63 },
  { n: "Сыр козий с травами", s: "syr-koziy-s-travami", p: 459, c: "fermerskie-tovary", f: ["farm", "new"], w: "250 г", img: "figma/p-cheese", d: "Мягкий козий сыр с прованскими травами. Сливочный, с лёгкой кислинкой.", comp: "Козье молоко, соль, закваска, травы.", st: "При +2…+6 °C, 14 суток.", pr: "Сыроварня «Туган Як», Высокогорский район", pop: 52 },
  { n: "Клубника садовая", s: "klubnika-sadovaya", p: 349, c: "fermerskie-tovary", f: ["farm"], w: "500 г", img: "strawberry", d: "Сладкая сезонная клубника с полей Татарстана. Собираем утром — привозим днём.", comp: "Клубника свежая.", st: "При +2…+6 °C, 2–3 суток.", pr: "КФХ «Ягодная поляна», Лаишево", pop: 82 },
  { n: "Картофель молодой", s: "kartofel-molodoy", p: 79, c: "fermerskie-tovary", f: ["farm"], w: "1 кг", img: "figma/p-potato", d: "Молодой картофель с тонкой кожицей. Достаточно помыть и запечь с розмарином.", comp: "Картофель свежий.", st: "В тёмном прохладном месте, до 2 недель.", pr: "КФХ «Идель», Зеленодольский район", pop: 70 },
  { n: "Огурцы грунтовые", s: "ogurtsy-gruntovye", p: 129, c: "fermerskie-tovary", f: ["farm"], w: "500 г", img: "figma/p-tomato", d: "Хрустящие грунтовые огурцы без горечи. Для салата и малосольных.", comp: "Огурцы свежие.", st: "При +4…+8 °C, 5 суток.", pr: "Тепличное хозяйство «Майский», Зеленодольск", pop: 67 },

  // Овощи и фрукты
  { n: "Томаты черри на ветке", s: "tomaty-cherri", p: 189, c: "ovoshchi-i-frukty", f: ["farm", "new"], w: "250 г", img: "figma/p-tomato", d: "Сладкие черри на ветке, с плотной кожицей. Хороши просто так, с солью.", comp: "Томаты черри свежие.", st: "При +8…+12 °C, 5 суток.", pr: "Тепличное хозяйство «Майский»", pop: 76 },
  { n: "Яблоки «Гала»", s: "yabloki-gala", p: 139, c: "ovoshchi-i-frukty", f: ["farm"], w: "1 кг", img: "figma/p-peach", d: "Хрустящие сладкие яблоки из садов Татарстана. Универсальные: в школу, в пирог, в салат.", comp: "Яблоки свежие.", st: "При +2…+6 °C, 3–4 недели.", pr: "Садовое хозяйство «Тойма», Мамадышский район", pop: 80 },
  { n: "Голубика", s: "golubika", p: 299, c: "ovoshchi-i-frukty", f: ["farm"], w: "250 г", img: "figma/p-tomato", d: "Крупная голубика с плотной ягодой. Привозим небольшими партиями — только спелую.", comp: "Голубика свежая.", st: "При +2…+6 °C, 4 суток.", pr: "КФХ «Ягодная поляна»", pop: 61 },
  { n: "Морковь мытая", s: "morkov-mytaya", p: 69, c: "ovoshchi-i-frukty", f: ["farm"], w: "1 кг", img: "figma/p-tomato", d: "Сладкая морковь, уже вымытая. Для супа, салата и сока.", comp: "Морковь свежая.", st: "При +2…+6 °C, 3 недели.", pr: "КФХ «Идель»", pop: 65 },
  { n: "Перец болгарский", s: "perets-bolgarskiy", p: 149, c: "ovoshchi-i-frukty", f: ["farm"], w: "500 г", img: "figma/p-tomato", d: "Толстостенный перец, сладкий даже в сыром виде. Красный и жёлтый в ассортименте.", comp: "Перец сладкий свежий.", st: "При +8…+10 °C, 7 суток.", pr: "Тепличное хозяйство «Майский»", pop: 59 },
  { n: "Зелень микс", s: "zelen-miks", p: 89, c: "ovoshchi-i-frukty", f: ["farm", "new"], w: "80 г", img: "figma/p-potato", d: "Петрушка, укроп, зелёный лук и кинза в одном пучке. Мытая и готовая к столу.", comp: "Петрушка, укроп, лук зелёный, кинза.", st: "При +2…+6 °C, 3 суток.", pr: "Тепличное хозяйство «Майский»", pop: 57 },

  // Бакалея
  { n: "Паста спагетти", s: "pasta-spagetti", p: 159, c: "bakaleya", w: "500 г", img: "figma/p-pasta", d: "Спагетти из твёрдых сортов пшеницы, медная матрица. Держат al dente и не слипаются.", comp: "Мука из твёрдой пшеницы, вода.", st: "В сухом прохладном месте, 24 месяца.", pr: "Makfa", pop: 62 },
  { n: "Рис басмати", s: "ris-basmati", p: 229, c: "bakaleya", w: "1 кг", img: "basket", d: "Длиннозёрный басмати, который остаётся рассыпчатым. К плову и к гарниру.", comp: "Рис басмати.", st: "В сухом месте, 18 месяцев.", pr: "Мистраль", pop: 55 },
  { n: "Масло оливковое extra virgin", s: "maslo-olivkovoe", p: 690, c: "bakaleya", f: ["new"], w: "500 мл", img: "basket", d: "Нерафинированное оливковое масло первого отжима. Для салатов и финальных акцентов.", comp: "Масло оливковое нерафинированное.", st: "В тёмном месте, 18 месяцев.", pr: "Monini", pop: 48 },
  { n: "Соль морская", s: "sol-morskaya", p: 79, c: "bakaleya", w: "1 кг", img: "basket", d: "Крупная морская соль с естественными минералами. Для готовки и солений.", comp: "Соль морская пищевая.", st: "В сухом месте, без ограничений.", pr: "Илецксоль", pop: 45 },
  { n: "Сахар-песок", s: "sahar-pesok", p: 89, c: "bakaleya", w: "1 кг", img: "basket", d: "Обычный сахар для выпечки и заготовок. Проверенный поставщик, стабильное качество.", comp: "Сахар-песок.", st: "В сухом месте, 24 месяца.", pr: "Русагро", pop: 43 },
  { n: "Кофе зерновой «Ирбис»", s: "kofe-zernovoy-irbis", p: 549, c: "bakaleya", f: ["new", "hit"], w: "250 г", img: "coffee", d: "Смесь бразильской арабики и индийской робусты. Шоколад, орех, плотное тело — под эспрессо и капучино.", comp: "Кофе натуральный жареный в зёрнах.", st: "В герметичной упаковке, 6 месяцев.", pr: "Обжарка IRBIS MART", pop: 73 },

  // Напитки
  { n: "Сок апельсиновый", s: "sok-apelsinovyy", p: 189, c: "napitki", w: "1 л", img: "juice", d: "Апельсиновый сок прямого отжима без добавленного сахара. Для завтрака и детского стола.", comp: "Сок апельсиновый.", st: "После вскрытия — при +2…+6 °C, 3 суток.", pr: "Сады Придонья", pop: 58 },
  { n: "Вода питьевая негазированная", s: "voda-pityevaya", p: 59, c: "napitki", w: "1,5 л", img: "water", d: "Мягкая артезианская вода. В машину, в офис, в дорогу.", comp: "Вода артезианская первой категории.", st: "В тёмном месте, 12 месяцев.", pr: "Святой источник", pop: 60 },
  { n: "Лимонад «Тархун»", s: "limonad-tarhun", p: 99, c: "napitki", f: ["new"], w: "0,5 л", img: "juice", d: "Наш тархун на настоящем эстрагоне — не приторный, с травяной свежестью.", comp: "Вода, сахар, экстракт эстрагона, лимонная кислота.", st: "При +2…+6 °C, 6 месяцев.", pr: "IRBIS MART", pop: 47 },
  { n: "Капучино 300 мл", s: "kappuchino", p: 189, c: "napitki", f: ["own", "hit"], w: "300 мл", img: "coffee", d: "Свежемолотый кофе и мягкое молоко. Готовим на кофемашине у кассы — за 2 минуты.", comp: "Эспрессо, молоко.", st: "Употребить сразу после приготовления.", pr: "Кофейня IRBIS MART", pop: 89 },
  { n: "Чай чёрный, 25 пакетиков", s: "chay-chernyy", p: 149, c: "napitki", w: "25 шт", img: "water", d: "Крепкий чёрный чай в пирамидках. Быстрый завтрак без церемоний.", comp: "Чай чёрный байховый.", st: "В сухом месте, 24 месяца.", pr: "Ahmad Tea", pop: 41 },
  { n: "Морс клюквенный", s: "mors-klyukvennyy", p: 159, c: "napitki", f: ["own"], w: "1 л", img: "juice", d: "Домашний морс из клюквы, кисло-сладкий и терпкий. Хорош охлаждённым.", comp: "Вода, клюква, сахар.", st: "При +2…+6 °C, 5 суток.", pr: "Кухня IRBIS MART", pop: 54 },

  // Готовая еда
  { n: "Салат «Цезарь» с курицей", s: "salat-tsezar", p: 289, c: "gotovaya-eda", f: ["own", "hit"], w: "250 г", img: "figma/p-salad", i2: "figma/p-potato", d: "Романо, куриная грудка гриль, пармезан и соус на анчоусах. Собираем несколько раз в день.", comp: "Салат романо, курица, пармезан, сухарики, соус «Цезарь».", st: "При +2…+6 °C, 12 часов.", pr: "Кухня IRBIS MART", pop: 94 },
  { n: "Боул с киноа и овощами", s: "boul-s-kinoa", p: 349, c: "gotovaya-eda", f: ["own", "new"], w: "320 г", img: "figma/p-bowl", d: "Киноа, запечённые овощи, авокадо, нут и соус тахини. Сытный обед без тяжести.", comp: "Киноа, нут, авокадо, тыква, шпинат, соус тахини.", st: "При +2…+6 °C, 12 часов.", pr: "Кухня IRBIS MART", pop: 72 },
  { n: "Суп-пюре тыквенный", s: "sup-pyure-tykvennyy", p: 219, c: "gotovaya-eda", f: ["own"], w: "350 мл", img: "figma/p-potato", d: "Бархатистый суп из запечённой тыквы со сливками и тыквенными семечками.", comp: "Тыква, сливки, лук, морковь, семечки.", st: "При +2…+6 °C, 24 часа.", pr: "Кухня IRBIS MART", pop: 66 },
  { n: "Бургер «Ирбис»", s: "burger-irbis", p: 349, c: "gotovaya-eda", f: ["own", "hit"], w: "280 г", img: "burger", d: "Котлета из мраморной говядины, чеддер, карамелизованный лук и соус на бриоши.", comp: "Булочка бриошь, говядина, чеддер, лук, соус, салат.", st: "Употребить в течение 2 часов.", pr: "Кухня IRBIS MART", pop: 92 },
  { n: "Пицца «Маргарита» 30 см", s: "pizza-margarita", p: 549, c: "gotovaya-eda", f: ["own", "hit"], w: "30 см", img: "figma/p-pizza", d: "Тонкое тесто, томатный соус, моцарелла и базилик. Печём в дровяной печи при 400 °C.", comp: "Тесто, томаты, моцарелла, базилик, оливковое масло.", st: "Употребить в течение 2 часов.", pr: "Пиццерия IRBIS MART", pop: 96 },
  { n: "Ролл «Филадельфия»", s: "roll-philadelphia", p: 449, c: "gotovaya-eda", f: ["own"], w: "280 г", img: "figma/p-rolls", d: "Лосось, сливочный сыр и огурец. Рис варим небольшими партиями, роллы крутим под заказ.", comp: "Рис, лосось, сыр «Филадельфия», огурец, нори.", st: "При +2…+6 °C, 6 часов.", pr: "Суши-бар IRBIS MART", pop: 83 },
  { n: "Сэндвич с индейкой", s: "sendvich-s-indeykoy", p: 229, c: "gotovaya-eda", f: ["own"], w: "180 г", img: "figma/p-bread", d: "Индейка, свежие овощи и соус на цельнозерновом хлебе. В дорогу и в офис.", comp: "Хлеб цельнозерновой, индейка, томат, огурец, соус.", st: "При +2…+6 °C, 8 часов.", pr: "Кухня IRBIS MART", pop: 64 },
  { n: "Шаурма куриная", s: "shaurma-kurinaya", p: 279, c: "gotovaya-eda", f: ["own", "new"], w: "300 г", img: "burger", d: "Маринованная курица гриль, овощи и чесночный соус в тонком лаваше. Острая по запросу.", comp: "Лаваш, курица, капуста, огурец, томат, соус.", st: "Употребить в течение 2 часов.", pr: "Кухня IRBIS MART", pop: 78 },

  // Комбо-наборы
  { n: "Комбо «Семейный ужин»", s: "kombo-semeynyy-uzhin", p: 1490, o: 1890, c: "kombo-nabory", f: ["own", "hit"], w: "на 3–4 человек", img: "figma/p-pizza", d: "Пицца 30 см, два салата, картофель по-деревенски и два морса. Ужин без готовки и без очереди.", comp: "Пицца «Маргарита», салат «Цезарь», салат овощной, картофель, морс 2×0,5 л.", st: "Употребить в течение 2 часов.", pr: "Кухня IRBIS MART", pop: 91 },
  { n: "Комбо «Обед на работе»", s: "kombo-obed-na-rabote", p: 490, o: 620, c: "kombo-nabory", f: ["own"], w: "1 человек", img: "figma/p-potato", d: "Суп дня, салат и напиток на выбор. Собираем за 5 минут — успеете в перерыв.", comp: "Суп дня 350 мл, салат 150 г, напиток 0,5 л.", st: "Употребить в течение 2 часов.", pr: "Кухня IRBIS MART", pop: 85 },
  { n: "Комбо «Завтрак за городом»", s: "kombo-zavtrak-za-gorodom", p: 390, o: 470, c: "kombo-nabory", f: ["own", "new"], w: "1 человек", img: "figma/p-bread", d: "Круассан, капучино и свежевыжатый сок. Для тех, кто едет мимо по М-7 утром.", comp: "Круассан с миндалём, капучино 300 мл, сок 0,3 л.", st: "Употребить в течение 2 часов.", pr: "Кофейня IRBIS MART", pop: 79 },
  { n: "Комбо «Пикник»", s: "kombo-piknik", p: 1190, o: 1450, c: "kombo-nabory", f: ["own", "farm"], w: "на 4 человек", img: "figma/p-cheese", d: "Сыр, колбаса, хлеб, овощи, фрукты и морс. Всё, что нужно для выезда на природу.", comp: "Сыр «Гауда», колбаса «Домашняя», багет, томаты, огурцы, яблоки, морс.", st: "При +2…+6 °C, 12 часов.", pr: "IRBIS MART", pop: 62 },
  { n: "Комбо «Детский»", s: "kombo-detskiy", p: 450, c: "kombo-nabory", f: ["own"], w: "1 ребёнок", img: "burger", d: "Мини-бургер, картофель, сок и творожный десерт. Без острого и без газа.", comp: "Мини-бургер, картофель, сок, творожный десерт.", st: "Употребить в течение 2 часов.", pr: "Кухня IRBIS MART", pop: 58 },
  { n: "Суши-сет «Ирбис»", s: "sushi-set-irbis", p: 1290, o: 1590, c: "kombo-nabory", f: ["own", "new"], w: "24 шт", img: "figma/p-rolls", d: "Филадельфия, Калифорния и запечённые роллы. Собираем под заказ к указанному времени.", comp: "Рис, лосось, креветка, сыр, огурец, авокадо, нори.", st: "При +2…+6 °C, 6 часов.", pr: "Суши-бар IRBIS MART", pop: 74 },
];

/* ─────────────────────────────── Акции ────────────────────────────────── */

const promotionSeed = [
  {
    slug: "svoe-znachit-svegee",
    title: "Своё — значит свежее",
    subtitle: "−20% на молочную полку собственного производства",
    description:
      "Молоко, кефир, творог и сметана из нашей молочной — каждое утро с фермы в Новой Туре. Скидка действует на весь ассортимент собственной молочной линейки.\n\nМы не смешиваем партии и не храним продукт дольше положенного: если срок подходит к концу, полка обновляется, а не «дожимает» остатки.",
    terms: "Скидка 20% действует на товары с меткой «Собственное производство» в категории «Молочная продукция». Не суммируется с другими акциями. Срок — до 30 ноября 2026 года.",
    image: img("dairy"),
    badge: "−20%",
    accent: "green",
    sortOrder: 1,
  },
  {
    slug: "fermerskaya-subbota",
    title: "Фермерская суббота",
    subtitle: "−15% на мёд, сыры и ягоды от хозяйств Татарстана",
    description:
      "Каждую субботу собираем на одной полке то, что привезли фермеры: мёд с пасеки Рашида Гимадиева, козий сыр из Высокогорского района, сезонные ягоды.\n\nМы знаем каждого поставщика по имени и публикуем историю хозяйства на карточке товара. Так проще выбрать своё.",
    terms: "Скидка 15% на товары с меткой «Фермерское» по субботам. Не распространяется на комбо-наборы. До 27 декабря 2026 года.",
    image: img("honey"),
    badge: "−15%",
    accent: "orange",
    sortOrder: 2,
  },
  {
    slug: "uzhin-za-30-minut",
    title: "Ужин за 30 минут",
    subtitle: "Комбо для семьи из 4 человек — 1 490 ₽ вместо 1 890 ₽",
    description:
      "Пицца, два салата, картофель и морс. Достаточно зайти по пути домой — и ужин готов. Комбо собирают на кухне с 16:00 до 21:00.\n\nМожно заказать заранее на сайте и забрать в выбранное время: мы соберём всё к вашему приезду.",
    terms: "Комбо «Семейный ужин» по специальной цене. Количество наборов ограничено. Действует ежедневно до 21:00.",
    image: img("figma/p-pizza"),
    badge: "−21%",
    accent: "green",
    sortOrder: 3,
  },
  {
    slug: "zavtrak-za-gorodom",
    title: "Завтрак за городом",
    subtitle: "Круассан + капучино — 249 ₽ до 11:00",
    description:
      "Для тех, кто едет по М-7 рано утром: свежий круассан и капучино из нашей кофейни по специальной цене.\n\nКофе готовим на зерне собственной обжарки, круассаны достаём из печи к 7:30.",
    terms: "Предложение действует ежедневно с 07:30 до 11:00. Не суммируется с бонусами и другими скидками.",
    image: img("figma/p-bread"),
    badge: "249 ₽",
    accent: "orange",
    sortOrder: 4,
  },
  {
    slug: "semeynyy-prazdnik",
    title: "Семейный праздник",
    subtitle: "Торт «Медовик» по цене 790 ₽",
    description:
      "Наш самый популярный торт — восемь медовых коржей и крем на сметане. К дню рождения, к приезду гостей и просто к воскресному чаю.\n\nЗакажите торт за день — кондитерская соберёт его к нужному времени и напишет пожелание на крышке.",
    terms: "Скидка на торт «Медовик» 900 г. Предзаказ за 24 часа. Действует до 31 декабря 2026 года.",
    image: img("figma/prod-cake"),
    badge: "−100 ₽",
    accent: "green",
    sortOrder: 5,
  },
  {
    slug: "300-bonusov-za-registratsiyu",
    title: "300 бонусов за регистрацию",
    subtitle: "Приветственные бонусы новым клиентам",
    description:
      "Зарегистрируйтесь на сайте и получите 300 бонусов. 1 бонус = 1 ₽, оплачивайте ими до 50% заказа.\n\nБонусы начисляются сразу после регистрации и действуют год. Потратить можно на любой заказ — от молока до комбо на ужин.",
    terms: "300 приветственных бонусов начисляются один раз на новый аккаунт. Бонусы не обмениваются на деньги. Срок действия — 365 дней.",
    image: img("coffee"),
    badge: "300 ₽",
    accent: "orange",
    sortOrder: 6,
  },
];

/* ─────────────────────────────── Отзывы ───────────────────────────────── */

const reviewSeed = [
  { authorName: "Анна", location: "ЖК «ТураНова»", rating: 5, text: "Наконец-то рядом появился нормальный супермаркет. Беру молоко и творог «Ирбис» — вкус как у бабушки в деревне. И круассаны утром разбирают, прихожу к открытию." },
  { authorName: "Дмитрий", location: "Новая Тура", rating: 5, text: "Заказываю комбо на ужин через сайт, забираю по пути с работы. Собирают быстро, всё горячее. Отдельно спасибо за парковку — с детьми зайти реально удобно." },
  { authorName: "Марина", location: "Осиново", rating: 5, text: "Фермерская полка — то, за чем сюда еду. Мёд, козий сыр, ягоды. Приятно, что на карточке написано, откуда продукт и кто его сделал." },
  { authorName: "Ильдар", location: "Зеленодольск", rating: 4, text: "Хороший выбор готовой еды, особенно суп-пюре и боулы. Хотелось бы побольше мест в кафе в обед, но еду забираю с собой — быстро." },
  { authorName: "Екатерина", location: "Залесный", rating: 5, text: "Заказала торт на день рождения — увезли и не пожалели. Медовик настоящий, не приторный. Бонусами оплатила почти половину заказа." },
  { authorName: "Сергей", location: "Трасса М-7", rating: 5, text: "Заправляюсь на IRBIS и теперь заезжаю за кофе и сэндвичем. Удобно, что можно оформить самовывоз и не стоять в очереди." },
];

/* ─────────────────────────────── Пользователи ─────────────────────────── */

const userSeed = [
  {
    email: "admin@irbis-mart.ru",
    name: "Айрат Сафин",
    phone: "+7 (843) 200-00-01",
    role: "ADMIN" as const,
    password: "Admin123!",
    referralCode: "IRBIS-ADMIN",
    bonusBalance: 0,
  },
  {
    email: "manager@irbis-mart.ru",
    name: "Гузель Хайруллина",
    phone: "+7 (843) 200-00-02",
    role: "MANAGER" as const,
    password: "Manager123!",
    referralCode: "IRBIS-MANAGER",
    bonusBalance: 0,
  },
  {
    email: "client@irbis-mart.ru",
    name: "Алия Габдуллина",
    phone: "+7 (917) 000-00-03",
    role: "CUSTOMER" as const,
    password: "Client123!",
    referralCode: "IRBIS-CLIENT",
    bonusBalance: 480,
    marketingOptIn: true,
  },
];

export async function seedDatabase(db: Db): Promise<void> {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  if ((existing[0]?.count ?? 0) > 0) return;

  const categoryRows = await db
    .insert(categories)
    .values(categorySeed.map((c) => ({ ...c })))
    .returning({ id: categories.id, slug: categories.slug });
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const flag = (f: SeedProduct["f"], name: "own" | "farm" | "new" | "hit") => Boolean(f?.includes(name));
  const now = Date.now();
  const productRows = await db
    .insert(products)
    .values(
      productSeed.map((p, index) => ({
        name: p.n,
        slug: p.s,
        description: p.d,
        composition: p.comp ?? null,
        storageInfo: p.st ?? null,
        producer: p.pr ?? null,
        price: p.p,
        oldPrice: p.o ?? null,
        images: [img(p.img), ...(p.i2 ? [img(p.i2)] : [])].filter((value, index, array) => array.indexOf(value) === index),
        categoryId: categoryIdBySlug.get(p.c)!,
        isOwnProduction: flag(p.f, "own"),
        isFarm: flag(p.f, "farm"),
        isNew: flag(p.f, "new"),
        isHit: flag(p.f, "hit"),
        unit: p.c === "kombo-nabory" ? "набор" : "шт",
        weight: p.w,
        stock: p.stock ?? 25,
        popularity: p.pop ?? 50,
        createdAt: new Date(now - index * 3_600_000),
        updatedAt: new Date(now - index * 3_600_000),
      })),
    )
    .returning({ id: products.id, slug: products.slug, name: products.name, price: products.price, image: products.images });

  await db.insert(promotions).values(promotionSeed.map((p) => ({ ...p, startsAt: daysFromNow(-7), endsAt: daysFromNow(60) })));
  await db.insert(reviews).values(reviewSeed);
  await db.insert(promoCodes).values([
    { code: "IRBIS10", discountType: "PERCENT", discountValue: 10, minOrderAmount: 1000, validUntil: daysFromNow(30), usageLimit: 1000 },
    { code: "FARMER15", discountType: "PERCENT", discountValue: 15, minOrderAmount: 1500, validUntil: daysFromNow(45), usageLimit: 500 },
    { code: "WELCOME300", discountType: "FIXED", discountValue: 300, minOrderAmount: 1200, validUntil: daysFromNow(60), usageLimit: 2000 },
  ]);

  const userRows = await db
    .insert(users)
    .values(
      userSeed.map((u) => ({
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        passwordHash: bcrypt.hashSync(
          (u.role === "ADMIN"
            ? process.env.SEED_ADMIN_PASSWORD
            : u.role === "MANAGER"
              ? process.env.SEED_MANAGER_PASSWORD
              : process.env.SEED_CLIENT_PASSWORD) ?? u.password,
          10,
        ),
        referralCode: u.referralCode,
        bonusBalance: u.bonusBalance ?? 0,
        marketingOptIn: u.marketingOptIn ?? false,
      })),
    )
    .returning({ id: users.id, email: users.email });
  const clientId = userRows.find((u) => u.email === "client@irbis-mart.ru")!.id;

  await db.insert(bonusTransactions).values([
    { userId: clientId, amount: 300, type: "WELCOME", description: "Приветственные бонусы за регистрацию", expiresAt: daysFromNow(365) },
    { userId: clientId, amount: 180, type: "ACCRUAL", description: "Начисление за заказ IM-2026-000103", expiresAt: daysFromNow(300) },
  ]);

  const bySlug = new Map(productRows.map((p) => [p.slug, p]));
  const orderSeeds: Array<{
    number: string;
    userId: string | null;
    customerName: string;
    phone: string;
    email: string;
    status: Order["status"];
    paymentStatus: Order["paymentStatus"];
    deliveryType: Order["deliveryType"];
    paymentMethod: Order["paymentMethod"];
    items: Array<[string, number]>;
    daysAgo: number;
    deliveryFee?: number;
    bonusUsed?: number;
    promoCode?: string;
    pickupSlot?: string;
  }> = [
    {
      number: "IM-2026-000101",
      userId: null,
      customerName: "Сергей Кузнецов",
      phone: "+7 (917) 111-22-33",
      email: "s.kuznetsov@example.com",
      status: "COMPLETED",
      paymentStatus: "PAID",
      deliveryType: "PICKUP",
      paymentMethod: "ONLINE",
      items: [["kofe-zernovoy-irbis", 1], ["kruassan-s-mindalyom", 2]],
      daysAgo: 12,
      pickupSlot: "18:00–20:00",
    },
    {
      number: "IM-2026-000102",
      userId: null,
      customerName: "Марина Фомина",
      phone: "+7 (917) 222-33-44",
      email: "m.fomina@example.com",
      status: "CANCELLED",
      paymentStatus: "CANCELLED",
      deliveryType: "DELIVERY",
      paymentMethod: "ON_RECEIPT",
      items: [["myod-tsvetochnyy", 1]],
      daysAgo: 9,
      deliveryFee: 149,
    },
    {
      number: "IM-2026-000103",
      userId: clientId,
      customerName: "Алия Габдуллина",
      phone: "+7 (917) 000-00-03",
      email: "client@irbis-mart.ru",
      status: "COMPLETED",
      paymentStatus: "PAID",
      deliveryType: "PICKUP",
      paymentMethod: "ONLINE",
      items: [["tort-medovik", 1], ["moloko-irbis-3-2", 2], ["hleb-borodinskiy", 1]],
      daysAgo: 21,
      pickupSlot: "12:00–14:00",
    },
    {
      number: "IM-2026-000104",
      userId: clientId,
      customerName: "Алия Габдуллина",
      phone: "+7 (917) 000-00-03",
      email: "client@irbis-mart.ru",
      status: "DELIVERING",
      paymentStatus: "PAID",
      deliveryType: "DELIVERY",
      paymentMethod: "ONLINE",
      items: [["kombo-semeynyy-uzhin", 1], ["mors-klyukvennyy", 1]],
      daysAgo: 1,
      deliveryFee: 0,
      bonusUsed: 100,
      pickupSlot: "18:00–20:00",
    },
    {
      number: "IM-2026-000105",
      userId: null,
      customerName: "Ильдар Сафиуллин",
      phone: "+7 (917) 333-44-55",
      email: "i.safiullin@example.com",
      status: "NEW",
      paymentStatus: "PENDING",
      deliveryType: "PICKUP",
      paymentMethod: "ON_RECEIPT",
      items: [["kombo-obed-na-rabote", 2], ["kappuchino", 2]],
      daysAgo: 0,
      pickupSlot: "12:00–14:00",
    },
    {
      number: "IM-2026-000106",
      userId: null,
      customerName: "Екатерина Орлова",
      phone: "+7 (917) 444-55-66",
      email: "e.orlova@example.com",
      status: "PROCESSING",
      paymentStatus: "PAID",
      deliveryType: "PICKUP",
      paymentMethod: "ONLINE",
      items: [["syomga-slabosolonaya", 2], ["syr-gauda-molodoy", 1], ["baget-frantsuzskiy", 2]],
      daysAgo: 0,
      pickupSlot: "16:00–18:00",
    },
  ];

  for (const seed of orderSeeds) {
    const items = seed.items.map(([slug, qty]) => {
      const product = bySlug.get(slug)!;
      return {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: (product.image as string[])[0] ?? null,
        unit: "шт",
        price: product.price,
        quantity: qty,
        lineTotal: product.price * qty,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = seed.deliveryFee ?? 0;
    const bonusUsed = seed.bonusUsed ?? 0;
    const total = subtotal + deliveryFee - bonusUsed;
    const createdAt = daysFromNow(-seed.daysAgo);
    const [order] = await db
      .insert(orders)
      .values({
        number: seed.number,
        userId: seed.userId,
        customerName: seed.customerName,
        phone: seed.phone,
        email: seed.email,
        status: seed.status,
        subtotal,
        discount: 0,
        bonusUsed,
        deliveryFee,
        total,
        deliveryType: seed.deliveryType,
        deliveryZone: seed.deliveryType === "DELIVERY" ? "Новая Тура и ТураНова" : null,
        addressText: seed.deliveryType === "DELIVERY" ? "с. Новая Тура, ул. Совхозная, 12, кв. 4" : null,
        pickupDate: seed.deliveryType === "PICKUP" ? createdAt.toISOString().slice(0, 10) : null,
        pickupSlot: seed.pickupSlot ?? null,
        paymentMethod: seed.paymentMethod,
        paymentStatus: seed.paymentStatus,
        promoCode: seed.promoCode ?? null,
        createdAt,
        updatedAt: createdAt,
        paidAt: seed.paymentStatus === "PAID" ? createdAt : null,
      })
      .returning({ id: orders.id });
    await db.insert(orderItems).values(items.map((item) => ({ ...item, orderId: order.id })));
  }
}
