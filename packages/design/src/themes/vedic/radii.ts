export const radii = {
  none: "0px",
  sm: "calc(var(--radius, 0.625rem) * 0.6)",
  md: "calc(var(--radius, 0.625rem) * 0.8)",
  lg: "var(--radius, 0.625rem)",
  xl: "calc(var(--radius, 0.625rem) * 1.4)",
  "2xl": "calc(var(--radius, 0.625rem) * 1.8)",
  "3xl": "calc(var(--radius, 0.625rem) * 2.2)",
  "4xl": "calc(var(--radius, 0.625rem) * 2.6)",
  full: "9999px",
} as const;

export type RadiiTokens = typeof radii;
