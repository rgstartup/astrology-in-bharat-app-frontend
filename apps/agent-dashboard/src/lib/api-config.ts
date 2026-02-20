/**
 * 📂 Centralized API Config (Agent Dashboard)
 * All API endpoints with their URL and HTTP method defined here.
 * NO magic strings anywhere.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
// Strip trailing /api/v1 if present for safeFetch full-URL usage, if needed
export const CLEAN_BASE = BASE.replace(/\/api\/v1\/?$/, "");

export const API_CONFIG = {
    AUTH: {
        LOGIN: { url: `${CLEAN_BASE}/api/v1/agent/login`, method: "POST" },
        LOGOUT: { url: `/agent/logout`, method: "POST" },
        REFRESH: { url: `${CLEAN_BASE}/api/v1/agent/refresh`, method: "POST" },
        ME: { url: `/agent/profile`, method: "GET" },
    },
    AGENT: {
        PROFILE: { url: `/agent/profile`, method: "GET" },
        LISTINGS: { url: `/agent/listings`, method: "GET" },
        STATS: { url: `/agent/dashboard/stats`, method: "GET" },
    },
} as const;

// Backward-compat alias for existing client interceptors (which use relative paths mostly)
export const API_ROUTES = {
    AUTH: {
        LOGIN: API_CONFIG.AUTH.LOGIN.url,
        LOGOUT: API_CONFIG.AUTH.LOGOUT.url,
        REFRESH: "/agent/refresh",             // local/relative for interceptor check
        ME: API_CONFIG.AUTH.ME.url,
    },
    AGENTS: {
        PROFILE: API_CONFIG.AGENT.PROFILE.url,
        LISTINGS: API_CONFIG.AGENT.LISTINGS.url,
        DASHBOARD_STATS: API_CONFIG.AGENT.STATS.url,
    },
} as const;
