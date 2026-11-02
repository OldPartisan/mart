"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  Sparkles,
  Store,
  ShoppingBasket,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cartSubtotal, useCartStore } from "@/store/cart";
import { checkoutFormSchema, type CheckoutFormInput } from "@/lib/validation";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { DeliveryZone, PickupSlot } from "@/lib/delivery";
import { site } from "@/lib/site";

type Props = {
  user: { name: string; email: string; phone: string | null; bonusBalance: number } | null;
  zones: DeliveryZone[];
  pickupDays: PickupSlot[];
  deliveryEnabled: boolean;
};

type Promo = { code: string; discount: number; description: string };

export function CheckoutForm({ user, zones, pickupDays, deliveryEnabled }: Props) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [useBonus, setUseBonus] = useState(false);
  const [bonusValue, setBonusValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    track("begin_checkout", { value: cartSubtotal(items), currency: "RUB", items: items.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      deliveryType: "PICKUP",
      deliveryZoneId: zones[0]?.id ?? "",
      addressText: "",
      pickupDate: pickupDays[0]?.date ?? "",
      pickupSlot: "",
      paymentMethod: "ON_RECEIPT",
      comment: "",
      consent: false,
    },
  });

  const deliveryType = watch("deliveryType");
  const zoneId = watch("deliveryZoneId");
  const pickupDate = watch("pickupDate");
  const pickupSlot = watch("pickupSlot");
  const paymentMethod = watch("paymentMethod");

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const selectedZone = zones.find((zone) => zone.id === zoneId);
  const deliveryFee =
    deliveryType === "DELIVERY" && selectedZone ? (subtotal >= selectedZone.freeFrom ? 0 : selectedZone.fee) : 0;
  const deliveryError =
    deliveryType === "DELIVERY" && selectedZone && subtotal < selectedZone.minOrder
      ? `Минимальная сумма для этой зоны — ${formatPrice(selectedZone.minOrder)}`
      : "";
  const maxBonus = Math.min(user?.bonusBalance ?? 0, Math.floor(subtotal * 0.5));
  const appliedBonus = useBonus ? Math.min(bonusValue, maxBonus) : 0;
  const discount = promo?.discount ?? 0;
  const total = Math.max(0, subtotal - discount - appliedBonus + deliveryFee);
  const activeDay = pickupDays.find((day) => day.date === pickupDate);

  const bonusPreview = useMemo(() => Math.floor(Math.max(0, subtotal - discount - appliedBonus) / 100), [subtotal, discount, appliedBonus]);

  useEffect(() => {
    if (bonusValue > maxBonus) setBonusValue(maxBonus);
  }, [maxBonus, bonusValue]);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    if (staticDemo) {
      const demoPromos: Record<string, number> = { IRBIS10: 10, FARMER15: 15 };
      const percent = demoPromos[code.toUpperCase()];
      if (percent) {
        setPromo({ code: code.toUpperCase(), discount: Math.floor((subtotal * percent) / 100), description: `−${percent}% на заказ` });
        toast.success("Промокод применён (демо)");
      } else if (code.toUpperCase() === "WELCOME300") {
        setPromo({ code: "WELCOME300", discount: 300, description: "−300 ₽ на заказ" });
        toast.success("Промокод применён (демо)");
      } else {
        setPromoError("В демо-версии доступны IRBIS10, FARMER15 и WELCOME300");
      }
      setPromoLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Промокод не подошёл");
      setPromo(data);
      toast.success("Промокод применён", { description: data.description });
      track("promo_apply", { code: data.code, discount: data.discount });
    } catch (error) {
      setPromo(null);
      setPromoError((error as Error).message);
    } finally {
      setPromoLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    if (deliveryError) {
      toast.error(deliveryError);
      return;
    }
    setSubmitting(true);
    setServerError("");
    if (staticDemo) {
      try {
        const payload = {
          ...values,
          promoCode: promo?.code ?? "",
          bonusToUse: appliedBonus,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        };
        const key = "irbis-demo-orders";
        const previous = JSON.parse(localStorage.getItem(key) ?? "[]");
        localStorage.setItem(key, JSON.stringify([...previous, { ...payload, total, createdAt: new Date().toISOString() }]));
        track("purchase", { transaction_id: "DEMO", value: total, currency: "RUB", items: items.length });
        clear();
        toast.success("Демо-заказ оформлен");
        router.push("/checkout/success/demo");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          promoCode: promo?.code ?? "",
          bonusToUse: appliedBonus,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.fields) {
          for (const [field, messages] of Object.entries(data.fields as Record<string, string[]>)) {
            if (messages?.[0]) setError(field as keyof CheckoutFormInput, { message: messages[0] });
          }
        }
        throw new Error(data.error ?? "Не удалось оформить заказ");
      }

      track("purchase", {
        transaction_id: data.order.number,
        value: data.order.total,
        currency: "RUB",
        items: items.length,
      });
      clear();
      toast.success(`Заказ ${data.order.number} принят`);

      if (data.paymentUrl && !String(data.paymentUrl).startsWith("/")) {
        window.location.href = data.paymentUrl;
        return;
      }
      router.push(data.paymentUrl ?? `/checkout/success/${data.order.id}`);
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  });

  if (!mounted) {
    return <div className="container-x py-16 text-center text-sm text-muted">Загружаем оформление…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-brand-800">
            <ShoppingBasket className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">Корзина пуста</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Добавьте товары — и мы соберём заказ к вашему приезду. Самовывоз бесплатный, через 2 часа.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/catalog" className="btn-primary">В каталог <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/catalog/kombo-nabory" className="btn-secondary">Комбо-наборы</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="container-x py-8 md:py-12" noValidate>
      <Link href="/cart" className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-brand-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Вернуться в корзину
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-ink">Оформление заказа</h1>
          <p className="mt-1 text-[13px] text-muted">
            {items.length} позиций · самовывоз бесплатно · оплата картой или при получении
          </p>
        </div>
        {user ? (
          <span className="badge-green">
            <Sparkles className="h-3 w-3" /> Баланс: {user.bonusBalance} бонусов
          </span>
        ) : (
          <Link href="/login?next=/checkout" className="text-[12px] font-semibold text-brand-800 underline underline-offset-4">
            Войдите, чтобы списать бонусы
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          {/* Контакты */}
          <section className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-[12px] font-bold text-cream">1</span>
              <h2 className="font-display text-lg font-bold">Контакты</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="customerName" className="label">Имя и фамилия</label>
                <input id="customerName" {...register("customerName")} className="field" placeholder="Алия Габдуллина" autoComplete="name" />
                {errors.customerName && <p className="mt-1 text-[11px] text-red-600">{errors.customerName.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">Телефон</label>
                <input id="phone" {...register("phone")} className="field" placeholder="+7 (917) 000-00-00" inputMode="tel" autoComplete="tel" />
                {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" {...register("email")} className="field" placeholder="you@example.com" autoComplete="email" />
                {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>}
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted">Пришлём подтверждение заказа и статус готовности.</p>
          </section>

          {/* Получение */}
          <section className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-[12px] font-bold text-cream">2</span>
              <h2 className="font-display text-lg font-bold">Как получить</h2>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setValue("deliveryType", "PICKUP", { shouldValidate: true })}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                  deliveryType === "PICKUP" ? "border-brand-700 bg-brand-50" : "border-line hover:border-brand-700/40",
                )}
              >
                <Store className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <span>
                  <span className="block text-[13px] font-bold">Самовывоз</span>
                  <span className="mt-0.5 block text-[11px] text-muted">бесплатно · через 2 часа</span>
                </span>
              </button>
              <button
                type="button"
                disabled={!deliveryEnabled}
                onClick={() => setValue("deliveryType", "DELIVERY", { shouldValidate: true })}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
                  deliveryType === "DELIVERY" ? "border-brand-700 bg-brand-50" : "border-line hover:border-brand-700/40",
                )}
              >
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <span>
                  <span className="block text-[13px] font-bold">Доставка</span>
                  <span className="mt-0.5 block text-[11px] text-muted">от 149 ₽ · 2–5 часов</span>
                </span>
              </button>
            </div>

            {deliveryType === "PICKUP" ? (
              <div className="mt-5">
                <p className="label">Дата самовывоза</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {pickupDays.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setValue("pickupDate", day.date, { shouldValidate: true })}
                      className={cn(
                        "shrink-0 rounded-2xl border px-3 py-2 text-left transition",
                        pickupDate === day.date ? "border-brand-700 bg-brand-800 text-cream" : "border-line bg-white text-ink hover:border-brand-700/40",
                      )}
                    >
                      <span className="block text-[12px] font-bold">{day.label.split(",")[0]}</span>
                      <span className={cn("text-[10px]", pickupDate === day.date ? "text-cream/70" : "text-muted")}>{day.label.split(",")[1]}</span>
                    </button>
                  ))}
                </div>
                {errors.pickupDate && <p className="mt-1 text-[11px] text-red-600">{errors.pickupDate.message}</p>}

                <p className="label mt-4">Интервал</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(activeDay?.slots ?? pickupDays[0]?.slots ?? []).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setValue("pickupSlot", slot, { shouldValidate: true })}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-[12px] font-semibold transition",
                        pickupSlot === slot ? "border-brand-700 bg-brand-800 text-cream" : "border-line bg-white text-ink hover:border-brand-700/40",
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.pickupSlot && <p className="mt-1 text-[11px] text-red-600">{errors.pickupSlot.message}</p>}

                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-cream p-3.5 text-[11.5px] text-ink-soft">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <p>
                    <strong className="font-semibold">{site.address}</strong>
                    <br />
                    Стойка самовывоза у входа. Храним заказ {site.pickupStorage}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="deliveryZoneId" className="label">Зона доставки</label>
                  <select id="deliveryZoneId" {...register("deliveryZoneId")} className="field">
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {zone.fee} ₽, бесплатно от {zone.freeFrom} ₽
                      </option>
                    ))}
                  </select>
                  {errors.deliveryZoneId && <p className="mt-1 text-[11px] text-red-600">{errors.deliveryZoneId.message}</p>}
                  {selectedZone && (
                    <p className="mt-1.5 text-[11px] text-muted">
                      {selectedZone.eta} · минимальный заказ {formatPrice(selectedZone.minOrder)} ·{" "}
                      {deliveryFee === 0 ? "бесплатно" : formatPrice(deliveryFee)}
                    </p>
                  )}
                  {deliveryError && <p className="mt-1 text-[11px] text-red-600">{deliveryError}</p>}
                </div>
                <div>
                  <label htmlFor="addressText" className="label">Адрес: посёлок, улица, дом, квартира</label>
                  <textarea id="addressText" {...register("addressText")} className="field-area min-h-[90px]" placeholder="с. Новая Тура, ул. Совхозная, 12, кв. 4" />
                  {errors.addressText && <p className="mt-1 text-[11px] text-red-600">{errors.addressText.message}</p>}
                </div>
              </div>
            )}
          </section>

          {/* Оплата */}
          <section className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-[12px] font-bold text-cream">3</span>
              <h2 className="font-display text-lg font-bold">Оплата</h2>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { value: "ON_RECEIPT" as const, title: "При получении", text: "Картой или наличными на кассе", icon: Banknote },
                { value: "ONLINE" as const, title: "Онлайн", text: "Картой на сайте, безопасно", icon: CreditCard },
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setValue("paymentMethod", method.value, { shouldValidate: true })}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                    paymentMethod === method.value ? "border-brand-700 bg-brand-50" : "border-line hover:border-brand-700/40",
                  )}
                >
                  <method.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                  <span>
                    <span className="block text-[13px] font-bold">{method.title}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">{method.text}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label htmlFor="comment" className="label">Комментарий к заказу</label>
              <textarea id="comment" {...register("comment")} className="field-area min-h-[80px]" placeholder="Например: позвонить за 10 минут, нарезать хлеб" />
            </div>
          </section>

          {/* Промокод и бонусы */}
          <section className="rounded-3xl border border-line/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-[12px] font-bold text-cream">4</span>
              <h2 className="font-display text-lg font-bold">Скидки и бонусы</h2>
            </div>

            <div className="mt-4">
              <label htmlFor="promo" className="label">Промокод</label>
              {promo ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
                  <div>
                    <p className="flex items-center gap-2 text-[13px] font-bold text-brand-900">
                      <Tag className="h-4 w-4" /> {promo.code}
                    </p>
                    <p className="text-[11px] text-brand-800">{promo.description} · −{formatPrice(promo.discount)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPromo(null);
                      setPromoInput("");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brand-800 hover:bg-brand-100"
                    aria-label="Убрать промокод"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <input
                    id="promo"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                    className="field min-w-0 flex-1"
                    placeholder="IRBIS10"
                  />
                  <button type="button" onClick={applyPromo} disabled={promoLoading || !promoInput.trim()} className="btn-secondary shrink-0 px-4">
                    {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Применить"}
                  </button>
                </div>
              )}
              {promoError && <p className="mt-1 text-[11px] text-red-600">{promoError}</p>}
              <p className="mt-1.5 text-[10px] text-muted">Попробуйте IRBIS10 (10% от 1 000 ₽) или WELCOME300 (−300 ₽ от 1 200 ₽).</p>
            </div>

            <div className="mt-5 border-t border-line/70 pt-4">
              {user ? (
                <>
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                        <Sparkles className="h-4 w-4 text-accent-500" /> Списать бонусы
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted">
                        Доступно {user.bonusBalance} · можно списать до {maxBonus} (50% заказа)
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={useBonus}
                      onChange={(event) => {
                        setUseBonus(event.target.checked);
                        if (event.target.checked) setBonusValue(maxBonus);
                      }}
                      className="h-5 w-5 accent-[#2E7D32]"
                    />
                  </label>
                  {useBonus && (
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={maxBonus}
                        step={1}
                        value={bonusValue}
                        onChange={(event) => setBonusValue(Number(event.target.value))}
                        className="h-1.5 flex-1 accent-[#2E7D32]"
                        aria-label="Сколько бонусов списать"
                      />
                      <input
                        type="number"
                        min={0}
                        max={maxBonus}
                        value={bonusValue}
                        onChange={(event) => setBonusValue(Math.min(maxBonus, Math.max(0, Number(event.target.value))))}
                        className="field h-10 w-20 rounded-xl px-2 text-center text-[13px]"
                        aria-label="Бонусы к списанию"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[12px] text-muted">
                  <Link href="/login?next=/checkout" className="font-semibold text-brand-800 underline underline-offset-2">
                    Войдите
                  </Link>{" "}
                  или зарегистрируйтесь — начислим 300 бонусов и дадим списать до 50% заказа.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Итого */}
        <aside className="h-fit rounded-[2rem] border border-line/80 bg-white p-5 lg:sticky lg:top-[150px]">
          <h2 className="font-display text-lg font-bold">Ваш заказ</h2>
          <ul className="mt-3 max-h-[240px] space-y-2.5 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-2.5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                  <Image src={item.image || "/images/store.jpg"} alt="" fill sizes="44px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-[12px] font-bold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-muted">Товары</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-800">
                <dt>Промокод</dt>
                <dd className="font-semibold">−{formatPrice(discount)}</dd>
              </div>
            )}
            {appliedBonus > 0 && (
              <div className="flex justify-between text-accent-700">
                <dt>Бонусы</dt>
                <dd className="font-semibold">−{formatPrice(appliedBonus)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{deliveryType === "DELIVERY" ? "Доставка" : "Самовывоз"}</dt>
              <dd className="font-semibold">{deliveryFee === 0 ? "бесплатно" : formatPrice(deliveryFee)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[13px] font-semibold">К оплате</span>
            <span className="price text-2xl">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-right text-[10px] text-muted">Начислим ≈ {bonusPreview} бонусов</p>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-muted">
            <input type="checkbox" {...register("consent")} className="mt-0.5 h-4 w-4 accent-[#2E7D32]" />
            <span>
              Согласен с{" "}
              <Link href="/legal/terms" className="underline underline-offset-2 hover:text-ink">условиями</Link> и{" "}
              <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">политикой конфиденциальности</Link>
            </span>
          </label>
          {errors.consent && <p className="mt-1 text-[11px] text-red-600">{errors.consent.message}</p>}

          {serverError && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] text-red-700">{serverError}</p>}

          <button type="submit" disabled={submitting || Boolean(deliveryError)} className="btn-primary mt-4 w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {submitting ? "Создаём заказ…" : "Подтвердить заказ"}
          </button>
          <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
            Нажимая кнопку, вы подтверждаете заказ. Оплата — только после проверки суммы.
          </p>
        </aside>
      </div>
    </form>
  );
}
