import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        brand: {
          50: "#F5FAE8",
          100: "#EAF4CE",
          200: "#D8EAA4",
          300: "#C3DD78",
          400: "#B0D24B",
          500: "#AED200",
          600: "#A3C400",
          700: "#99B415",
          800: "#7E9A0E",
          900: "#5F7A08",
          950: "#2B3308",
        },
        accent: {
          50: "#FFF2F2",
          100: "#FFE3E3",
          200: "#FFC7C7",
          300: "#FF9B9B",
          400: "#FF5252",
          500: "#E50000",
          600: "#C40000",
          700: "#A00000",
        },
        yellow: { 400: "#FFCF58" },
        cream: { DEFAULT: "#F7F8F9", dark: "#F3F3F3" },
        ink: { DEFAULT: "#1A1A1A", soft: "#3F4448" },
        muted: "#5F666B",
        line: "#E3E6E9",
      },
      fontFamily: {
        sans: ["var(--font-golos)", "system-ui", "sans-serif"],
        display: ["var(--font-golos)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4.75rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        h1: ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h2: ["clamp(1.6rem, 2.8vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        h3: ["clamp(1.15rem, 1.6vw, 1.5rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      borderRadius: { "4xl": "1.5rem", "5xl": "2rem" },
      boxShadow: {
        card: "0 1px 2px rgba(24,33,26,0.04), 0 12px 32px -18px rgba(24,33,26,0.25)",
        float: "0 24px 64px -28px rgba(16,44,22,0.45)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.22,.61,.36,1) both",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
