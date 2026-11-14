import parseBody from "./body-parser";
import signalHandler from "./signal";
import { ApiError, type ApiErrorBody, type FieldErrors } from "./error";
import type { Result } from "./result";

/**
 * @desc Request options for a single fetch call.
 * Extends RequestInit without `body` (typed separately) plus safe-fetch options.
 */
export interface SafeFetchInit extends Omit<RequestInit, "body"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  timeoutMs?: number;
  controller?: AbortController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}

/**
 * @desc Shared instance configuration: base URL, headers, credentials, interceptors.
 */
export interface SafeFetchInstanceConfig {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  /** Fires before each request (mutate init in place). */
  onRequest?: (url: string, init: RequestInit) => void | Promise<void>;
  /** Fires on successful responses with parsed body. */
  onResponse?: <T>(data: T, res: Response) => void | Promise<void>;
  /** Fires on every error outcome. */
  onError?: <TBody extends ApiErrorBody>(
    error: ApiError<TBody>,
  ) => void | Promise<void>;
}

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

/**
 * @desc Merge multiple HeadersInit sources into one Headers instance.
 * Later sources override earlier ones for the same header name.
 */
export function mergeHeaders(...sources: (HeadersInit | undefined)[]): Headers {
  const merged = new Headers();
  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      merged.set(key, value);
    });
  }
  return merged;
}

/**
 * @desc Resolve a request URL against an optional base URL.
 * Absolute URLs (http://, https://) skip the base entirely.
 */
export function resolveUrl(base: string | undefined, path: string): string {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

/**
 * @desc Core fetch executor shared by instances and standalone functions.
 * Returns a legacy [data, error] tuple.
 */
export async function executeFetch<
  T,
  TErrorBody extends ApiErrorBody = ApiErrorBody,
>(
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
    ? signalHandler([userController.signal, timeoutController.signal])
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
          message = Array.isArray(data.message)
            ? data.message[0]
            : String(data.message);
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
        await (
          instanceConfig.onError as (
            error: ApiError<TErrorBody>,
          ) => void | Promise<void>
        )(error);
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
      await (
        instanceConfig.onError as (
          error: ApiError<TErrorBody>,
        ) => void | Promise<void>
      )(error);
    return [null, error];
  } finally {
    clearTimeout(id);
  }
}

/**
 * @desc Convert a legacy [data, error] tuple into a Result<T> discriminated union.
 */
export async function toResult<
  T,
  TErrorBody extends ApiErrorBody = ApiErrorBody,
>(
  promise: Promise<LegacyResult<T, TErrorBody>>,
): Promise<Result<T, TErrorBody>> {
  const [data, error] = await promise;
  if (error) {
    return { ok: false, error };
  }
  return { ok: true, data: data as T };
}

/**
 * @desc Build fetch init for methods with a body (POST/PUT/PATCH).
 * FormData is passed through; JSON bodies are stringified with Content-Type header.
 */
export function withBody(
  method: string,
  body?: unknown,
): Partial<SafeFetchInit> {
  if (body === undefined) return { method };
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return { method, body };
  }
  return {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
}

/**
 * @desc Capture a V8 stack trace at the caller's call site for error diagnostics.
 */
export function getCallSite(callerFn?: Function): string | undefined {
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
