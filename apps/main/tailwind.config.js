/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/libs/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // Point to packages/ui
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orange: "#FF6B00",
        brown: "#301118",
        white: "#FFFFFF",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
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
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Inter", "sans-serif"],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 10px 30px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 15px rgba(212, 175, 55, 0.2)',
      }
    },
  },
  plugins: [],
}
