/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // All pages in app folder
    "./components/**/*.{js,ts,jsx,tsx}",  // All reusable components
    "./libs/**/*.{js,ts,jsx,tsx}"         // Any custom libs with React code
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
