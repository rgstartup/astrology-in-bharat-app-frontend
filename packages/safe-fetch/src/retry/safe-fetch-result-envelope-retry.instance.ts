// Envelope-aware retry instance.
//
// Combines retry (transient failures) with symmetric backend response envelope
// unwrapping:
//   { success, data, error, meta } -> Result<T> { ok: true, data } | { ok: false, error }
//
// Retry happens at the raw envelope level (network errors retried before
// checking envelope success/failure), then the envelope is unwrapped.

import type { ApiErrorBody, FieldErrors } from "../core/error";
import { ApiError } from "../core/error";
import type { Result } from "../core/result";
import { createSafeFetchResultInstance } from "../core/safe-fetch-result.instance";
import { withRetryResult } from "./retry";
import {
  type EnvelopeResponse,
  type EnvelopeErrorPayload,
  type EnvelopeMeta,
  EnvelopeError,
} from "../core/safe-fetch-result-envelope.instance";
import type {
  SafeFetchInstanceConfig,
  SafeFetchResultInstance,
  SafeFetchInit,
} from "../core";

export {
  type EnvelopeResponse,
  type EnvelopeErrorPayload,
  type EnvelopeMeta,
  EnvelopeError,
};

/**
 * @desc Unwrap a backend envelope Result into a plain data Result.
 * - Network/abort errors (result.ok === false): pass through unchanged.
 * - Envelope success === false: build ApiError from envelope.error.
 * - Envelope success === true: return envelope.data unwrapped.
 */
async function unwrapEnvelope<
  T,
  TErrorBody extends ApiErrorBody = ApiErrorBody,
>(
  promise: Promise<Result<EnvelopeResponse<T>, TErrorBody>>,
  onError?: SafeFetchInstanceConfig["onError"],
): Promise<Result<T, TErrorBody>> {
  const result = await promise;
  if (!result.ok) return result;

  const envelope = result.data;
  if (!envelope.success) {
    const errorBody = new EnvelopeError(
      envelope.error!,
      envelope.meta,
    ).toApiErrorBody();

    const error = new ApiError<TErrorBody>(
      errorBody.statusCode ?? 500,
      envelope.error?.message ?? "Request failed",
      envelope.error as unknown as TErrorBody,
      undefined,
      {
        errorCode: envelope.error?.code,
        fieldErrors: errorBody.fieldErrors,
      },
    );

    if (onError) await onError(error as ApiError<TErrorBody>);
    return { ok: false, error };
  }

  return { ok: true, data: envelope.data as T };
}

/**
 * @desc Creates a safe-fetch instance that retries on transient failures and
 * automatically unwraps the symmetric backend response envelope. Success
 * returns envelope.data; failure returns a safe-fetch ApiError built from
 * envelope.error.
 *
 * Usage:
 *   const api = createSafeFetchRetryEnvelopeInstance({
 *     baseUrl,
 *     retry: 3,
 *     retryIntervalMs: 1000,
 *   });
 *   const { data } = await api.get("/users");      // data is unwrapped, retried on network error
 */
export function createSafeFetchRetryEnvelopeInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchResultInstance {
  const base = createSafeFetchResultInstance(config);
  const retried = withRetryResult(base, config);

  const callable = (async <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<Result<T, TErrorBody>> => {
    return unwrapEnvelope(
      retried<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );
  }) as SafeFetchResultInstance;

  callable.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.get<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );

  callable.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.post<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.put<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.patch<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.delete<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );

  callable.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      retried.upload<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  /** Inherit config and override with new values — headers are merged, not replaced */
  callable.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchRetryEnvelopeInstance({
      ...config,
      ...overrides,
      headers: { ...config.headers, ...overrides.headers },
    });

  return callable;
}

/**
 * @desc Default client-only retry envelope instance (no base URL).
 */
export const safeFetchRetryEnvelope = createSafeFetchRetryEnvelopeInstance();
