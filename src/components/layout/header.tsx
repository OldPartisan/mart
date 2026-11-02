import Link from "next/link";
import { Suspense } from "react";
import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";
import { UserMenu } from "./user-menu";
import { CatalogMenu } from "./catalog-menu";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const categories = await getCategories();
  const session = process.env.NEXT_PUBLIC_STATIC_DEMO === "1" ? null : await getSession();
  const user = session ? { name: session.name, email: session.email, role: session.role } : null;

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-[#FBF8F1]/95 backdrop-blur-md">
      {process.env.NEXT_PUBLIC_STATIC_DEMO === "1" && (
        <div className="bg-accent-500 px-4 py-1.5 text-center text-[10.5px] font-semibold text-white">
          Демо-витрина на GitHub Pages · заказы не отправляются · полная версия запускается на сервере
        </div>
      )}
      <div className="hidden bg-brand-950 text-cream/75 lg:block">
        <div className="container-x flex h-9 items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-accent-400" aria-hidden="true" />
              {site.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-accent-400" aria-hidden="true" />
              {site.hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/delivery" className="flex items-center gap-1.5 transition-colors hover:text-cream">
              <Truck className="h-3 w-3 text-accent-400" aria-hidden="true" />
              Бесплатная доставка от 1 500 ₽
            </Link>
            <a href={site.phoneHref} className="font-semibold text-cream transition-colors hover:text-accent-300">
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x">
        <div className="flex items-center gap-3 py-3 lg:gap-6">
          <Logo className="shrink-0" />
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar className="max-w-xl" />
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <UserMenu user={user} />
            <CartButton />
            <MobileMenu categories={categories} user={user} />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>

        <div className="hidden h-12 items-center gap-3 border-t border-line/70 lg:flex">
          <CatalogMenu categories={categories} />
          <div className="h-full min-w-0 flex-1">
            <Suspense fallback={<div className="h-full" />}>
              <NavLinks />
            </Suspense>
          </div>
          <Link href="/pickup" className="shrink-0 text-[12px] font-semibold text-brand-800 transition-colors hover:text-accent-600">
            Самовывоз за 2 часа
          </Link>
        </div>
      </div>
    </header>
  );
}
