import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import { Toaster } from "sonner";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { Analytics } from "@/components/layout/analytics";
import "./globals.css";
import { absoluteImage } from "@/lib/seo";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-golos",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Ирбис Март — фермерский супермаркет у Новой Туры",
    template: "%s — Ирбис Март",
  },
  description: site.description,
  keywords: [
    "Ирбис Март",
    "супермаркет Новая Тура",
    "фермерские продукты Татарстан",
    "доставка продуктов Зеленодольск",
    "самовывоз продукты",
    "собственное производство",
  ],
  applicationName: site.name,
  authors: [{ name: "ГК IRBIS" }],
  creator: "ГК IRBIS",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: absoluteUrl("/"),
    siteName: site.name,
    title: "Ирбис Март — фермерский супермаркет у Новой Туры",
    description: site.description,
    images: [{ url: absoluteImage("/images/store.jpg"), width: 1200, height: 800, alt: "Супермаркет Ирбис Март" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ирбис Март — фермерский супермаркет",
    description: site.description,
    images: [absoluteImage("/images/store.jpg")],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0F2C16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-800 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream"
        >
          Перейти к содержимому
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              border: "1px solid #E4DDCE",
              background: "#FFFFFF",
              color: "#18211A",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
