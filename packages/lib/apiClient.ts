/**
 * packages/lib/apiClient.ts — safeFetch-based API client
 *
 * Architecture:
 * - Client-side: uses relative /api/v1/... proxied by Next.js rewrites.
 * - Server-side: uses NEXT_PUBLIC_API_URL for absolute requests.
 * - httpOnly cookies sent automatically via credentials: "include".
 * - 401 → attempts token refresh via /auth/refresh, then retries once.
 * - Token refresh itself is idempotent; concurrent 401s are queued.
 */

const getRawUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const API_BASE_URL =
    getRawUrl().replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "") + "/api/v1";

const isServer = typeof window === "undefined";

function buildUrl(path: string): string {
    if (isServer) {
        return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
    }
    return `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
}

// ─── Refresh queue ────────────────────────────────────────────────────────────
let isRefreshing = false;
type QueueItem = { resolve: () => void; reject: (err: unknown) => void };
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
    failedQueue = [];
}

async function waitForRefresh(): Promise<void> {
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    });
}

async function doRefresh(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
}

// ─── Core request ─────────────────────────────────────────────────────────────
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: Record<string, unknown> | FormData | null;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    _retry?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<{ data: T; status: number }> {
    const { method = "GET", body = null, headers = {}, params, _retry = false } = options;

    let url = buildUrl(path);
    if (params) {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
        ).toString();
        url = `${url}?${qs}`;
    }

    const fetchInit: RequestInit = {
        method,
        credentials: "include",
        headers: {
            ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, fetchInit);

    // ── 401 handling with refresh + retry ────────────────────────────────────
    if (res.status === 401 && !_retry) {
        if (isRefreshing) {
            // Queue this request until the ongoing refresh resolves
            try {
                await waitForRefresh();
                return request<T>(path, { ...options, _retry: true });
            } catch (err) {
                if (typeof window !== "undefined") window.location.href = "/sign-in";
                throw err;
            }
        }

        isRefreshing = true;
        try {
            await doRefresh();
            processQueue(null);
            return request<T>(path, { ...options, _retry: true });
        } catch (refreshError) {
            processQueue(refreshError);
            if (typeof window !== "undefined") window.location.href = "/sign-in";
            throw refreshError;
        } finally {
            isRefreshing = false;
        }
    }

    const data = await res.json().catch(() => null) as T;
    return { data, status: res.status };
}

// ─── Convenience API ──────────────────────────────────────────────────────────
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
