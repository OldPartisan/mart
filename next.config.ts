import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport ? "/mart" : "";

const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
      }
    : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  // Изображения лежат локально и уже сжаты. Оптимизатор отключён,
  // чтобы сборка не зависела от нативной библиотеки sharp (см. README).
  images: { unoptimized: true },
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
    // PGlite — один файловый инстанс; сериализуем сборку, чтобы страницы
    // не открывали базу параллельно. В продакшене с PostgreSQL не нужно.
    cpus: 1,
    workerThreads: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
