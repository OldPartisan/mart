"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const THRESHOLD = 64;
const MAX_PULL = 96;

/**
 * Мягкий pull-to-refresh для мобильного WebView/PWA.
 * Работает только когда страница прокручена в самый верх и жест вертикальный.
 */
export function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);

  useEffect(() => {
    const setPullValue = (value: number) => {
      pullRef.current = value;
      setPull(value);
    };

    const isAtTop = () =>
      window.scrollY <= 0 && document.documentElement.scrollTop <= 0;

    const onStart = (event: TouchEvent) => {
      if (refreshingRef.current || event.touches.length !== 1) return;
      if (document.body.style.overflow === "hidden") return;
      if (!isAtTop()) return;
      startY.current = event.touches[0].clientY;
    };

    const onMove = (event: TouchEvent) => {
      if (startY.current === null || refreshingRef.current) return;
      const delta = event.touches[0].clientY - startY.current;

      if (delta <= 0) {
        if (pullRef.current > 0) setPullValue(0);
        return;
      }
      if (!isAtTop()) {
        startY.current = null;
        setPullValue(0);
        return;
      }
      if (delta > 6 && event.cancelable) event.preventDefault();

      const next = Math.min(MAX_PULL, delta * 0.55);
      setPullValue(next);
    };

    const finish = () => {
      if (startY.current === null) return;
      const shouldRefresh = pullRef.current >= THRESHOLD;
      startY.current = null;

      if (shouldRefresh) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullValue(THRESHOLD);
        window.setTimeout(() => window.location.reload(), 280);
      } else {
        setPullValue(0);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", finish);
    window.addEventListener("touchcancel", finish);

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", finish);
      window.removeEventListener("touchcancel", finish);
    };
  }, []);

  const visible = pull > 4 || refreshing;
  const ready = pull >= THRESHOLD;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-[136px] z-[95] flex justify-center transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{ top: "calc(136px + env(safe-area-inset-top))" }}
    >
      <div
        className="mt-2 flex h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-[12px] font-medium text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
        style={{ transform: "translateY(0px)" }}
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
        ) : (
          <ArrowDown
            className={cn("h-4 w-4 text-brand-700 transition-transform", ready && "rotate-180")}
          />
        )}
        <span>{refreshing ? "Обновляем…" : ready ? "Отпустите" : "Потяните вниз"}</span>
      </div>
    </div>
  );
}
