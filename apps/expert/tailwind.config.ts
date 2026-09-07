import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../shared/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          ...colors.orange,
          DEFAULT: "#FF6B00",
        },
        secondary: "#301118",
        "secondary-dark": "#1A0E05",
        brand: {
          orange: "#F25E0A",
          brown: "#4A1D1F",
          white: "#FFFFFF",
        },
        gold: "#daa23e",
        "astro-primary": "#732882",
        "astro-bg": "#fcfbf5",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;


