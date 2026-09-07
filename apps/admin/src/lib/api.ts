import { createSafeFetchInstance, ApiError } from "@repo/safe-fetch";

export { ApiError };

/**
 * 🚀 Simplified Admin API Client (Sushant Sir's Standard)
 * - SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : "http://localhost:6543");
 * - Headers: JSON by default
 * - Credentials: included by default in safeFetch
 */
// For client-side requests, use relative path to trigger Next.js rewrites (same-domain)
// For server-side, use the full API URL
const isServer = typeof window === "undefined";
const BASE_URL = isServer 
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1")
  : "/api/v1";

console.log(`DEBUG: Initializing API (isServer: ${isServer}) with baseUrl: ${BASE_URL}`);

import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

// --- Refresh Token Logic ---
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Handle 401 errors by attempting to refresh the token.
 * Returns true if refresh succeeded, false otherwise.
 */
async function handleRefresh(): Promise<boolean> {
    if (isRefreshing) return refreshPromise!;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            // We use baseApi to ensure credentials (cookies) are sent
            const [res, err] = await baseApi.post('/auth/refresh');
            return !err;
        } catch (error) {
            console.error("[API] Refresh failed:", error);
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

const baseApi = createSafeFetchInstance({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  timeoutMs: 30_000,
});

/**
 * 🚀 Wrapped API Client with Silent Refresh
 */
export const api = {
    ...baseApi,
    get: async <T>(url: string, init?: any) => {
        let [res, err] = await baseApi.get<T>(url, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.get<T>(url, init);
            
            // If refresh fails, logout
            const state = useAuthStore.getState();
            if (state.isClientAuthenticated) {
                state.clientLogout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    },
    post: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.post<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.post<T>(url, body, init);

            const state = useAuthStore.getState();
            if (state.isClientAuthenticated) {
                state.clientLogout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    },
    put: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.put<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.put<T>(url, body, init);

            const state = useAuthStore.getState();
            if (state.isClientAuthenticated) {
                state.clientLogout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    },
    patch: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.patch<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.patch<T>(url, body, init);

            const state = useAuthStore.getState();
            if (state.isClientAuthenticated) {
                state.clientLogout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    },
    delete: async <T>(url: string, init?: any) => {
        let [res, err] = await baseApi.delete<T>(url, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.delete<T>(url, init);

            const state = useAuthStore.getState();
            if (state.isClientAuthenticated) {
                state.clientLogout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    }
};

export default api;

