#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$ROOT/.pages-build"
NODE_BIN="${NODE_BIN:-node}"

echo "→ чистим $BUILD"
rm -rf "$BUILD"
mkdir -p "$BUILD"

echo "→ копируем проект"
rsync -a \
  --exclude node_modules --exclude .next --exclude .data --exclude .pages-build \
  --exclude .git --exclude out --exclude test-results --exclude playwright-report \
  "$ROOT/" "$BUILD/"
ln -s "$ROOT/node_modules" "$BUILD/node_modules"

cd "$BUILD"
rm -rf .data
echo "→ готовим статическую версию"
python3 "$ROOT/scripts/prepare-pages.py"

cat > next.config.ts <<'CONFIG'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mart",
  assetPrefix: "/mart",
  trailingSlash: true,
  images: { unoptimized: true },
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: { cpus: 1, workerThreads: false },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
CONFIG

perl -0pi -e 's/export default async function/export const dynamic = "force-static";\n\nexport default async function/' "src/app/(shop)/catalog/page.tsx" "src/app/(shop)/catalog/[slug]/page.tsx"

mkdir -p src/app/admin
cat > src/app/admin/page.tsx <<'ADMIN'
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AdminDemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F1E8] px-4 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-2xl font-bold">Админ-панель — в полной версии</h1>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
        В статической демо-версии нет сервера и базы данных. Полная версия включает CRUD товаров,
        управление заказами, промокодами и пользователями.
      </p>
      <Link href="/" className="btn-primary mt-5">На витрину</Link>
    </div>
  );
}
ADMIN

echo "→ экспортируем каталог для поиска"
NEXT_PUBLIC_STATIC_DEMO=1 "$NODE_BIN" node_modules/tsx/dist/cli.mjs scripts/export-products.ts

echo "→ собираем static export"
STATIC_EXPORT=1 \
NEXT_PUBLIC_STATIC_DEMO=1 \
NEXT_PUBLIC_BASE_PATH=/mart \
NEXT_PUBLIC_SITE_URL=https://oldpartisan.github.io/mart \
"$NODE_BIN" node_modules/next/dist/bin/next build

# next/image + metadataBase дублирует basePath в OG-ссылках (/mart/mart/)
python3 - <<'PYFIX'
from pathlib import Path
for path in Path("out").rglob("*.html"):
    text = path.read_text(encoding="utf8")
    head, sep, rest = text.partition("</head>")
    fixed_head = head.replace("/mart/mart/", "/mart/")
    if fixed_head != head:
        path.write_text(fixed_head + sep + rest, encoding="utf8")
PYFIX

touch out/.nojekyll
echo "→ готово: $BUILD/out"
