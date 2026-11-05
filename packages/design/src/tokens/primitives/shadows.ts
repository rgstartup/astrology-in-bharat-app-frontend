export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  premium: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "premium-hover": "0 10px 30px rgba(0, 0, 0, 0.12)",
  gold: "0 4px 15px rgba(212, 175, 55, 0.2)",
  saffron: "0 4px 15px rgba(255, 107, 0, 0.2)",
  "saffron-hover": "0 8px 25px rgba(255, 107, 0, 0.3)",
} as const;

export type ShadowTokens = typeof shadows;
