import type { Result, ApiErrorBody, EnvelopeResult } from "@repo/safe-fetch";
import { ApiError } from "@repo/safe-fetch";

/** Backend symmetric response envelope. */
export interface EnvelopeResponse<T = unknown> {
  success: boolean;
  type?: 'entity' | 'collection' | 'paginated' | 'boolean' | 'empty' | 'error';
  data: T | null;
  error: EnvelopeErrorPayload | null;
  meta: EnvelopeMeta;
}

/** Error detail inside failed envelope. */
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

/** Extended error body for envelope errors */
export interface EnvelopeErrorBody extends ApiErrorBody {
  errorCode?: string;
  statusCode?: number;
}

/**
 * Extracts a normalized fieldErrors map from details array or record.
 */
function extractFieldErrors(
  details?: EnvelopeErrorDetail[] | Record<string, unknown>,
): EnvelopeErrorBody["fieldErrors"] {
  if (!details) return undefined;

  if (Array.isArray(details)) {
    const fieldErrors: Record<string, string[]> = {};
    for (const item of details) {
      if (item && item.field && item.message) {
        const field = item.field;
        const list = fieldErrors[field] ?? [];
        list.push(item.message);
        fieldErrors[field] = list;
      }
    }
    return Object.keys(fieldErrors).length > 0 ? (fieldErrors as EnvelopeErrorBody["fieldErrors"]) : undefined;
  }

  if (typeof details === "object" && details !== null && "fieldErrors" in details) {
    return (details as { fieldErrors: EnvelopeErrorBody["fieldErrors"] }).fieldErrors;
  }

  return undefined;
}

/**
 * Unwraps a backend envelope Result (e.g. from safeFetchResultInstance) into an EnvelopeResult.
 * - Network/abort errors (result.ok === false): return { ok: false, data: null, error, meta: undefined }.
 * - Envelope success === false: return { ok: false, data: envelope.data, error, meta: envelope.meta }.
 * - Envelope success === true: return { ok: true, data: envelope.data, meta: envelope.meta }.
 */
export function unwrapEnvelope<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
  result: Result<EnvelopeResponse<T>, TErrorBody>
): EnvelopeResult<T, TErrorBody> {
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
    const statusCode =
      (legacyDetails?.httpStatus as number | undefined) ?? 500;
    const error = new ApiError<TErrorBody>(
      statusCode,
      envelope.error?.message ?? "Request failed",
      envelope.error as unknown as TErrorBody,
      undefined,
      {
        errorCode: envelope.error?.code,
        fieldErrors: extractFieldErrors(envelope.error?.details),
      },
    );
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