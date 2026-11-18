export const colors = {
  saffron: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#ff6b00", // Brand Saffron
    600: "#ea580c",
    700: "#c2410c", // Brand Saffron Strong
    800: "#9a3412", // Primary Hover
    900: "#7c2d12",
    950: "#431407",
  },
  brown: {
    50: "#fdf8f6",
    100: "#f2e8e5",
    200: "#eaddd7",
    300: "#e0cec7",
    400: "#c0adb3",
    500: "#75666a", // Brand Brown Muted
    600: "#54353d",
    700: "#4a1d1f", // Classic Maroon
    800: "#381416",
    900: "#301118", // Brand Brown
    950: "#1a0e05", // Secondary Dark
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857", // Brand Emerald
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },
  gold: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#f2e2b0",
    400: "#facc15",
    500: "#d4af37", // Accent Gold
    600: "#ca8a04",
    700: "#b8860b", // Gold Dark
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },
  neutral: {
    white: "#ffffff",
    cream: "#fff9f4",
    creamLight: "#fcf8f4",
    creamMuted: "#e8d5c0",
    black: "#000000",
    blackSoft: "#1a1a1a",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
  },
  status: {
    destructive: "#b91c1c",
    destructiveDark: "#ef4444",
    success: "#047857",
    warning: "#d97706",
    info: "#0284c7",
  },
} as const;

export type ColorPalette = typeof colors;
