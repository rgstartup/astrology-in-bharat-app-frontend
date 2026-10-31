// Client-only XHR upload transport with progress reporting.
//
// Do NOT import this module from Server Actions, Route Handlers, or any
// server-side code: `XMLHttpRequest` only exists in browsers. The factory
// itself is safe to import anywhere (no browser API runs at module scope),
// but `upload()` returns `{ ok: false, error }` when XHR is unavailable.
//
// Shares the `Result<T>` / `ApiError` contract with `safeFetch.ts` so
// consumer code (`if (!res.ok) ... res.error ... else res.data`) is unchanged.

import { ApiError, type ApiErrorBody, type FieldErrors } from "./error";
import type { Result, SafeFetchInstanceConfig } from "./safeFetch";

export interface UploadProgress {
  loaded: number;
  total: number | null;
  percent: number | null;
}

export interface SafeUploadInit {
  headers?: HeadersInit;
  timeoutMs?: number;
  signal?: AbortSignal;
  onUploadProgress?: (progress: UploadProgress) => void;
  params?: Record<string, string | number | boolean | null | undefined>;
  withCredentials?: boolean;
}

export interface SafeFetchUploadInstance {
  upload<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData | File | Blob,
    init?: SafeUploadInit,
  ): Promise<Result<T, TErrorBody>>;
  /** Inherit config and override with new values — headers are merged, not replaced */
  extend: (config: SafeFetchInstanceConfig) => SafeFetchUploadInstance;
}

function mergeUploadHeaders(...sources: (HeadersInit | undefined)[]): Headers {
  const merged = new Headers();
  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      merged.set(key, value);
    });
  }
  return merged;
}

function resolveUploadUrl(base: string | undefined, path: string): string {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

function parseXhrBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function parseXhrHeaders(raw: string): Headers {
  const headers = new Headers();
  for (const line of raw.split("\r\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      if (key) headers.append(key, value);
    }
  }
  return headers;
}

function extractErrorDetail(data: unknown): {
  message?: string;
  errorCode?: string;
  fieldErrors?: FieldErrors;
} {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const detail: { message?: string; errorCode?: string; fieldErrors?: FieldErrors } = {};
    if ("message" in record && record.message !== undefined) {
      detail.message = Array.isArray(record.message)
        ? String(record.message[0])
        : String(record.message);
    }
    if ("errorCode" in record && typeof record.errorCode === "string") {
      detail.errorCode = record.errorCode;
    }
    if (
      "fieldErrors" in record &&
      typeof record.fieldErrors === "object" &&
      record.fieldErrors !== null
    ) {
      detail.fieldErrors = record.fieldErrors as FieldErrors;
    }
    return detail;
  }
  return {};
}

function getUploadCallSite(caller?: (...args: never[]) => unknown): string | undefined {
  const err: { stack?: string } = {};
  const v8 = Error as unknown as {
    captureStackTrace?: (target: object, fn?: (...args: never[]) => unknown) => void;
  };
  if (typeof v8.captureStackTrace === "function" && caller) {
    v8.captureStackTrace(err, caller);
    return err.stack;
  }
  return new Error().stack;
}

/**
 * @desc Creates a client-only XHR upload instance reporting upload progress.
 * Returns `Result<T>` discriminated union, sharing the `ApiError` contract
 * with `createSafeFetchResultInstance`.
 */
