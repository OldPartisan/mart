import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  image = "/images/store.jpg",
  quote,
  author,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  image?: string;
  quote: string;
  author: string;
}) {
  return (
    <div className="container-x py-8 md:py-12">
      <div className="grid overflow-hidden rounded-[2.5rem] border border-line bg-white lg:grid-cols-2">
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <Link href="/" className="flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-brand-900">
              <ArrowLeft className="h-3.5 w-3.5" /> На главную
            </Link>
          </div>
          <div className="mx-auto mt-10 max-w-sm">
            <p className="eyebrow">Личный кабинет</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>

        <div className="relative hidden min-h-[560px] lg:block">
          <Image src={image} alt="" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-brand-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-cream">
            <Leaf className="h-6 w-6 text-accent-300" />
            <blockquote className="mt-3 max-w-md font-display text-2xl font-bold leading-snug">«{quote}»</blockquote>
            <p className="mt-3 text-[12px] text-cream/60">{author}</p>
            <div className="mt-6 flex gap-5 border-t border-cream/15 pt-4 text-[11px] text-cream/55">
              <span>1 бонус = 1 ₽</span>
              <span>300 бонусов за регистрацию</span>
              <span>Самовывоз 2 часа</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
