"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type CapacitorWindow = Window & {
  Capacitor?: { isNativePlatform?: () => boolean };
};

/**
 * Нижняя навигация для Android/iOS WebView.
 * В обычном мобильном браузере не показывается, чтобы не дублировать browser chrome.
 * Для QA в браузере: ?app=1 — флаг запоминается в sessionStorage.
 */
export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const capacitor = (window as CapacitorWindow).Capacitor;
    const native =
      Boolean(capacitor?.isNativePlatform?.()) ||
      /Android/i.test(navigator.userAgent) && /;\s*wv\)/i.test(navigator.userAgent);
    const preview = new URLSearchParams(window.location.search).get("app") === "1";

    if (preview) sessionStorage.setItem("irbis-app-preview", "1");
    const enabled = native || preview || sessionStorage.getItem("irbis-app-preview") === "1";

    setVisible(enabled);
    if (enabled) document.body.classList.add("has-bottom-nav");
    return () => document.body.classList.remove("has-bottom-nav");
  }, []);

  if (!visible) return null;

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const focusSearch = () => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[data-search-input]"));
    const input = inputs.find((item) => item.getClientRects().length > 0);
    if (!input) {
      router.push("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    input.focus();
    input.select();
  };

  const itemClass =
    "flex h-12 flex-1 flex-col items-center justify-center gap-0 text-[9.5px] font-medium leading-none text-muted transition active:bg-cream disabled:opacity-40";

  return (
    <nav
      aria-label="Навигация приложения"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        <button type="button" onClick={goBack} className={itemClass} aria-label="Назад">
          <ArrowLeft className="h-5 w-5" />
          Назад
        </button>
        <button type="button" onClick={() => router.forward()} className={itemClass} aria-label="Вперёд">
          <ArrowRight className="h-5 w-5" />
          Вперёд
        </button>
        <button type="button" onClick={focusSearch} className={itemClass} aria-label="Поиск">
          <Search className="h-5 w-5" />
          Поиск
        </button>
        <button
          type="button"
          onClick={() => {
            if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            else router.push("/");
          }}
          className={cn(itemClass, pathname === "/" && "text-brand-800")}
          aria-label="Главная"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Home className="h-5 w-5" />
          Главная
        </button>
      </div>
    </nav>
  );
}
