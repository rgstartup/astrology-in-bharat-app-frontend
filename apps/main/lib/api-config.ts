/**
 * 📂 Centralized API Config (Sushant Sir's Standard)
 * All API endpoints with their URL and HTTP method defined here.
 * NO magic strings anywhere else in the codebase.
 * Usage: apiClient.request(API_CONFIG.AUTH.LOGIN)
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
// Strip trailing /api/v1 if present, for safeFetch full-URL usage
export const CLEAN_BASE = BASE.replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");

export const API_CONFIG = {
    AUTH: {
        LOGIN: { url: `${CLEAN_BASE}/api/v1/auth/client/login`, method: "POST" },
        REGISTER: { url: `${CLEAN_BASE}/api/v1/auth/email/register`, method: "POST" },
        LOGOUT: { url: "auth/client-logout", method: "POST" },
        REFRESH: { url: `${CLEAN_BASE}/api/v1/auth/refresh`, method: "POST" },
        ME: { url: "client", method: "GET" },
        GOOGLE_LOGIN: { url: `${CLEAN_BASE}/api/v1/auth/google/login`, method: "GET" },
    },
    WALLET: {
        BALANCE: { url: "wallet/balance", method: "GET" },
    },
    PRODUCT_LIKE: {
        LIST: { url: "product-like", method: "GET" },
        ADD: { url: "product-like/add", method: "POST" },
        REMOVE: { url: "product-like/remove", method: "DELETE" },
    },
    EXPERT_LIKE: {
        LIST: { url: "expert-like", method: "GET" },
        ADD: { url: "expert-like/add", method: "POST" },
        REMOVE: { url: "expert-like/remove", method: "DELETE" },
    },
    CART: {
        GET: { url: "cart", method: "GET" },
        ADD: { url: "cart/add", method: "POST" },
        UPDATE: { url: "cart/update", method: "PUT" },
        REMOVE: { url: "cart/remove", method: "DELETE" },
    },
    CLIENT: {
        PROFILE: { url: "client", method: "GET" },
        UPDATE: { url: "client", method: "PATCH" },
        PICTURE: { url: "client/picture", method: "PATCH" },
    },
    EXPERT: {
        TOP_RATED: { url: "expert/top-rated", method: "GET" },
    },
} as const;

// Keep backward-compat alias for existing imports
export const API_ROUTES = {
    AUTH: {
        LOGIN: API_CONFIG.AUTH.LOGIN.url,
        LOGOUT: API_CONFIG.AUTH.LOGOUT.url,
        REFRESH: "auth/refresh",             // relative path for interceptor check
        ME: API_CONFIG.AUTH.ME.url,
    },
    WALLET: {
        BALANCE: API_CONFIG.WALLET.BALANCE.url,
    },
} as const;
