/**
 * Astrologer Dashboard API Client built on safeFetch.
 * - Client-side: uses relative /api/v1 paths rewritten by Next.js.
 * - Server-side: uses NEXT_PUBLIC_API_URL absolute base.
 */

import { toast } from "react-toastify";
import safeFetch from "@packages/safe-fetch/safeFetch";
import { BACKEND_URL } from "./config";

const isServer = typeof window === "undefined";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

function isPublicAuthPath(): boolean {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname;
    return path === "/" || path === "/sign-up" || path === "/forgot-password";
}

function buildUrl(path: string): string {
    // If it's already an absolute URL, return it as is
    if (path.startsWith('http')) return path;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (isServer) {
        const base = (BACKEND_URL || "").replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");
        return `${base}/api/v1${cleanPath}`;
    }

    // Base already has /api/v1 or next.js rewrites handle it
    return `/api/v1${cleanPath}`;
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
            const backendMessage = (error as any)?.body?.message || (error as any)?.data?.message;
            if (backendMessage && typeof backendMessage === "string" && !isPublicAuthPath()) {
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
        request<T>(path, { ...opts, method: "POST", body: formData, timeoutMs: 60000 }),
};

export default apiClient;
