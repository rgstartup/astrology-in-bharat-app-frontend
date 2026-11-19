// Envelope-aware safe-fetch instance.
//
// Unwraps the symmetric backend response envelope:
//   { success, data, error, meta }
// into safe-fetch's Result<T> contract:
//   { ok: true, data }  |  { ok: false, error: ApiError }
//
// Backend error payload (ApiError):
//   { code, message, details?, path?, timestamp }
// Maps to safe-fetch ApiErrorBody:
//   { errorCode, message, fieldErrors, statusCode, path, timestamp }

import type { ApiErrorBody, FieldErrors } from "./error";
import { ApiError } from "./error";
import type { Result } from "./result";
import { createSafeFetchResultInstance } from "./safe-fetch-result.instance";
import type {
  SafeFetchResultInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
} from "./index";

/** Backend symmetric response envelope. */
export interface EnvelopeResponse<T = unknown> {
  success: boolean;
  type?: 'entity' | 'collection' | 'paginated' | 'boolean' | 'empty' | 'error';
  data: T | null;
  error: EnvelopeErrorPayload | null;
  meta: EnvelopeMeta;
}

/**
 * Result returned by envelope-aware safe-fetch instances.
 * Binds ok to envelope.success, data directly to envelope.data,
 * and meta to envelope.meta.
 */
export type EnvelopeResult<T, TErrorBody extends ApiErrorBody = ApiErrorBody> =
  | { ok: true; data: T; error?: never; meta: EnvelopeMeta }
  | { ok: false; data: T | null; error: ApiError<TErrorBody>; meta?: EnvelopeMeta };

/** Granular field error item inside details array. */
export interface EnvelopeErrorDetail {
  field?: string;
  code: string;
  message: string;
}

/** Error payload carried inside a failed envelope. */
export interface EnvelopeErrorPayload {
  code: string;
  message: string;
  details?: EnvelopeErrorDetail[] | Record<string, unknown>;
  path?: string;
  timestamp?: string;
}

/** Metadata carried inside every envelope response. */
export interface EnvelopeMeta {
  timestamp: string;
  requestId?: string;
  path?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total?: number;
    hasPrevPage?: boolean;
  };
}

/**
 * Extracts a normalized fieldErrors map from details array or record.
 */
function extractFieldErrors(
  details?: EnvelopeErrorDetail[] | Record<string, unknown>,
): FieldErrors | undefined {
  if (!details) return undefined;

  if (Array.isArray(details)) {
    const fieldErrors: FieldErrors = {};
    for (const item of details) {
      if (item && item.field && item.message) {
        const field = item.field;
        const list = fieldErrors[field] ?? [];
        list.push(item.message);
        fieldErrors[field] = list;
      }
    }
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
  }

  if (typeof details === "object" && details !== null && "fieldErrors" in details) {
    return (details as { fieldErrors: FieldErrors }).fieldErrors;
  }

  return undefined;
}

/**
 * @desc Error thrown when the backend envelope indicates failure.
 * Converts to a safe-fetch-compatible ApiErrorBody via toApiErrorBody().
 */
export class EnvelopeError extends Error {
  constructor(
    public readonly error: EnvelopeErrorPayload,
    public readonly meta: EnvelopeMeta,
  ) {
    super(error.message);
    this.name = "EnvelopeError";
  }

  /**
   * @desc Map backend envelope error to safe-fetch ApiErrorBody shape.
   * code -> errorCode, details.fieldErrors -> fieldErrors,
   * details.httpStatus -> statusCode (default 500).
   */
  toApiErrorBody(): ApiErrorBody {
    const legacyDetails = !Array.isArray(this.error.details)
      ? (this.error.details as Record<string, unknown> | undefined)
      : undefined;

    return {
      message: this.error.message,
      errorCode: this.error.code,
      fieldErrors: extractFieldErrors(this.error.details),
      statusCode: (legacyDetails?.httpStatus as number) ?? 500,
      path: this.meta?.path ?? this.error.path,
      timestamp: this.meta?.timestamp ?? this.error.timestamp,
    };
  }
}

