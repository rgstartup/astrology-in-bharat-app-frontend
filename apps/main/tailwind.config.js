/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./libs/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // Point to packages/ui
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // orange: "#1a0e05ff",
        orange: "#FF6B00",
        brown: "#301118",
        white: "#FFFFFF",
        /*
        bhagwa: {
          DEFAULT: "var(--color-bhagwa)",
          hover: "var(--color-bhagwa-hover)",
          light: "var(--color-bhagwa-light)",
          dark: "var(--color-bhagwa-dark)",
        },
        brown_old: {
          DEFAULT: "var(--color-maroon)",
          hover: "var(--color-maroon-hover)",
          light: "var(--color-maroon-light)",
          dark: "var(--color-maroon-dark)",
        },
        black: {
          DEFAULT: "var(--color-black)",
          soft: "var(--color-black-soft)",
          muted: "var(--color-black-muted)",
        },
        white_old: {
          DEFAULT: "var(--color-white)",
          cream: "var(--color-cream)",
          off: "#F5E6E6",
        },
        brand: {
          orange: "var(--color-bhagwa)",
          maroon: "var(--color-maroon)",
          gold: "var(--color-gold)",
          cream: "var(--color-cream)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          light: "var(--color-secondary-light)",
          dark: "var(--color-secondary-dark)",
        },
        accent: {
          gold: "var(--color-gold)",
          "gold-light": "var(--color-gold-light)",
          "gold-dark": "var(--color-gold-dark)",
        },
        background: {
          light: "var(--color-background-light)",
          dark: "var(--color-background-dark)",
          alt: "#F8F0E8",
        },
        surface: {
          light: "var(--color-white)",
          dark: "#1A1111",
          muted: "#F5E6E6",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          dark: {
            primary: "#F5E6E6",
            secondary: "#B3A5A5",
            muted: "#8C7E7E",
          }
        },
        border: {
          light: "var(--color-border-light)",
          dark: "var(--color-border-dark)",
        }
        */
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-outfit)", "serif"],
        body: ["Inter", "sans-serif"],
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
