import {
  createSafeFetchResultInstance,
  type SafeFetchResultInstance,
  type SafeFetchInstanceConfig,
  type SafeFetchInit,
  type Result,
  type ApiErrorBody,
  ApiError,
} from "@repo/safe-fetch";

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

/**
 * Extracts normalized fieldErrors map from details array or record.
 */
function extractFieldErrors(
  details?: EnvelopeErrorDetail[] | Record<string, unknown>,
): Record<string, string[]> | undefined {
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
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
  }

  if (typeof details === 'object' && details !== null && 'fieldErrors' in details) {
    return (details as { fieldErrors: Record<string, string[]> }).fieldErrors;
  }

  return undefined;
}

/**
 * Paginated result that includes both data and pagination metadata.
 * Used when the backend response contains pagination info.
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: EnvelopeMeta["pagination"];
}

/**
 * Custom envelope instance that preserves pagination metadata.
 * - For paginated responses: returns { data: T[], pagination }
 * - For non-paginated responses: returns the unwrapped data directly
 * - Errors are converted to safe-fetch ApiError format
 */
export function createExpertApiEnvelopeInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchResultInstance {
  const base = createSafeFetchResultInstance(config);

  const callable = (async <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ): Promise<Result<T, TErrorBody>> => {
    const result = await base<EnvelopeResponse<T>, TErrorBody>(url, init);
    if (!result.ok) return result;

    const envelope = result.data;
    if (!envelope.success) {
      const legacyDetails = !Array.isArray(envelope.error?.details)
        ? (envelope.error?.details as Record<string, unknown> | undefined)
        : undefined;
      const statusCode =
        (legacyDetails?.httpStatus as number | undefined) ?? 500;
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

      if (config.onError) await config.onError(error as ApiError<TErrorBody>);
      return { ok: false, error };
    }

    // Check if response has pagination metadata
    const hasPagination = Boolean(envelope.meta?.pagination);

    if (hasPagination) {
      // For paginated responses, return data + pagination as a single object
      // This matches the old PaginatedResponse format: { data: T[], meta: PaginationMeta }
      return {
        ok: true,
        data: {
          data: envelope.data as T[],
          meta: envelope.meta.pagination,
        } as T,
      };
    }

    // For non-paginated responses, return unwrapped data
    return { ok: true, data: envelope.data as T };
  }) as SafeFetchResultInstance;

  callable.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => callable<T, TErrorBody>(url, { method: "GET", ...init });

  callable.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => callable<T, TErrorBody>(url, { method: "POST", body, ...init });

  callable.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => callable<T, TErrorBody>(url, { method: "PUT", body, ...init });

  callable.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => callable<T, TErrorBody>(url, { method: "PATCH", body, ...init });

  callable.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => callable<T, TErrorBody>(url, { method: "DELETE", ...init });

  callable.extend = (overrides: SafeFetchInstanceConfig) =>
    createExpertApiEnvelopeInstance({
      ...config,
      ...overrides,
      headers: { ...config.headers, ...overrides.headers },
    });

  return callable;
}