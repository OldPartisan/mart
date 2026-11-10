"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Plug, Save, X } from "lucide-react";
import { toast } from "sonner";
import { saveIntegrationSettings } from "@/app/admin/content/actions";
import { cn } from "@/lib/utils";

type Values = {
  enabled: boolean;
  baseUrl: string;
  authType: string;
  username: string;
  secret: string;
  priceType: string;
  warehouse: string;
  interval: string;
  syncCatalog: boolean;
  syncPrices: boolean;
  syncStock: boolean;
  syncOrders: boolean;
};

const defaults: Values = {
  enabled: false,
  baseUrl: "",
  authType: "token",
  username: "",
  secret: "",
  priceType: "Розничная",
  warehouse: "Основной склад",
  interval: "15",
  syncCatalog: true,
  syncPrices: true,
  syncStock: true,
  syncOrders: false,
};

export function IntegrationForm({ initial }: { initial: Record<string, unknown> }) {
  const [values, setValues] = useState<Values>({ ...defaults, ...(initial as Partial<Values>) });
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));

  const save = () => {
    startTransition(async () => {
      try {
        await saveIntegrationSettings(values as unknown as Record<string, unknown>);
        toast.success("Настройки 1С сохранены");
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <section className="rounded-[18px] border border-line bg-white p-5">
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 text-brand-700" />
            <h2 className="font-display text-lg font-bold">Подключение</h2>
          </div>
          <label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#F7F8F9] px-4 py-3 text-[13px] font-semibold">
            Интеграция включена
            <input type="checkbox" checked={values.enabled} onChange={(event) => set("enabled", event.target.checked)} className="h-5 w-5 accent-[#99B415]" />
          </label>
          <label className="mt-3 block text-[11px] font-semibold text-muted">URL HTTP-сервиса 1С<input value={values.baseUrl} onChange={(event) => set("baseUrl", event.target.value)} className="field mt-1" placeholder="https://1c.example.ru/hs/site" /></label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold text-muted">Авторизация
              <select value={values.authType} onChange={(event) => set("authType", event.target.value)} className="field mt-1">
                <option value="token">Bearer token</option>
                <option value="basic">Basic auth</option>
                <option value="mtls">mTLS</option>
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-muted">Логин<input value={values.username} onChange={(event) => set("username", event.target.value)} className="field mt-1" autoComplete="off" /></label>
          </div>
          <label className="mt-3 block text-[11px] font-semibold text-muted">Токен / пароль<input type="password" value={values.secret} onChange={(event) => set("secret", event.target.value)} className="field mt-1" autoComplete="new-password" placeholder="Хранится в настройках" /></label>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => toast.info("Ждём HTTP-сервис 1С: проверка станет доступна после подключения")} className="btn-secondary h-10 text-[12px]">Проверить соединение</button>
            <span className="flex items-center gap-1 text-[11px] text-muted"><X className="h-3.5 w-3.5" /> 1С пока не подключена</span>
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Маппинг</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold text-muted">Тип цены<input value={values.priceType} onChange={(event) => set("priceType", event.target.value)} className="field mt-1" /></label>
            <label className="block text-[11px] font-semibold text-muted">Склад<input value={values.warehouse} onChange={(event) => set("warehouse", event.target.value)} className="field mt-1" /></label>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">GUID номенклатуры, артикул, штрихкод, категория, единица и изображения будут сопоставляться по ответу 1С после подключения.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ["Каталог", "syncCatalog"],
              ["Цены", "syncPrices"],
              ["Остатки", "syncStock"],
              ["Заказы", "syncOrders"],
            ].map(([label, key]) => (
              <label key={key} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-[12px] font-semibold">
                <input type="checkbox" checked={values[key as keyof Values] as boolean} onChange={(event) => set(key as keyof Values, event.target.checked as never)} className="h-4 w-4 accent-[#99B415]" />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Синхронизация</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold text-muted">Интервал, минут
              <select value={values.interval} onChange={(event) => set("interval", event.target.value)} className="field mt-1">
                <option value="5">5</option><option value="15">15</option><option value="60">60</option>
              </select>
            </label>
            <div className="rounded-xl bg-[#F7F8F9] p-3 text-[11px] leading-relaxed text-muted">Последняя синхронизация: ещё не было. Логи появятся после подключения 1С.</div>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-[18px] border border-line bg-white p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-bold">Статус</h2>
        <p className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold", values.enabled ? "bg-brand-100 text-brand-900" : "bg-[#F3F3F3] text-muted")}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" /> {values.enabled ? "Включена" : "Не настроена"}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">Сохранение конфигурации не запускает обмен. Для реальной синхронизации нужен HTTP-сервис 1С и worker.</p>
        <button type="button" onClick={save} disabled={pending} className="btn-primary mt-4 w-full">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Сохранить
        </button>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted"><Check className="h-3 w-3" /> Секреты не выводятся в клиент</p>
      </aside>
    </div>
  );
}
