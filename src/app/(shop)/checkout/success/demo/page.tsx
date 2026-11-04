import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Демо-заказ оформлен",
  robots: { index: false, follow: false },
};

export default function DemoSuccessPage() {
  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-line bg-white p-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Заказ оформлен — в демо-режиме</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Это статическая витрина на GitHub Pages. Корзина и оформление работают, но заказ не уходит в магазин:
          полноценная версия с базой данных, оплатой и бонусами запускается на сервере.
        </p>
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-cream p-3.5 text-left text-[11.5px] text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
          В полной версии: оплата ЮKassa, личный кабинет, история заказов, бонусный счёт и админ-панель.
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/catalog" className="btn-primary">Вернуться в каталог <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/" className="btn-secondary">На главную</Link>
        </div>
      </div>
    </div>
  );
}
