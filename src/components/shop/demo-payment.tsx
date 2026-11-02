"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

export function DemoPayment({ orderId, amount }: { orderId: string; amount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/mock-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Оплата не прошла");
      router.push(`/checkout/success/${orderId}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={pay} disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Оплатить {amount.toLocaleString("ru-RU")} ₽
      </button>
      {error && <p className="mt-2 text-center text-[11px] text-red-600">{error}</p>}
      <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted">
        <ShieldCheck className="h-3 w-3" /> Демо-касса: реальные деньги не списываются
      </p>
    </div>
  );
}
