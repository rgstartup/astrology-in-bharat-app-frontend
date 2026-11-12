// Retry plugin for @repo/safe-fetch.
//
// Importing this module augments `SafeFetchInit` / `SafeFetchInstanceConfig`
// with retry fields (opt-in types) and provides `withRetry` / `withRetryResult`
// wrappers. No retry logic lives in `safeFetch.ts`.

import { ApiError, type ApiErrorBody } from "./error";
import type {
  LegacyResult,
  SafeFetchInstance,
  SafeFetchInit,
  SafeFetchInstanceConfig,
} from "./safeFetch";
import type { Result } from "./result";
import type { SafeFetchResultInstance } from "./safeFetch";

/** Retry configuration. Applied per request (`init`) or per instance (`config`). */
export interface RetryConfig {
  /** Number of retry attempts after a failed request. Default 0 (no retry). */
  retry?: number;
  /** Delay in ms between retry attempts. Default 1000. */
  retryIntervalMs?: number;
  /**
   * Custom predicate to decide whether a failed attempt should be retried.
   * Receives the error and the current 1-based attempt number.
   * Default: retry on network/timeout/abort (status 0) and server errors (5xx).
   */
  retryOn?: (error: ApiError, attempt: number) => boolean;
}

// ---- Opt-in type augmentation (only when this plugin is imported) ----

declare module "./safeFetch" {
  interface SafeFetchInit extends RetryConfig {}
  interface SafeFetchInstanceConfig extends RetryConfig {}
}

/** Default retry predicate: network/timeout/abort (status 0) and 5xx server errors. */
function defaultRetryOn(error: ApiError): boolean {
  return error.status === 0 || error.status >= 500;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic retry loop.
 * `call` performs one attempt. `isError` / `getError` extract the error from
 * the outcome shape (tuple or Result). Returns the first successful outcome,
 * or the last failed outcome once attempts are exhausted.
 */
async function retryable<T>(
  call: () => Promise<T>,
  config: {
    isError: (outcome: T) => boolean;
    getError: (outcome: T) => ApiError;
    retry: number;
    retryIntervalMs: number;
    retryOn: (error: ApiError, attempt: number) => boolean;
  },
): Promise<T> {
  let attempt = 0;
  const maxAttempts = config.retry + 1;

  const go = async (): Promise<T> => {
    attempt++;
    const outcome = await call();
    if (!config.isError(outcome)) return outcome;

    const error = config.getError(outcome);
    if (!config.retryOn(error, attempt) || attempt >= maxAttempts) {
      return outcome;
    }

    await sleep(config.retryIntervalMs);
    return go();
  };

  return go();
}

function resolveConfig(config: RetryConfig = {}) {
  return {
    retry: config.retry ?? 0,
    retryIntervalMs: config.retryIntervalMs ?? 1000,
    retryOn: config.retryOn ?? defaultRetryOn,
  };
}

/** Merge instance-level defaults with per-call `init` overrides (call wins). */
function callConfig(
  instanceCfg: {
    retry: number;
    retryIntervalMs: number;
    retryOn: (error: ApiError, attempt: number) => boolean;
  },
  init?: SafeFetchInit,
) {
  return {
    retry: init?.retry ?? instanceCfg.retry,
    retryIntervalMs: init?.retryIntervalMs ?? instanceCfg.retryIntervalMs,
    retryOn: init?.retryOn ?? instanceCfg.retryOn,
  };
}

/**
 * Wraps a legacy tuple-instance (`SafeFetchInstance`) so each call retries on
 * retryable failures. `onError` fires on every failed attempt (the underlying
 * executor reports errors per attempt).
 */
export function withRetry(
  instance: SafeFetchInstance,
  config: RetryConfig = {},
): SafeFetchInstance {
  const instanceCfg = resolveConfig(config);

  const wrapLegacy = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    call: () => Promise<LegacyResult<T, TErrorBody>>,
    init?: SafeFetchInit,
  ) =>
    retryable(call, {
      ...callConfig(instanceCfg, init),
      isError: ([, error]) => error !== null,
      getError: ([, error]) => error as ApiError,
    });

  const wrapped = {
    get: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.get<T, TErrorBody>(url, init), init),

    post: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.post<T, TErrorBody>(url, body, init), init),

    put: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.put<T, TErrorBody>(url, body, init), init),

    patch: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.patch<T, TErrorBody>(url, body, init), init),

    delete: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.delete<T, TErrorBody>(url, init), init),

    upload: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body: FormData,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance.upload<T, TErrorBody>(url, body, init), init),

    extend: (overrides: SafeFetchInstanceConfig) =>
      withRetry(instance.extend(overrides), config),
  } as SafeFetchInstance;

  // Make the wrapper callable too (the instance itself is a function).
  const callable = Object.assign(
    wrapped,
    <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapLegacy(() => instance<T, TErrorBody>(url, init), init),
  ) as SafeFetchInstance;

  return callable;
}

/**
 * Wraps a `Result`-typed instance (`SafeFetchResultInstance`) so each call
 * retries on retryable failures.
 */
export function withRetryResult(
  instance: SafeFetchResultInstance,
  config: RetryConfig = {},
): SafeFetchResultInstance {
  const instanceCfg = resolveConfig(config);

  const wrapResult = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    call: () => Promise<Result<T, TErrorBody>>,
    init?: SafeFetchInit,
  ) =>
    retryable(call, {
      ...callConfig(instanceCfg, init),
      isError: (result) => !result.ok,
      getError: (result) => result.error as ApiError,
    });

  const wrapped = {
    get: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.get<T, TErrorBody>(url, init), init),

    post: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.post<T, TErrorBody>(url, body, init), init),

    put: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.put<T, TErrorBody>(url, body, init), init),

    patch: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body?: unknown,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.patch<T, TErrorBody>(url, body, init), init),

    delete: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.delete<T, TErrorBody>(url, init), init),

    upload: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body: FormData,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance.upload<T, TErrorBody>(url, body, init), init),

    extend: (overrides: SafeFetchInstanceConfig) =>
      withRetryResult(instance.extend(overrides), config),
  } as SafeFetchResultInstance;

  const callable = Object.assign(
    wrapped,
    <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      init?: SafeFetchInit,
    ) => wrapResult(() => instance<T, TErrorBody>(url, init), init),
  ) as SafeFetchResultInstance;

  return callable;
}
