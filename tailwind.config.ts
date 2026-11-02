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
          50: "#F2F7F0",
          100: "#E3EFDE",
          200: "#C7DFBE",
          300: "#A3C896",
          400: "#7BAE6B",
          500: "#57934A",
          600: "#3F7A36",
          700: "#2E7D32",
          800: "#22622A",
          900: "#1A4C23",
          950: "#0F2C16",
        },
        accent: {
          50: "#FFF4EA",
          100: "#FFE6D1",
          200: "#FFC9A3",
          300: "#FFA36B",
          400: "#FB7F3C",
          500: "#F26B21",
          600: "#D9550F",
          700: "#B4430D",
        },
        cream: { DEFAULT: "#F8F4EA", dark: "#F1EADA" },
        ink: { DEFAULT: "#18211A", soft: "#3C463E" },
        muted: "#6D766E",
        line: "#E4DDCE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4.75rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        h1: ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h2: ["clamp(1.6rem, 2.8vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        h3: ["clamp(1.15rem, 1.6vw, 1.5rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.75rem" },
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