/**
 * Instance contract for envelope-aware safe-fetch.
 * All HTTP methods return Promise<EnvelopeResult<T, TErrorBody>>.
 */
export interface SafeFetchEnvelopeInstance {
  <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<EnvelopeResult<T, TErrorBody>>;
  get: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  post: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  put: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  patch: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  delete: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  upload: <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => Promise<EnvelopeResult<T, TErrorBody>>;
  extend: (overrides: SafeFetchInstanceConfig) => SafeFetchEnvelopeInstance;
}

/**
 * @desc Unwrap a backend envelope Result into an EnvelopeResult.
 * - Network/abort errors (result.ok === false): return { ok: false, data: null, error, meta: undefined }.
 * - Envelope success === false: return { ok: false, data: envelope.data, error, meta: envelope.meta }.
 * - Envelope success === true: return { ok: true, data: envelope.data, meta: envelope.meta }.
 */
export async function unwrapEnvelope<
  T,
  TErrorBody extends ApiErrorBody = ApiErrorBody,
>(
  promise: Promise<Result<EnvelopeResponse<T>, TErrorBody>>,
  onError?: SafeFetchInstanceConfig["onError"],
): Promise<EnvelopeResult<T, TErrorBody>> {
  const result = await promise;
  if (!result.ok) {
    return {
      ok: false,
      data: null,
      error: result.error,
      meta: undefined,
    };
  }

  const envelope = result.data;
  if (!envelope.success) {
    const legacyDetails = !Array.isArray(envelope.error?.details)
      ? (envelope.error?.details as Record<string, unknown> | undefined)
      : undefined;
    const statusCode = (legacyDetails?.httpStatus as number | undefined) ?? 500;
    const fieldErrors = extractFieldErrors(envelope.error?.details);
    const error = new ApiError<TErrorBody>(
      statusCode,
      envelope.error?.message ?? "Request failed",
      envelope.error as unknown as TErrorBody,
      undefined,
      {
        errorCode: envelope.error?.code,
        fieldErrors,
      },
    );

    if (onError) await onError(error as ApiError<TErrorBody>);
    return {
      ok: false,
      data: (envelope.data as T | null) ?? null,
      error,
      meta: envelope.meta,
    };
  }

  return {
    ok: true,
    data: envelope.data as T,
    meta: envelope.meta,
  };
}

/**
 * @desc Creates a safe-fetch instance that automatically unwraps the symmetric
 * backend response envelope, binding result.ok to envelope.success, result.data
 * to envelope.data, and result.meta to envelope.meta.
 *
 * Usage:
 *   const api = createSafeFetchEnvelopeInstance({ baseUrl, ... });
 *   const { ok, data, meta } = await api.get("/users");
 *   if (ok) {
 *     // data is T, meta is EnvelopeMeta (meta.pagination, meta.requestId)
 *   }
 */
export function createSafeFetchEnvelopeInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchEnvelopeInstance {
  const base = createSafeFetchResultInstance(config);

  const callable = (async <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<EnvelopeResult<T, TErrorBody>> => {
    return unwrapEnvelope(
      base<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );
  }) as SafeFetchEnvelopeInstance;

  callable.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.get<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );

  callable.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.post<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.put<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.patch<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  callable.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.delete<EnvelopeResponse<T>, TErrorBody>(url, init),
      config.onError,
    );

  callable.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) =>
    unwrapEnvelope(
      base.upload<EnvelopeResponse<T>, TErrorBody>(url, body, init),
      config.onError,
    );

  /** Inherit config and override with new values — headers are merged, not replaced */
  callable.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchEnvelopeInstance({
      ...config,
      ...overrides,
      headers: { ...config.headers, ...overrides.headers },
    });

  return callable;
}

/**
 * Default safeFetchEnvelope instance for direct unwrapped requests.
 */
export const safeFetchEnvelope: SafeFetchEnvelopeInstance = createSafeFetchEnvelopeInstance();
