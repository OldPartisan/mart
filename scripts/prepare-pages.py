"""Готовит копию проекта к статическому экспорту на GitHub Pages."""
from pathlib import Path
import shutil, re

root = Path.cwd()

# 1. Убираем серверную динамику у публичных страниц
for path in (root / "src/app/(shop)").rglob("*.tsx"):
    text = path.read_text(encoding="utf8")
    text = re.sub(r'export const dynamic = "force-dynamic";\n', "", text)
    path.write_text(text, encoding="utf8")

# 2. Удаляем серверные разделы и API
for rel in ["src/app/api", "src/app/admin", "src/components/admin", "src/components/account", "src/components/auth", "src/app/(shop)/account",
            "src/app/(shop)/login", "src/app/(shop)/register",
            "src/app/(shop)/forgot-password", "src/app/(shop)/reset-password",
            "src/app/(shop)/checkout/payment", "src/app/(shop)/checkout/success/[id]"]:
    target = root / rel
    if target.exists():
        shutil.rmtree(target)

# 3. Заглушки вместо закрытых разделов
placeholder = '''import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function DemoPlaceholder() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white p-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-800">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Раздел работает в полной версии</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Это статическая демо-витрина на GitHub Pages. Личный кабинет, вход, бонусный счёт и админ-панель
          требуют сервера, базы данных и защищённых сессий. Полный код и инструкция по запуску — в репозитории.
        </p>
        <div className="mt-4 rounded-2xl bg-cream p-4 text-left text-[11.5px] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">Что уже доступно в демо:</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4">
            <li>каталог, карточки товаров и поиск;</li>
            <li>корзина и оформление заказа с расчётом доставки;</li>
            <li>акции, программа лояльности, кафе и контакты.</li>
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/catalog" className="btn-primary">В каталог</Link>
          <Link href="/" className="btn-secondary"><ArrowLeft className="h-4 w-4" /> На главную</Link>
        </div>
      </div>
    </div>
  );
}
'''

for rel in ["src/app/(shop)/login", "src/app/(shop)/register", "src/app/(shop)/forgot-password",
            "src/app/(shop)/reset-password", "src/app/(shop)/account", "src/app/(shop)/account/orders",
            "src/app/(shop)/account/bonuses", "src/app/(shop)/account/profile"]:
    target = root / rel
    target.mkdir(parents=True, exist_ok=True)
    (target / "page.tsx").write_text(placeholder, encoding="utf8")

# 3.5. Префикс /mart для локальных картинок и иконок (next/image не добавляет basePath)
for path in (root / "src").rglob("*.ts*"):
    text = path.read_text(encoding="utf8")
    text = (text.replace('"/images/', '"/mart/images/')
                .replace("'/images/", "'/mart/images/")
                .replace("`/images/", "`/mart/images/")
                .replace('"/favicon.svg"', '"/mart/favicon.svg"')
                .replace('"/apple-touch-icon.svg"', '"/mart/apple-touch-icon.svg"'))
    path.write_text(text, encoding="utf8")

# 4. Манифест: корректный start_url для подпути
manifest = root / "public/manifest.webmanifest"
if manifest.exists():
    text = manifest.read_text(encoding="utf8").replace('"start_url": "/"', '"start_url": "/mart/"').replace('"/favicon.svg"', '"/mart/favicon.svg"')
    manifest.write_text(text, encoding="utf8")

print("[static] подготовлено")
