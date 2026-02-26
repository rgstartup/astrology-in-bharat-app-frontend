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
        brand: {
          orange: "#FF6B00",
          maroon: "#4A1D1F",
          gold: "#D4AF37",
          cream: "#FFF9F4",
        },
        primary: {
          DEFAULT: "#FF6B00",
          hover: "#E65100",
          light: "#FFF3E0",
          dark: "#C45000",
        },
        secondary: {
          DEFAULT: "#4A1D1F",
          hover: "#381416",
          light: "#6D2D2F",
          dark: "#2D1112",
        },
        accent: {
          gold: "#D4AF37",
          "gold-light": "#F2E2B0",
          "gold-dark": "#B8860B",
        },
        background: {
          light: "#FFF9F4",
          dark: "#0F0808",
          alt: "#F8F0E8",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1111",
          muted: "#F5E6E6",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          muted: "#767676",
          dark: {
            primary: "#F5E6E6",
            secondary: "#B3A5A5",
            muted: "#8C7E7E",
          }
        },
        border: {
          light: "#E0D5D0",
          dark: "#3D2B2B",
        }
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
