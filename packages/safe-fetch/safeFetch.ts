import parseBody from "./body-parser";
import anySignal from "./any-signal";
import { ApiError, type ApiErrorBody, type FieldErrors } from "./error";

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
  onError?: <TBody extends ApiErrorBody>(error: ApiError<TBody>) => void | Promise<void>;
}

// Result type: discriminated union with ok, data, error (generic over error body)
export type Result<T, TErrorBody extends ApiErrorBody = ApiErrorBody> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: ApiError<TErrorBody>; data?: never };

// Legacy Result type: [data, error] tuple (generic over error body, defaults preserve compat)
/** @deprecated Use `Result<T, TErrorBody>` discriminated union with `createSafeFetchResultInstance`. */
export type LegacyResult<T, TErrorBody extends ApiErrorBody = ApiErrorBody> = [
  T | null,
  ApiError<TErrorBody> | null,
];

/** @deprecated Use `SafeFetchResultInstance` via `createSafeFetchResultInstance`. */
export interface SafeFetchInstance {
  <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<LegacyResult<T, TErrorBody>>;
  get: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  post: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  put: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  patch: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  delete: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  upload: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => Promise<LegacyResult<T, TErrorBody>>;
  /** Extend the instance with additional config (returns a new instance) */
  extend: (config: SafeFetchInstanceConfig) => SafeFetchInstance;
}

export interface SafeFetchResultInstance {
  <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<Result<T, TErrorBody>>;
  get: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  post: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  put: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  patch: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  delete: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  upload: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => Promise<Result<T, TErrorBody>>;
  /** Extend the instance with additional config (returns a new instance) */
  extend: (config: SafeFetchInstanceConfig) => SafeFetchResultInstance;
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
 * @desc Core fetch executor, shared by both standalone functions and instances.
 */
async function executeFetch<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
  url: string,
  init: SafeFetchInit | undefined,
  instanceConfig: SafeFetchInstanceConfig,
  callSiteStack?: string,
): Promise<LegacyResult<T, TErrorBody>> {
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
      let message = res.statusText;
      let errorCode: string | undefined;
      let fieldErrors: FieldErrors | undefined;

      if (data && typeof data === "object") {
        if ("message" in data) {
          message = Array.isArray(data.message) ? data.message[0] : String(data.message);
        }
        if ("errorCode" in data && typeof data.errorCode === "string") {
          errorCode = data.errorCode;
        }
        if (
          "fieldErrors" in data &&
          typeof data.fieldErrors === "object" &&
          data.fieldErrors !== null
        ) {
          fieldErrors = data.fieldErrors as FieldErrors;
        }
      }

      const error = new ApiError<TErrorBody>(
        res.status,
        message,
        data as TErrorBody,
        res.headers,
        {
          callSiteStack: callSite,
          errorCode,
          fieldErrors,
        },
      );

      if (instanceConfig.onError)
        await (instanceConfig.onError as (error: ApiError<TErrorBody>) => void | Promise<void>)(
          error,
        );
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

    const error = new ApiError<TErrorBody>(0, message, undefined, undefined, {
      cause: err,
      callSiteStack: callSite,
    });

    if (instanceConfig.onError)
      await (instanceConfig.onError as (error: ApiError<TErrorBody>) => void | Promise<void>)(
        error,
      );
    return [null, error];
  } finally {
    clearTimeout(id);
  }
}

async function toResult<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
  promise: Promise<LegacyResult<T, TErrorBody>>,
): Promise<Result<T, TErrorBody>> {
  const [data, error] = await promise;
  if (error) {
    return { ok: false, error };
  }
  return { ok: true, data: data as T };
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
 * returning legacy [data, error] tuples.
 * @deprecated Use `createSafeFetchResultInstance` returning `Result<T>` discriminated union.
 */
export function createSafeFetchInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchInstance {
  const instance = (<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance);
    return executeFetch<T, TErrorBody>(url, init, config, callSite);
  }) as SafeFetchInstance;

  instance.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.get);
    return executeFetch<T, TErrorBody>(url, { method: "GET", ...init }, config, callSite);
  };

  instance.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.post);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("POST", body), ...init },
      config,
      callSite,
    );
  };

  instance.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.put);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("PUT", body), ...init },
      config,
      callSite,
    );
  };

  instance.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.patch);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("PATCH", body), ...init },
      config,
      callSite,
    );
  };

  instance.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.delete);
    return executeFetch<T, TErrorBody>(url, { method: "DELETE", ...init }, config, callSite);
  };

  instance.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.upload);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("POST", body), ...init },
      config,
      callSite,
    );
  };

  /** Inherit config and override with new values — headers are merged, not replaced */
  instance.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchInstance({
      ...config,
      ...overrides,
      headers: mergeHeaders(config.headers, overrides.headers),
    });

  return instance;
}

/**
 * @desc Creates a reusable safeFetchResult instance returning Result<T> discriminated union ({ ok: true, data } | { ok: false, error }).
 */
export function createSafeFetchResultInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchResultInstance {
  const legacyInstance = createSafeFetchInstance(config);

  const instance = (<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance<T, TErrorBody>(url, init))) as SafeFetchResultInstance;

  instance.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.get<T, TErrorBody>(url, init));

  instance.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.post<T, TErrorBody>(url, body, init));

  instance.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.put<T, TErrorBody>(url, body, init));

  instance.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.patch<T, TErrorBody>(url, body, init));

  instance.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.delete<T, TErrorBody>(url, init));

  instance.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.upload<T, TErrorBody>(url, body, init));

  instance.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchResultInstance({
      ...config,
      ...overrides,
      headers: mergeHeaders(config.headers, overrides.headers),
    });

  return instance;
}

/**
 * @desc A safe wrapper around fetch that returns a tuple of [data, error] instead of throwing.
 * Maintained for backward compatibility.
 * @deprecated Use `safeFetchResult` returning `Result<T>` discriminated union.
 */
export default async function safeFetch<T>(
  url: string,
  init?: SafeFetchInit,
): Promise<LegacyResult<T>> {
  const callSite = getCallSite(safeFetch);
  return executeFetch<T>(url, init, {}, callSite);
}

/**
 * @desc A safe wrapper around fetch returning Result<T> discriminated union ({ ok: true, data } | { ok: false, error }).
 */
export const safeFetchResult = createSafeFetchResultInstance();


