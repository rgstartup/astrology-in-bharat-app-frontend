/**
 * Tailwind CSS Design System Preset for @repo/design
 * Extends the pure Shadcn preset with canonical brand tokens and project utilities.
 */

import { shadcnPreset } from "../shadcn/tailwind.config";

export interface TailwindConfigPreset {
  theme?: {
    extend?: {
      colors?: Record<string, unknown>;
      fontFamily?: Record<string, unknown>;
      borderRadius?: Record<string, unknown>;
      boxShadow?: Record<string, unknown>;
      keyframes?: Record<string, unknown>;
      animation?: Record<string, unknown>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const designPreset: TailwindConfigPreset = {
  theme: {
    extend: {
      colors: {
        ...(shadcnPreset.theme.extend.colors as Record<string, unknown>),
        // Brand palette mapped to CSS custom properties
        orange: "var(--brand-saffron)",
        saffron: {
          DEFAULT: "var(--brand-saffron)",
          strong: "var(--brand-saffron-strong)",
        },
        "brand-emerald": "var(--brand-emerald)",
        brown: {
          DEFAULT: "var(--brand-brown)",
          muted: "var(--brand-brown-muted)",
        },
        white: "#FFFFFF",
        accent: {
          ...(shadcnPreset.theme.extend.colors.accent as Record<string, unknown>),
          gold: "var(--accent-gold)",
        },
        danger: {
          DEFAULT: "#dc3545",
          dark: "#c82333",
        },
        "bg-light": "var(--bg-light)",
      },
      fontFamily: {
        sans: ["var(--font-sans, Inter)", "sans-serif"],
        display: ["var(--font-display, Outfit)", "sans-serif"],
        body: ["var(--font-sans, Inter)", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Inter", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      borderRadius: {
        ...(shadcnPreset.theme.extend.borderRadius as Record<string, unknown>),
      },
      boxShadow: {
        premium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "premium-hover": "0 10px 30px rgba(0, 0, 0, 0.12)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.2)",
        saffron: "0 4px 15px rgba(255, 107, 0, 0.2)",
        "saffron-hover": "0 8px 25px rgba(255, 107, 0, 0.3)",
      },
      keyframes: {
        ...(shadcnPreset.theme.extend.keyframes as Record<string, unknown>),
      },
      animation: {
        ...(shadcnPreset.theme.extend.animation as Record<string, unknown>),
      },
    },
  },
};

export { shadcnPreset };
export default designPreset;
