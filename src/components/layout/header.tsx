import Link from "next/link";
import { Suspense } from "react";
import { MapPin } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";
import { UserMenu } from "./user-menu";
import { CatalogMenu } from "./catalog-menu";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";
import { DeliveryLink } from "./delivery-link";

export async function Header() {
  const categories = await getCategories();
  const session = process.env.NEXT_PUBLIC_STATIC_DEMO === "1" ? null : await getSession();
  const user = session ? { name: session.name, email: session.email, role: session.role } : null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      {process.env.NEXT_PUBLIC_STATIC_DEMO === "1" && (
        <div className="bg-accent-500 px-4 py-1.5 text-center text-[10.5px] font-semibold text-white">
          Демо-витрина на GitHub Pages · заказы не отправляются · полная версия запускается на сервере
        </div>
      )}

      <div className="container-x">
        <div className="flex items-center gap-2 py-3 sm:gap-3">
          <Logo />
          <div className="hidden lg:block">
            <CatalogMenu categories={categories} />
          </div>
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <SearchBar className="max-w-[426px]" />
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <UserMenu user={user} />
            <DeliveryLink />
            <CartButton />
            <MobileMenu categories={categories} user={user} />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>

        <div className="hidden h-11 items-center justify-between border-t border-line/70 lg:flex">
          <Link href="/contacts" className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink">
            <MapPin className="h-3.5 w-3.5 text-brand-900" aria-hidden="true" />
            Новая Тура
          </Link>
          <div className="h-full min-w-0">
            <Suspense fallback={<div className="h-full" />}>
              <NavLinks />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
