/**
 * Global theme constants for consistency across the app.
 * Can be shared with Tailwind and standard JS/TS files.
 */
export const THEME = {
  colors: {
    primary: "#FF6B00",
    secondary: "#4A1D1F",
    accent: "#D4AF37",
    background: "#FFF9F4",
    white: "#FFFFFF",
    text: {
      primary: "#1A1A1A",
      secondary: "#666666",
      muted: "#9CA3AF"
    }
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    premium: "0 20px 25px -5px rgba(255, 107, 0, 0.1), 0 10px 10px -5px rgba(255, 107, 0, 0.04)"
  },

  transitions: {
    main: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.15s ease-in-out",
    slow: "all 0.5s ease"
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  }
} as const;
