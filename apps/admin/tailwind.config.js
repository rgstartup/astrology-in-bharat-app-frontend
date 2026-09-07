/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-hover": "#D94E00",
        orange: "#FF6B00",
        secondary: "#4A1D1F",
        "secondary-dark": "#301118",
        "border-light": "#E5E7EB",
        "text-light": "#6B7280",
        brand: {
          orange: "#F25E0A",
          brown: "#4A1D1F",
          white: "#FFFFFF",
        },
        'yellow': {
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        }
      }

    },
  },
  plugins: [],
}