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
  // Static export на GitHub Pages не умеет оптимизировать изображения.
  // На Vercel/Node включаем responsive srcset + AVIF/WebP через sharp.
  images: isStaticExport
    ? { unoptimized: true }
    : {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 31536000,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      },
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
