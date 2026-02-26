/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-hover": "#D94E00",
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