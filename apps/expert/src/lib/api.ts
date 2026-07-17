import { createSafeFetchInstance, ApiError } from '@repo/safe-fetch';

export { ApiError };

/**
 * 🚀 Standardized API Client (Expert Dashboard)
 * - Base URL: http://localhost:6543/api/v1 (Hardcoded for simplicity)
 * - Headers: JSON by default
 * - Credentials: included by default in safeFetch
 */
const IS_SERVER = typeof window === 'undefined';
const API_BASE = IS_SERVER 
  ? (process.env.NEXT_PUBLIC_API_URL || 'https://astrology-in-bharat-services.onrender.com/api/v1') 
  : '/api/v1';

import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

// --- Refresh Token Logic ---
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function handleRefresh(): Promise<boolean> {
    if (isRefreshing) return refreshPromise!;
    isRefreshing = true;
    refreshPromise = (async () => {
        try {
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
  baseUrl: API_BASE,
  headers: {
    // Content-Type: 'application/json' removed to allow FormData requests
  },
  timeoutMs: 300_000,
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
            
            // If refresh fails, logout and redirect to login
            const state = useAuthStore.getState();
            state.logout();
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
                window.location.href = "/?expired=1";
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
            state.logout();
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
                window.location.href = "/?expired=1";
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
            state.logout();
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
                window.location.href = "/?expired=1";
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
            state.logout();
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
                window.location.href = "/?expired=1";
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
            state.logout();
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
                window.location.href = "/?expired=1";
            }
        }
        return [res, err];
    }
};

export default api;

