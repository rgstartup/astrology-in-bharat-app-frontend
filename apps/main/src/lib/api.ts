import { createSafeFetchInstance } from '@repo/safe-fetch';
import { useAuthStore } from "@repo/store";
import { toast } from 'react-toastify';

/**
 * 🚀 Simplified API Client (Sushant Sir's Standard)
 * - Base URL: http://localhost:6543/api/v1 (Hardcoded for simplicity)
 * - Headers: JSON by default
 * - Credentials: included by default in safeFetch
 */
const getBaseUrl = () => {
  // 1. Server-side: MUST use absolute URL (otherwise fetch fails)
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1';
  }
  
  // 2. Client-side: ALWAYS use relative path to utilize Next.js rewrites/proxy.
  // This bypasses CSP blocks because the request is sent to the "same origin".
  return '/api/v1';
};


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
            // The recursion is prevented by the !url.includes('/auth/refresh') check in the wrappers
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
    baseUrl: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeoutMs: 10_000,
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
            state.logout("/sign-in?expired=1");
            toast.error("Session expired. Please login again.");
        }
        return [res, err];
    },
    post: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.post<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.post<T>(url, body, init);

            const state = useAuthStore.getState();
            state.logout("/sign-in?expired=1");
            toast.error("Session expired. Please login again.");
        }
        return [res, err];
    },
    put: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.put<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.put<T>(url, body, init);

            const state = useAuthStore.getState();
            state.logout("/sign-in?expired=1");
            toast.error("Session expired. Please login again.");
        }
        return [res, err];
    },
    patch: async <T>(url: string, body?: any, init?: any) => {
        let [res, err] = await baseApi.patch<T>(url, body, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.patch<T>(url, body, init);

            const state = useAuthStore.getState();
            state.logout("/sign-in?expired=1");
            toast.error("Session expired. Please login again.");
        }
        return [res, err];
    },
    delete: async <T>(url: string, init?: any) => {
        let [res, err] = await baseApi.delete<T>(url, init);
        if (err?.status === 401 && typeof window !== 'undefined' && !url.includes('/auth/refresh')) {
            const success = await handleRefresh();
            if (success) return await baseApi.delete<T>(url, init);

            const state = useAuthStore.getState();
            state.logout("/sign-in?expired=1");
            toast.error("Session expired. Please login again.");
        }
        return [res, err];
    }
};

export default api;

