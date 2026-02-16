/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // All pages in app folder
    "./components/**/*.{js,ts,jsx,tsx}",  // All reusable components
    "./libs/**/*.{js,ts,jsx,tsx}",        // Any custom libs with React code
    "../shared/components/**/*.{js,ts,jsx,tsx}" // Shared components
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#000000 ",
          brown: "#4A1D1F",
          white: "#FFFFFF",
        },
        primary: "#000000 ", // Vibrant Orange
        "primary-hover": "#D94E00",
        secondary: "#4A1D1F", // Dark Brown/Maroon
        "secondary-dark": "#3D1111",
        "background-light": "#FFF9F4", // Creamy off-white
        "background-dark": "#1A0F0F", // Deep dark brown/black
        "surface-light": "#FFFFFF",
        "surface-dark": "#2D1F1F",
        "card-light": "#FFFFFF",
        "card-dark": "#3D1A1A",
        "text-light": "#333333",
        "text-dark": "#F5E6E6",
        "text-main-light": "#333333",
        "text-main-dark": "#E5E5E5",
        "text-sub-light": "#666666",
        "text-sub-dark": "#B3A5A5",
        "border-light": "#E0E0E0",
        "border-dark": "#4A3B3B",
        "accent-orange": "#FFF3E0",
        "accent-gold": "#FFB84C",
        "orange-light": "#fff8ec",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
