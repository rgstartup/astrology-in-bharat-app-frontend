/**
 * 📂 api-client.ts (Agent Dashboard)
 * A safeFetch-based HTTP client.
 * Uses the Next.js rewrite proxy (/api/v1/...) so cookies are sent automatically
 * and credentials are never exposed in the browser Network tab.
 */

import safeFetch, { ApiError } from "@packages/safe-fetch/safeFetch";

const BASE = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "")
    : ""; // empty → relative URLs go through Next.js rewrites proxy

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
    method?: Method;
    body?: Record<string, any> | FormData;
    params?: Record<string, any>;
    timeoutMs?: number;
}

function buildUrl(path: string, params?: Record<string, any>): string {
    // path must start with /api/v1/... or will be prefixed
    const url = path.startsWith("/api/v1") ? path : `/api/v1${path}`;
    const fullUrl = typeof window === "undefined"
        ? `${BASE}${url}` // server-side: use absolute URL
        : url;             // client-side: relative URL → Next.js proxy

    if (!params) return fullUrl;

    const query = new URLSearchParams(
        Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
    ).toString();

    return query ? `${fullUrl}?${query}` : fullUrl;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, params, timeoutMs } = options;

    const headers: Record<string, string> = {};
    let fetchBody: BodyInit | undefined;

    if (body instanceof FormData) {
        fetchBody = body;
        // Don't set Content-Type for FormData — browser sets it with boundary
    } else if (body) {
        headers["Content-Type"] = "application/json";
        fetchBody = JSON.stringify(body);
    }

    const url = buildUrl(path, params);

    const [data, error] = await safeFetch<T>(url, {
        method,
        headers,
        body: fetchBody,
        credentials: "include",
        ...(timeoutMs ? { timeoutMs } : {}),
    });

    if (error) {
        throw error;
    }

    return data as T;
}

// ── Convenience helpers ─────────────────────────────────────────
export const apiClient = {
    get: <T>(path: string, params?: Record<string, any>) =>
        request<T>(path, { method: "GET", params }),

    post: <T>(path: string, body?: Record<string, any> | FormData) =>
        request<T>(path, { method: "POST", body }),

    patch: <T>(path: string, body?: Record<string, any> | FormData) =>
        request<T>(path, { method: "PATCH", body }),

    put: <T>(path: string, body?: Record<string, any>) =>
        request<T>(path, { method: "PUT", body }),

    delete: <T>(path: string) =>
        request<T>(path, { method: "DELETE" }),
};

export { ApiError };
export default apiClient;