export function createSafeFetchUploadInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchUploadInstance {
  const instance: SafeFetchUploadInstance = {
    upload<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body: FormData | File | Blob,
      init?: SafeUploadInit,
    ): Promise<Result<T, TErrorBody>> {
      const callSite = getUploadCallSite(instance.upload);
      const timeoutMs = init?.timeoutMs ?? config.timeoutMs ?? 120_000;

      let resolvedUrl = resolveUploadUrl(config.baseUrl, url);
      if (init?.params) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(init.params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
        const queryString = searchParams.toString();
        if (queryString) {
          resolvedUrl += (resolvedUrl.includes("?") ? "&" : "?") + queryString;
        }
      }

      const mergedHeaders = mergeUploadHeaders(config.headers, init?.headers);
      if (typeof FormData !== "undefined" && body instanceof FormData) {
        // Let the browser set the multipart boundary.
        mergedHeaders.delete("Content-Type");
      }
      const withCredentials =
        init?.withCredentials ?? (config.credentials ?? "include") === "include";

      if (typeof XMLHttpRequest === "undefined") {
        const error = new ApiError<TErrorBody>(
          0,
          "Upload with progress requires a browser environment",
          undefined,
          undefined,
          { callSiteStack: callSite },
        );
        return Promise.resolve({ ok: false, error });
      }

      const runInterceptors = async (): Promise<void> => {
        if (config.onRequest) {
          await config.onRequest(resolvedUrl, {
            method: "POST",
            headers: mergedHeaders,
            credentials: withCredentials ? "include" : "same-origin",
            signal: init?.signal,
          });
        }
      };

      return runInterceptors().then(
        () =>
          new Promise<Result<T, TErrorBody>>((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", resolvedUrl, true);
            xhr.withCredentials = withCredentials;
            xhr.timeout = timeoutMs;
            mergedHeaders.forEach((value, key) => {
              xhr.setRequestHeader(key, value);
            });

            const signal = init?.signal;
            const abortListener = (): void => xhr.abort();
            if (signal) {
              if (signal.aborted) {
                const error = new ApiError<TErrorBody>(0, "Request aborted or timeout", undefined, undefined, {
                  callSiteStack: callSite,
                });
                resolve({ ok: false, error });
                return;
              }
              signal.addEventListener("abort", abortListener, { once: true });
            }
            const cleanup = (): void => {
              signal?.removeEventListener("abort", abortListener);
            };

            if (init?.onUploadProgress && xhr.upload) {
              xhr.upload.onprogress = (event: ProgressEvent) => {
                const total = event.lengthComputable ? event.total : null;
                init.onUploadProgress?.({
                  loaded: event.loaded,
                  total,
                  percent: total ? Math.round((event.loaded / total) * 100) : null,
                });
              };
            }

            const fail = (message: string, cause?: unknown): void => {
              cleanup();
              const error = new ApiError<TErrorBody>(0, message, undefined, undefined, {
                cause,
                callSiteStack: callSite,
              });
              if (config.onError) {
                void Promise.resolve(config.onError(error)).then(() =>
                  resolve({ ok: false, error }),
                );
              } else {
                resolve({ ok: false, error });
              }
            };

            xhr.onload = () => {
              cleanup();
              const data = parseXhrBody(xhr.responseText);
              const responseHeaders = parseXhrHeaders(xhr.getAllResponseHeaders());
              if (xhr.status >= 200 && xhr.status < 300) {
                const respond = async (): Promise<void> => {
                  if (config.onResponse) {
                    const synthetic = new Response(xhr.responseText, {
                      status: xhr.status,
                      statusText: xhr.statusText,
                      headers: responseHeaders,
                    });
                    await config.onResponse(data as T, synthetic);
                  }
                  resolve({ ok: true, data: data as T });
                };
                void respond();
                return;
              }
              const detail = extractErrorDetail(data);
              const error = new ApiError<TErrorBody>(
                xhr.status,
                detail.message ?? xhr.statusText,
                data as TErrorBody,
                responseHeaders,
                {
                  callSiteStack: callSite,
                  errorCode: detail.errorCode,
                  fieldErrors: detail.fieldErrors,
                },
              );
              if (config.onError) {
                void Promise.resolve(config.onError(error)).then(() =>
                  resolve({ ok: false, error }),
                );
              } else {
                resolve({ ok: false, error });
              }
            };
            xhr.onerror = () => fail("Network error");
            xhr.ontimeout = () => fail("Request aborted or timeout");
            xhr.onabort = () => fail("Request aborted or timeout");

            xhr.send(body);
          }),
      );
    },

    extend: (overrides: SafeFetchInstanceConfig) =>
      createSafeFetchUploadInstance({
        ...config,
        ...overrides,
        headers: mergeUploadHeaders(config.headers, overrides.headers),
      }),
  };

  return instance;
}

/**
 * @desc Default client-only XHR upload instance (no base URL). Prefer
 * `createSafeFetchUploadInstance({ baseUrl })` for app-scoped clients.
 */
export const safeUpload = createSafeFetchUploadInstance();
