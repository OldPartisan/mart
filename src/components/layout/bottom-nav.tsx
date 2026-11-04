"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

type CapacitorWindow = Window & {
  Capacitor?: { isNativePlatform?: () => boolean };
};

/** Нижняя навигация для Android/iOS WebView. В браузере: ?app=1. */
export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  useEffect(() => {
    setMounted(true);
    const capacitor = (window as CapacitorWindow).Capacitor;
    const native =
      Boolean(capacitor?.isNativePlatform?.()) ||
      (/Android/i.test(navigator.userAgent) && /;\s*wv\)/i.test(navigator.userAgent));
    const preview = new URLSearchParams(window.location.search).get("app") === "1";

    if (preview) sessionStorage.setItem("irbis-app-preview", "1");
    const enabled = native || preview || sessionStorage.getItem("irbis-app-preview") === "1";

    setVisible(enabled);
    if (enabled) document.body.classList.add("has-bottom-nav");
    return () => document.body.classList.remove("has-bottom-nav");
  }, []);

  const focusSearch = () => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[data-search-input]"));
    const input = inputs.find((item) => item.getClientRects().length > 0);
    if (!input) {
      router.push("/catalog");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    input.focus();
    input.select();
  };

  if (!visible) return null;

  const tabs = [
    { href: "/", label: "Главная", icon: Home, active: pathname === "/" },
    { href: "/catalog", label: "Каталог", icon: LayoutGrid, active: pathname.startsWith("/catalog") },
    { href: "#search", label: "Поиск", icon: Search, active: false, onClick: focusSearch },
    { href: "/cart", label: "Корзина", icon: ShoppingBag, active: pathname === "/cart", badge: mounted ? count : 0 },
    { href: "/account", label: "Профиль", icon: User, active: pathname.startsWith("/account") },
  ];

  return (
    <nav
      aria-label="Навигация приложения"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => (tab.onClick ? tab.onClick() : router.push(tab.href))}
              className={cn(
                "relative flex h-[52px] flex-1 flex-col items-center justify-center gap-0 text-[9.5px] font-medium leading-none text-muted transition active:bg-cream",
                tab.active && "text-brand-900",
              )}
              aria-label={tab.label}
              aria-current={tab.active ? "page" : undefined}
            >
              <span className={cn("mb-0.5 flex h-6 min-w-10 items-center justify-center rounded-full px-2", tab.active && "bg-brand-700 text-white")}>
                <Icon className="h-[20px] w-[20px]" />
                {tab.badge ? (
                  <span className="absolute right-[22%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                ) : null}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
