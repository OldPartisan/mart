export const site = {
  name: "Ирбис Март",
  legalName: "ГК IRBIS",
  tagline: "Фермерский супермаркет у Новой Туры",
  description:
    "Свежие фермерские продукты и собственная продукция ГК IRBIS, готовая еда, кафе и быстрый самовывоз на трассе М-7 у Новой Туры.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+7 (843) 200-00-00",
  phoneHref: "tel:+78432000000",
  email: process.env.NEXT_PUBLIC_SHOP_EMAIL ?? "hello@irbis-mart.ru",
  address: "с. Новая Тура, ул. Совхозная, 1",
  addressFull: "Республика Татарстан, Зеленодольский район, с. Новая Тура, ул. Совхозная, 1",
  hours: "Ежедневно 08:00–23:00",
  cafeHours: "Ежедневно 08:00–22:00",
  coords: { lat: 55.862057, lng: 48.834461 },
  social: {
    vk: "https://vk.com/irbis_mart",
    telegram: "https://t.me/irbis_mart",
  },
  pickupStorage: "24 часа",
  deliveryFreeFrom: 1500,
  opening: "Июль 2026",
} as const;

export const mainNav = [
  { href: "/promotions", label: "Акции", accent: true },
  { href: "/catalog?sort=new", label: "Новинки" },
  { href: "/catalog/gotovaya-eda", label: "Готовая еда" },
  { href: "/own-production", label: "Своё производство" },
  { href: "/cafe#preorder", label: "Кейтеринг" },
  { href: "/catalog/fermerskie-tovary", label: "Фермерские продукты" },
  { href: "/about", label: "О нас" },
] as const;

export const footerNav = {
  shop: [
    { href: "/catalog", label: "Каталог" },
    { href: "/promotions", label: "Акции недели" },
    { href: "/catalog/gotovaya-eda", label: "Готовая еда" },
    { href: "/cafe", label: "Кафе и предзаказ" },
    { href: "/catalog/fermerskie-tovary", label: "Фермерская полка" },
    { href: "/catalog/kombo-nabory", label: "Комбо-наборы" },
  ],
  help: [
    { href: "/delivery", label: "Доставка и оплата" },
    { href: "/pickup", label: "Самовывоз" },
    { href: "/loyalty", label: "Программа лояльности" },
    { href: "/contacts", label: "Контакты" },
    { href: "/account/orders", label: "Мои заказы" },
  ],
  about: [
    { href: "/about", label: "О супермаркете" },
    { href: "/own-production", label: "Собственное производство" },
    { href: "/farmers", label: "Наши фермеры" },
    { href: "/vacancies", label: "Вакансии" },
  ],
} as const;
