/**
 * Main App API Client — built on safeFetch.
 * - Client-side: uses relative paths (/api/v1/...) which are rewritten by
 *   Next.js to the backend via next.config.js rewrites (proxy).
 * - Server-side: uses NEXT_PUBLIC_API_URL for absolute requests.
 *
 * Token refresh and 401 handling are managed by proxy.ts middleware, so
 */

import safeFetch, { ApiError } from "@packages/safe-fetch/safeFetch";
import { API_ROUTES } from "./api-config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

const isServer = typeof window === "undefined";

function buildUrl(path: string): string {
    if (isServer) {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543")
            .replace(/\/+$/, "")
            .replace(/\/api\/v1\/?$/i, "");
        return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    }
    // Client: use relative path — Next.js rewrite handles proxying
    return path;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body = null, headers = {}, timeoutMs } = options;

    const url = buildUrl(path);

    const fetchOptions: RequestInit = {
        method,
        credentials: "include",
        headers: {
            ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        ...(body
            ? { body: body instanceof FormData ? body : JSON.stringify(body) }
            : {}),
    };

    const [data, error] = await safeFetch<T>(url, {
        ...fetchOptions,
        ...(timeoutMs ? { timeoutMs } : {}),
    } as any);

    if (error) {
        throw error;
    }

    return data as T;
}

// Convenience methods
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
