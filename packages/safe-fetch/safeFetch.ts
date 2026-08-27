import parseBody from "./body-parser";
import anySignal from "./any-signal";
import { ApiError } from "./error";

export interface SafeFetchInit extends Omit<RequestInit, "body"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  timeoutMs?: number;
  controller?: AbortController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}

export interface SafeFetchInstanceConfig {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  // Interceptors
  onRequest?: (url: string, init: RequestInit) => void | Promise<void>;
  onResponse?: <T>(data: T, res: Response) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
}

// Result type: either data of type T or an ApiError
type Result<T> = [T | null, ApiError | null];

export interface SafeFetchInstance {
  <T>(url: string, init?: SafeFetchInit): Promise<Result<T>>;
  get: <T>(url: string, init?: SafeFetchInit) => Promise<Result<T>>;
  post: <T>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T>>;
  put: <T>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T>>;
  patch: <T>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T>>;
  delete: <T>(url: string, init?: SafeFetchInit) => Promise<Result<T>>;
  upload: <T>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => Promise<Result<T>>;
  /** Extend the instance with additional config (returns a new instance) */
  extend: (config: SafeFetchInstanceConfig) => SafeFetchInstance;
}

function mergeHeaders(...sources: (HeadersInit | undefined)[]): Headers {
  const merged = new Headers();
  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      merged.set(key, value);
    });
  }
  return merged;
}

function resolveUrl(base: string | undefined, path: string): string {
  if (!base) return path;
  // Absolute URL — skip base
  if (/^https?:\/\//i.test(path)) return path;
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

/**
 * @desc Core fetch executor, shared by both the standalone function and instances.
 */
async function executeFetch<T>(
  url: string,
  init: SafeFetchInit | undefined,
  instanceConfig: SafeFetchInstanceConfig,
  callSiteStack?: string,
): Promise<Result<T>> {
  const callSite = callSiteStack || new Error().stack;
  const {
    timeoutMs = instanceConfig.timeoutMs ?? 15000,
    controller: userController,
    headers: initHeaders,
    params,
    ...rest
  } = init || {};

  let resolvedUrl = resolveUrl(instanceConfig.baseUrl, url);

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      resolvedUrl += (resolvedUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  const mergedHeaders = mergeHeaders(instanceConfig.headers, initHeaders);

  if (rest.body instanceof FormData) {
    mergedHeaders.delete("Content-Type");
  }

  const timeoutController = new AbortController();
  const signal = userController
    ? anySignal([userController.signal, timeoutController.signal])
    : timeoutController.signal;

  const id = setTimeout(() => timeoutController.abort(), timeoutMs);

  const fetchInit: RequestInit = {
    credentials: instanceConfig.credentials ?? "include",
    signal,
    headers: mergedHeaders,
    ...rest,
  };

  try {
    if (instanceConfig.onRequest) {
      await instanceConfig.onRequest(resolvedUrl, fetchInit);
    }

    const res = await fetch(resolvedUrl, fetchInit);
    const data = await parseBody(res);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? Array.isArray(data.message)
            ? data.message[0]
            : data.message
          : res.statusText;
      const error = new ApiError(res.status, message, data, res.headers, {
        callSiteStack: callSite,
      });
      if (instanceConfig.onError) await instanceConfig.onError(error);
      return [null, error];
    }

    if (instanceConfig.onResponse) {
      await instanceConfig.onResponse(data, res);
    }

    return [data as T, null];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const isAbort = err?.name === "AbortError" || err?.name === "TimeoutError";
    const message = isAbort
      ? "Request aborted or timeout"
      : err?.message || "Network error";

    const error = new ApiError(0, message, undefined, undefined, {
      cause: err,
      callSiteStack: callSite,
    });

    if (instanceConfig.onError) await instanceConfig.onError(error);
    return [null, error];
  } finally {
    clearTimeout(id);
  }
}

function withBody(method: string, body?: unknown): Partial<SafeFetchInit> {
  if (body === undefined) return { method };
  // Handle FormData separately
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return {
      method,
      body,
    };
  }

  return {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
}

function getCallSite(callerFn?: Function): string | undefined {
  const err: { stack?: string } = {};
  const v8 = Error as unknown as {
    captureStackTrace?: (target: object, fn?: Function) => void;
  };
  if (typeof v8.captureStackTrace === "function" && callerFn) {
    v8.captureStackTrace(err, callerFn);
    return err.stack;
  }
  return new Error().stack;
}

/**
 * @desc Creates a reusable safeFetch instance with shared base URL, headers, and config —
 * similar to `axios.create()`.
 *
 * @example
 * const api = createSafeFetchInstance({
 *   baseUrl: 'https://api.example.com',
 *   headers: { Authorization: `Bearer ${token}` },
 *   timeoutMs: 10_000,
 * });
 *
 * const [user, err] = await api.get<User>('/users/1');
 */
export function createSafeFetchInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchInstance {
  const instance = <T>(url: string, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance);
    return executeFetch<T>(url, init, config, callSite);
  };

  instance.get = <T>(url: string, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.get);
    return executeFetch<T>(url, { method: "GET", ...init }, config, callSite);
  };

  instance.post = <T>(url: string, body?: unknown, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.post);
    return executeFetch<T>(url, { ...withBody("POST", body), ...init }, config, callSite);
  };

  instance.put = <T>(url: string, body?: unknown, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.put);
    return executeFetch<T>(url, { ...withBody("PUT", body), ...init }, config, callSite);
  };

  instance.patch = <T>(url: string, body?: unknown, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.patch);
    return executeFetch<T>(url, { ...withBody("PATCH", body), ...init }, config, callSite);
  };

  instance.delete = <T>(url: string, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.delete);
    return executeFetch<T>(url, { method: "DELETE", ...init }, config, callSite);
  };

  instance.upload = <T>(url: string, body: FormData, init?: SafeFetchInit) => {
    const callSite = getCallSite(instance.upload);
    return executeFetch<T>(url, { ...withBody("POST", body), ...init }, config, callSite);
  };

  /** Inherit config and override with new values — headers are merged, not replaced */
  instance.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchInstance({
      ...config,
      ...overrides,
      headers: mergeHeaders(config.headers, overrides.headers),
    });

  return instance as SafeFetchInstance;
}

/**
 * @desc A safe wrapper around fetch that returns a tuple of [data, error] instead of throwing.
 * It also includes a timeout mechanism and supports aborting via an optional user-provided AbortController.
 *
 * @example
 * const [data, error] = await safeFetch<SomeType>('/api/data');
 * if (error) {
 *   console.error('API Error:', error);
 * } else {
 *   console.log('Data:', data);
 * }
 */
export default async function safeFetch<T>(
  url: string,
  init?: SafeFetchInit,
): Promise<Result<T>> {
  const callSite = getCallSite(safeFetch);
  return executeFetch<T>(url, init, {}, callSite);
}

