import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Ваша корзина в супермаркете «Ирбис Март». Самовывоз через 2 часа или доставка по ближним посёлкам.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
