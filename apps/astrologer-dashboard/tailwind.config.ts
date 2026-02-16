import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}", // include App Router if you use it
    "../shared/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
