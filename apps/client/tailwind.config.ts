import type { Config } from "tailwindcss";
import { designPreset } from "@repo/design/tailwind";

const config: Config = {
  important: true,
  presets: [designPreset as unknown as Config],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/libs/**/*.{js,ts,jsx,tsx}",
    "../../packages/design/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orange: "var(--brand-saffron)",
        saffron: {
          DEFAULT: "var(--brand-saffron)",
          strong: "var(--brand-saffron-strong)",
        },
        "brand-emerald": "var(--brand-emerald)",
        brown: {
          DEFAULT: "var(--brand-brown)",
          muted: "var(--brand-brown-muted)",
        },
        white: "#FFFFFF",
        accent: {
          gold: "var(--accent-gold)",
        },
        danger: {
          DEFAULT: "#dc3545",
          dark: "#c82333",
        },
        "bg-light": "var(--bg-light)",
      },
      fontFamily: {
        sans: ["var(--font-sans, Inter)", "sans-serif"],
        display: ["var(--font-display, Outfit)", "sans-serif"],
        body: ["var(--font-sans, Inter)", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Inter", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      boxShadow: {
        premium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "premium-hover": "0 10px 30px rgba(0, 0, 0, 0.12)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.2)",
        saffron: "0 4px 15px rgba(255, 107, 0, 0.2)",
        "saffron-hover": "0 8px 25px rgba(255, 107, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
