/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // Include shared UI components
    ],
    theme: {
        extend: {
            colors: {
                // Primary Theme Colors
                'theme-orange': '#fd6410',
                'theme-orange-light': '#ff8844',
                'theme-orange-dark': '#e55a0e',
                'theme-brown': '#4a2c2a',
                'theme-brown-dark': '#3d1f1e',
                'theme-brown-light': '#5c3634',
                
                // Legacy support
                primary: "#fd6410",
                secondary: "#4a2c2a",
            },
            fontFamily: {
                pl: ["var(--font-poppins)"], // Poppins
                outfit: ["var(--font-outfit)"], // Outfit
            },
            backgroundImage: {
                'gradient-orange': 'linear-gradient(135deg, #fd6410 0%, #ff8844 100%)',
                'gradient-brown': 'linear-gradient(135deg, #3d1f1e 0%, #4a2c2a 100%)',
            },
        },
        keyframes: {
            "slide-in-right": {
                "0%": { transform: "translateX(100%)" },
                "100%": { transform: "translateX(0)" },
            },
            "bounce-in": {
                "0%": { transform: "scale(0.8)", opacity: 0 },
                "50%": { transform: "scale(1.05)" },
                "100%": { transform: "scale(1)", opacity: 1 },
            },
            "float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-20px)" },
            },
            "pulse-soft": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.8 },
            },
        },
        animation: {
            "slide-in-right": "slide-in-right 0.3s ease-out",
            "bounce-in": "bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            "float": "float 3s ease-in-out infinite",
            "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        },
    },
    plugins: [],
}
