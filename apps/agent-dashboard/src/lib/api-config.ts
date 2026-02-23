/**
 * 📂 Centralized API Config (Agent Dashboard)
 * All API endpoints with their URL and HTTP method defined here.
 * NO magic strings anywhere.
 */

import { getApiUrl, getBasePath } from "../utils/api-config";

const BASE = getApiUrl();
// Strip trailing /api/v1 if present for safeFetch full-URL usage, if needed
export const CLEAN_BASE = getBasePath();

export const API_CONFIG = {
    AUTH: {
        LOGIN: { url: `${CLEAN_BASE}/api/v1/auth/login`, method: "POST" },
        LOGOUT: { url: `/auth/logout`, method: "POST" },
        REFRESH: { url: `${CLEAN_BASE}/api/v1/auth/refresh`, method: "POST" },
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
        REFRESH: "/auth/refresh",              // local/relative for interceptor check
        ME: API_CONFIG.AUTH.ME.url,
    },
    AGENTS: {
        PROFILE: API_CONFIG.AGENT.PROFILE.url,
        LISTINGS: API_CONFIG.AGENT.LISTINGS.url,
        DASHBOARD_STATS: API_CONFIG.AGENT.STATS.url,
    },
} as const;
