// Envelope-aware upload instance.
//
// Unwraps the symmetric backend response envelope:
//   { success, data, error, meta }
// into safe-fetch's Result<T> contract:
//   { ok: true, data }  |  { ok: false, error: ApiError }
//
// Mirrors createSafeFetchEnvelopeInstance but for XHR uploads.

import type { ApiErrorBody, FieldErrors } from "../core/error";
import { ApiError } from "../core/error";
import type { Result } from "../core/result";
import { createSafeFetchUploadInstance } from "./upload";
import type {
  SafeFetchUploadInstance,
  SafeUploadInit,
} from "./upload";
import type { SafeFetchInstanceConfig } from "../core";

/** Backend symmetric response envelope. */
export interface EnvelopeResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: EnvelopeErrorPayload | null;
  meta: EnvelopeMeta;
}

/** Error payload carried inside a failed envelope. */
export interface EnvelopeErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  path?: string;
  timestamp: string;
}

/** Metadata carried inside every envelope response. */
export interface EnvelopeMeta {
  timestamp: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
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

  toApiErrorBody(): ApiErrorBody {
    return {
      message: this.error.message,
      errorCode: this.error.code,
      fieldErrors: this.error.details?.fieldErrors as FieldErrors | undefined,
      statusCode: (this.error.details?.httpStatus as number) ?? 500,
      path: this.error.path,
      timestamp: this.error.timestamp,
    };
  }
}

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
    const statusCode =
      (envelope.error?.details?.httpStatus as number | undefined) ?? 500;
    const fieldErrors = envelope.error?.details?.fieldErrors as
      | FieldErrors
      | undefined;
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
    return { ok: false, error };
  }

  return { ok: true, data: envelope.data as T };
}

/**
 * @desc Creates an upload instance that automatically unwraps the symmetric
 * backend response envelope. Success returns envelope.data; failure returns
 * a safe-fetch ApiError built from envelope.error.
 *
 * Usage:
 *   const api = createSafeFetchUploadEnvelopeInstance({ baseUrl, ... });
 *   const { data } = await api.upload("/users", formData); // data is unwrapped
 */
export function createSafeFetchUploadEnvelopeInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchUploadInstance {
  const base = createSafeFetchUploadInstance(config);

  const callable: SafeFetchUploadInstance = {
    async upload<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
      url: string,
      body: FormData | File | Blob,
      init?: SafeUploadInit,
    ): Promise<Result<T, TErrorBody>> {
      return unwrapEnvelope(
        base.upload<EnvelopeResponse<T>, TErrorBody>(url, body, init),
        config.onError,
      );
    },

    /** Inherit config and override with new values — headers are merged, not replaced */
    extend: (overrides: SafeFetchInstanceConfig) =>
      createSafeFetchUploadEnvelopeInstance({
        ...config,
        ...overrides,
        headers: { ...config.headers, ...overrides.headers },
      }),
  };

  return callable;
}

/**
 * @desc Default client-only XHR upload envelope instance (no base URL).
 */
export const safeUploadEnvelope = createSafeFetchUploadEnvelopeInstance();
