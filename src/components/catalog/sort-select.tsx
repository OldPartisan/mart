"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "new", label: "Сначала новинки" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-[12px] text-muted">
      <span className="hidden sm:inline">Сортировка:</span>
      <select
        value={params.get("sort") ?? "popular"}
        onChange={(event) => {
          const query = new URLSearchParams(params.toString());
          query.set("sort", event.target.value);
          query.delete("page");
          router.push(`${pathname}?${query.toString()}`, { scroll: false });
        }}
        className="h-9 rounded-full border border-line bg-white px-3 text-[12px] font-semibold text-ink outline-none focus:border-brand-700"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
