/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                display: ["Outfit", "sans-serif"],
                body: ["Inter", "sans-serif"],
                outfit: ["Outfit", "sans-serif"],
                poppins: ["Inter", "sans-serif"],
            },
            colors: {
                // ── Same as admin-dashboard ──────────────────────────
                primary: "#000000",
                orange: "#b45309",
                "orange-700": "#b45309",
                "orange-600": "#d97706",
                "purple-800": "#5b21b6",
                secondary: "#4a1d1f",
                "secondary-dark": "#301118",
                "border-light": "#e5e7eb",
                "text-light": "#6b7280",
                "primary-hover": "#D94E00",
                brand: {
                    orange: "#F25E0A",
                    brown: "#4A1D1F",
                    white: "#FFFFFF",
                },
                yellow: {
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                },
            },
        },
    },
    plugins: [],
};
