import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { DELIVERY_ENABLED, DELIVERY_ZONES, getPickupDays } from "@/lib/delivery";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформите заказ в «Ирбис Март»: самовывоз через 2 часа или доставка, оплата картой или при получении.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = process.env.NEXT_PUBLIC_STATIC_DEMO === "1" ? null : await getCurrentUser();
  const pickupDays = getPickupDays(5);
  return (
    <CheckoutForm
      user={user ? { name: user.name, email: user.email, phone: user.phone, bonusBalance: user.bonusBalance } : null}
      zones={DELIVERY_ZONES}
      pickupDays={pickupDays}
      deliveryEnabled={DELIVERY_ENABLED}
    />
  );
}
