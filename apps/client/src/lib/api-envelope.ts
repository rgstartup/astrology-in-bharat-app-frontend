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
      const statusCode =
        (envelope.error?.details?.httpStatus as number | undefined) ?? 500;
      const fieldErrors = envelope.error?.details?.fieldErrors as
        | Record<string, string[]>
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