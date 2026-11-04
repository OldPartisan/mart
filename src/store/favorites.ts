"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = { slug: string; name: string };

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => ({
          items: state.items.some((entry) => entry.slug === item.slug)
            ? state.items.filter((entry) => entry.slug !== item.slug)
            : [...state.items, item],
        })),
      remove: (slug) => set((state) => ({ items: state.items.filter((entry) => entry.slug !== slug) })),
      has: (slug) => get().items.some((entry) => entry.slug === slug),
    }),
    { name: "irbis-favorites-v1" },
  ),
);
