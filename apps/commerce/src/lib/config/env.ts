/**
 * Type-safe environment variable configuration.
 * Avoids direct process.env calls across the app.
 */
export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PROD: process.env.NODE_ENV === "production",
  IS_DEV: process.env.NODE_ENV === "development",
};
