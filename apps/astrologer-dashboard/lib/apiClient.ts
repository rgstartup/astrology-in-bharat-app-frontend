 * Astrologer Dashboard API Client — built on safeFetch.
 *
 * Architecture:
 * - Client - side: uses relative paths(/api/v1 /...) which are rewritten by
    * Next.js via next.config.js rewrites to the real backend.
 * - Server - side: uses NEXT_PUBLIC_API_URL for absolute requests.
 *
 * Auth(httpOnly cookies) are sent automatically via credentials: "include".
 * 401 handling and token refresh is done in proxy.ts middleware — no
    * interceptors are needed here.
 */

import { toast } from "react-toastify";
import safeFetch from "@packages/safe-fetch/safeFetch";
import { CLIENT_API_URL, BACKEND_URL } from "./config";

const isServer = typeof window === "undefined";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

function buildUrl(path: string): string {
    if (isServer) {
        const base = (BACKEND_URL || "").replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");
        return `${base}/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
    }
    return `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body = null, headers = {}, timeoutMs = 10000 } = options;

    const url = buildUrl(path);

    const [data, error] = await safeFetch<T>(url, {
        method,
        credentials: "include",
        headers: {
            ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
        timeoutMs,
    } as any);

    if (error) {
        if ((error as any)?.status === 401) {
            const backendMessage = (error as any)?.data?.message;
            if (backendMessage && typeof backendMessage === "string") {
                toast.error(backendMessage, { toastId: "auth-error" });
            }
        }
        throw error;
    }

    return data as T;
}

export const apiClient = {
    get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
        request<T>(path, { ...opts, method: "GET" }),

    post: <T>(path: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, "method">) =>
        request<T>(path, { ...opts, method: "POST", body }),

    put: <T>(path: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, "method">) =>
        request<T>(path, { ...opts, method: "PUT", body }),

    patch: <T>(path: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, "method">) =>
        request<T>(path, { ...opts, method: "PATCH", body }),

    delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
        request<T>(path, { ...opts, method: "DELETE" }),

    upload: <T>(path: string, formData: FormData, opts?: Omit<RequestOptions, "method" | "body">) =>
        request<T>(path, { ...opts, method: "POST", body: formData }),
};

export default apiClient;
