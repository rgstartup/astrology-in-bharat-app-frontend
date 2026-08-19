import { createSafeFetchInstance } from "@repo/safe-fetch";

import { useAgentAuthStore } from "../store/useAgentAuthStore";
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
  baseUrl: typeof window !== 'undefined' ? '/api/v1' : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1"),
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
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
            
            const state = useAgentAuthStore.getState();
            if (state.isAuthenticated) {
                state.logout();
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

            const state = useAgentAuthStore.getState();
            if (state.isAuthenticated) {
                state.logout();
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

            const state = useAgentAuthStore.getState();
            if (state.isAuthenticated) {
                state.logout();
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

            const state = useAgentAuthStore.getState();
            if (state.isAuthenticated) {
                state.logout();
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

            const state = useAgentAuthStore.getState();
            if (state.isAuthenticated) {
                state.logout();
                toast.error("Session expired. Please login again.");
            }
        }
        return [res, err];
    }
};

export default api;

