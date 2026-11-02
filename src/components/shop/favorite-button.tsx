"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const [active, setActive] = useState(false);

  const toggle = () => setActive((value) => !value);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? `Убрать ${name} из избранного` : `Добавить ${name} в избранное`}
      aria-pressed={active}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-muted transition hover:bg-white"
    >
      <Heart className={cn("h-[18px] w-[18px]", active ? "fill-accent-500 text-accent-500" : "text-[#B9BEC3]")} strokeWidth={1.6} />
    </button>
  );
}
