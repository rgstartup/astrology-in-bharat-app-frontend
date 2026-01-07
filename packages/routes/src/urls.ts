import { PATHS } from "./paths";

const getBaseUrl = (key: string, defaultUrl: string) => {
  if (typeof window === "undefined") {
    return process.env[key] || defaultUrl;
  }
  return (window as any).env?.[key] || process.env[key] || defaultUrl;
};

export const BASE_URLS = {
  MAIN: getBaseUrl("NEXT_PUBLIC_MAIN_URL", "http://localhost:3000"),
  ECOMMERCE: getBaseUrl("NEXT_PUBLIC_ECOMMERCE_URL", "http://localhost:3001"),
  ADMIN: getBaseUrl("NEXT_PUBLIC_ADMIN_URL", "http://localhost:3002"),
  ASTROLOGER: getBaseUrl("NEXT_PUBLIC_ASTROLOGER_URL", "http://localhost:3003"),
} as const;

export const URLS = {
  MAIN: {
    HOME: `${BASE_URLS.MAIN}${PATHS.HOME}`,
    HOROSCOPE: `${BASE_URLS.MAIN}${PATHS.HOROSCOPE}`,
    // Add other main routes as needed
  },
  ECOMMERCE: {
    HOME: `${BASE_URLS.ECOMMERCE}${PATHS.HOME}`,
    BUY_PRODUCTS: `${BASE_URLS.ECOMMERCE}${PATHS.BUY_PRODUCTS}`,
    CART: `${BASE_URLS.ECOMMERCE}${PATHS.CART}`,
  },
} as const;
