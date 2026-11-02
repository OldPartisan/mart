import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-16 text-center">
      <Logo />
      <p className="mt-10 font-display text-7xl font-extrabold tracking-tighter text-brand-800">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">Такой полки у нас нет</h1>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
        Страница переехала или никогда не существовала. Зато каталог на месте — там точно что-то есть.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn-primary"><Home className="h-4 w-4" /> На главную</Link>
        <Link href="/catalog" className="btn-secondary"><Search className="h-4 w-4" /> В каталог</Link>
      </div>
      <Link href="/promotions" className="mt-6 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-800">
        Посмотреть акции <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
