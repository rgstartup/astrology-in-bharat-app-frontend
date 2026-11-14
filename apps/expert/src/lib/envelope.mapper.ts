import type { Result, ApiErrorBody } from "@repo/safe-fetch";
import { ApiError } from "@repo/safe-fetch";

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

/** Extended error body for envelope errors */
export interface EnvelopeErrorBody extends ApiErrorBody {
  errorCode?: string;
  statusCode?: number;
}

/**
 * Unwraps a backend envelope Result into a plain data Result.
 * - Network/abort errors (result.ok === false): pass through unchanged.
 * - Envelope success === false: return error with envelope error details.
 * - Envelope success === true: return envelope.data unwrapped.
 */
export function unwrapEnvelope<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
  result: Result<EnvelopeResponse<T>, TErrorBody>
): Result<T, TErrorBody> {
  if (!result.ok) return result;

  const envelope = result.data;
  if (!envelope.success) {
    const statusCode =
      (envelope.error?.details?.httpStatus as number) ?? 500;
    const error = new ApiError<TErrorBody>(
      statusCode,
      envelope.error?.message ?? "Request failed",
      envelope.error as unknown as TErrorBody,
      undefined,
      {
        errorCode: envelope.error?.code,
        fieldErrors: envelope.error?.details?.fieldErrors as EnvelopeErrorBody["fieldErrors"],
      },
    );
    return { ok: false, error };
  }

  return { ok: true, data: envelope.data as T };
}