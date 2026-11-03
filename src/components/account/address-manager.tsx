"use client";

import { useState } from "react";
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Address = {
  id: string;
  label: string;
  city: string;
  street: string;
  house: string;
  apartment: string | null;
  entrance: string | null;
  floor: string | null;
  isDefault: boolean;
};

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    label: "Дом",
    city: "с. Новая Тура",
    street: "",
    house: "",
    apartment: "",
    entrance: "",
    floor: "",
    isDefault: addresses.length === 0,
  });

  const update = (key: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось сохранить адрес");
      toast.success("Адрес сохранён");
      setForm({ label: "Дом", city: "с. Новая Тура", street: "", house: "", apartment: "", entrance: "", floor: "", isDefault: false });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      toast.success("Адрес удалён");
      router.refresh();
    } else {
      toast.error("Не удалось удалить адрес");
    }
  };

  return (
    <div className="rounded-3xl border border-line/80 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Адреса доставки</h2>
        <button type="button" onClick={() => setOpen((value) => !value)} className="btn-secondary btn-sm">
          <Plus className="h-3.5 w-3.5" /> {open ? "Свернуть" : "Добавить"}
        </button>
      </div>

      {addresses.length > 0 && (
        <ul className="mt-3 space-y-2">
          {addresses.map((address) => (
            <li key={address.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line/70 p-3.5">
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">
                    {address.label} {address.isDefault && <span className="badge-green ml-1">основной</span>}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    {address.city}, {address.street}, {address.house}
                    {address.apartment ? `, кв. ${address.apartment}` : ""}
                    {address.entrance ? `, подъезд ${address.entrance}` : ""}
                    {address.floor ? `, этаж ${address.floor}` : ""}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => remove(address.id)} aria-label="Удалить адрес" className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-3 border-t border-line/70 pt-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addr-label">Название</label>
            <input id="addr-label" value={form.label} onChange={(event) => update("label", event.target.value)} className="field" placeholder="Дом, дача, работа" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addr-city">Посёлок / город</label>
            <input id="addr-city" value={form.city} onChange={(event) => update("city", event.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="addr-street">Улица</label>
            <input id="addr-street" value={form.street} onChange={(event) => update("street", event.target.value)} className="field" placeholder="Совхозная" />
          </div>
          <div>
            <label className="label" htmlFor="addr-house">Дом</label>
            <input id="addr-house" value={form.house} onChange={(event) => update("house", event.target.value)} className="field" placeholder="12" />
          </div>
          <div>
            <label className="label" htmlFor="addr-apartment">Квартира</label>
            <input id="addr-apartment" value={form.apartment} onChange={(event) => update("apartment", event.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="addr-entrance">Подъезд</label>
            <input id="addr-entrance" value={form.entrance} onChange={(event) => update("entrance", event.target.value)} className="field" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-muted sm:col-span-2">
            <input type="checkbox" checked={form.isDefault} onChange={(event) => update("isDefault", event.target.checked)} className="h-4 w-4 accent-[#2E7D32]" />
            Сделать основным адресом
          </label>
          {error && <p className="text-[11px] text-red-600 sm:col-span-2">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary btn-sm sm:col-span-2">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Сохранить адрес
          </button>
        </form>
      )}
    </div>
  );
}
