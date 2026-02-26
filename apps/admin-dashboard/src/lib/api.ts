/**
 * Admin Dashboard API Client — built on safeFetch.
 *
 * Architecture:
 * - All requests go through relative `/api/v1/...` paths which are proxied by
    * Next.js rewrites to the real backend.
 * - httpOnly cookies are sent automatically via credentials: "include".
 * - 401 handling: show toast + redirect to admin login(if not already there).
 * - Token refresh: handled in proxy.ts middleware(not here).
 */

import { toast } from "react-toastify";
import safeFetch from "@packages/safe-fetch/safeFetch";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type QueryParams = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    timeoutMs?: number;
    params?: QueryParams;
}

const ADMIN_LOGIN_PATHS = ["/", "/admin", "/admin/login"];

function isOnLoginPage(): boolean {
    if (typeof window === "undefined") return false;
    return ADMIN_LOGIN_PATHS.includes(window.location.pathname);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body = null, headers = {}, timeoutMs = 30000, params } = options;

    const normalizePath = (inputPath: string) => {
        if (inputPath.startsWith("http://") || inputPath.startsWith("https://")) return inputPath;
        const normalized = inputPath.startsWith("/") ? inputPath : `/${inputPath}`;
        return normalized.startsWith("/api/v1") ? normalized : `/api/v1${normalized}`;
    };

    const appendParams = (url: string, query?: QueryParams) => {
        if (!query) return url;
        const entries = Object.entries(query).filter(([, value]) => value !== undefined && value !== null);
        if (entries.length === 0) return url;
        const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
        return `${url}${url.includes("?") ? "&" : "?"}${search}`;
    };

    const url = appendParams(normalizePath(path), params);

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
        const status = (error as any)?.status;
        if (status === 401) {
            const backendMessage = (error as any)?.body?.message || (error as any)?.data?.message;
            if (backendMessage && typeof backendMessage === "string") {
                toast.error(backendMessage, { toastId: "admin-auth-error" });
            }
            if (typeof window !== "undefined" && !isOnLoginPage()) {
                window.location.href = "/";
            }
        }
        throw error;
    }

    return { data: data as T, status: 200 } as any;
}

export const api = {
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

export default api;
