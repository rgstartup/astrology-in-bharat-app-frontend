/**
 * Main App API Client — built on safeFetch.
 * - Client-side: Uses full URL directly to backend for better cookie handling (CORS).
 * - Server-side: Uses full URL via NEXT_PUBLIC_API_URL.
 */

import safeFetch from "@packages/safe-fetch/safeFetch";
import { getBasePath } from "../utils/api-config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

const isServer = typeof window === "undefined";

/**
 * Builds the full backend URL.
 * Always returns absolute URL to ensure browser sends cookies to the backend domain.
 */
function buildUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Normalize path
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // Ensure path has /api/v1 prefix
    const apiPath = normalizedPath.startsWith("/api/v1")
        ? normalizedPath
        : `/api/v1${normalizedPath}`;

    const base = getBasePath(); // From NEXT_PUBLIC_API_URL
    return `${base}${apiPath}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body = null, headers = {}, timeoutMs } = options;

    const url = buildUrl(path);

    const fetchOptions: RequestInit = {
        method,
        credentials: "include", // Essential for sending cookies
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
