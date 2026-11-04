import type { Metadata } from "next";
import { FavoritesList } from "@/components/shop/favorites-list";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Товары, которые вы сохранили в «Ирбис Март».",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <section className="container-x py-8 md:py-12">
      <h1 className="text-h1 font-bold text-ink">Избранное</h1>
      <p className="mt-2 text-[14px] text-muted">Сохраняйте товары и возвращайтесь к ним позже.</p>
      <FavoritesList />
    </section>
  );
}
