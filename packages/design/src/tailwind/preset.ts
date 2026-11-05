/**
 * Tailwind CSS Design System Preset for @repo/design
 * Maps Tailwind utilities to canonical design tokens and CSS variables
 */

export interface TailwindConfigPreset {
  theme?: {
    extend?: {
      colors?: Record<string, unknown>;
      fontFamily?: Record<string, unknown>;
      borderRadius?: Record<string, unknown>;
      boxShadow?: Record<string, unknown>;
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
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          gold: "var(--accent-gold)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
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
        none: "0",
        sm: "calc(var(--radius, 0.625rem) * 0.6)",
        DEFAULT: "var(--radius, 0.625rem)",
        md: "calc(var(--radius, 0.625rem) * 0.8)",
        lg: "var(--radius, 0.625rem)",
        xl: "calc(var(--radius, 0.625rem) * 1.4)",
        "2xl": "calc(var(--radius, 0.625rem) * 1.8)",
        "3xl": "calc(var(--radius, 0.625rem) * 2.2)",
        full: "9999px",
      },
      boxShadow: {
        premium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "premium-hover": "0 10px 30px rgba(0, 0, 0, 0.12)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.2)",
        saffron: "0 4px 15px rgba(255, 107, 0, 0.2)",
        "saffron-hover": "0 8px 25px rgba(255, 107, 0, 0.3)",
      },
    },
  },
};

export default designPreset;
