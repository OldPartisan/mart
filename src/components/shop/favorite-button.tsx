"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";

export function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const [mounted, setMounted] = useState(false);
  const items = useFavoritesStore((s) => s.items);
  const toggle = useFavoritesStore((s) => s.toggle);
  const active = mounted && items.some((item) => item.slug === slug);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => toggle({ slug, name })}
      aria-label={active ? `Убрать ${name} из избранного` : `Добавить ${name} в избранное`}
      aria-pressed={active}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-muted shadow-sm transition hover:bg-white"
    >
      <Heart className={cn("h-[18px] w-[18px]", active ? "fill-accent-500 text-accent-500" : "text-[#B9BEC3]")} strokeWidth={1.6} />
    </button>
  );
}
