"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

export function CafePreorderForm() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "12:00", guests: "2", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === "1") {
      setStatus("done");
      return;
    }
      const message = [
        "Предзаказ в кафе IRBIS MART",
        `Дата: ${form.date || "не указана"}, время: ${form.time}`,
        `Гостей: ${form.guests}`,
        form.comment ? `Пожелания: ${form.comment}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: "",
          message,
          consent: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось отправить заявку");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-brand-50 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-cream">
          <Check className="h-5 w-5" />
        </span>
        <p className="mt-3 font-display text-lg font-bold text-brand-900">Заявка отправлена</p>
        <p className="mt-1 text-[12px] text-brand-800/80">Менеджер позвонит, чтобы подтвердить дату и время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="cafe-name" className="label">Имя</label>
        <input id="cafe-name" required value={form.name} onChange={(event) => update("name", event.target.value)} className="field" placeholder="Как к вам обращаться" />
      </div>
      <div>
        <label htmlFor="cafe-phone" className="label">Телефон</label>
        <input id="cafe-phone" required value={form.phone} onChange={(event) => update("phone", event.target.value)} className="field" placeholder="+7 (917) 000-00-00" inputMode="tel" />
      </div>
      <div>
        <label htmlFor="cafe-date" className="label">Дата</label>
        <input id="cafe-date" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className="field" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cafe-time" className="label">Время</label>
          <input id="cafe-time" type="time" value={form.time} onChange={(event) => update("time", event.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="cafe-guests" className="label">Гостей</label>
          <input id="cafe-guests" type="number" min={1} max={20} value={form.guests} onChange={(event) => update("guests", event.target.value)} className="field" />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="cafe-comment" className="label">Пожелания</label>
        <textarea id="cafe-comment" value={form.comment} onChange={(event) => update("comment", event.target.value)} className="field-area min-h-[80px]" placeholder="Стол у окна, детский стул, предзаказ блюд…" />
      </div>
      <p className="text-[10px] leading-relaxed text-muted sm:col-span-2">
        Отправляя заявку, вы соглашаетесь с политикой конфиденциальности. Бронь подтверждает менеджер по телефону.
      </p>
      {error && <p className="text-[11px] text-red-600 sm:col-span-2">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary sm:col-span-2">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Отправить заявку
      </button>
    </form>
  );
}
