import parseBody from "./body-parser";
import anySignal from "./any-signal";

interface SafeFetchInit extends RequestInit {
  timeoutMs?: number;
  controller?: AbortController; // 👈 user can pass their own
}

// Custom error class to capture API errors with status, message, body, and headers
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: any,
    public headers?: Headers,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Result type: either data of type T or an ApiError
type Result<T> = [T | null, ApiError | null];

/**
 * @desc A safe wrapper around fetch that returns a tuple of [data, error] instead of throwing.
 * It also includes a timeout mechanism and supports aborting via an optional user-provided AbortController.
 *
 * @example
 * const [data, error] = await safeFetch<SomeType>('/api/data');
 * if (error) {
 *   console.error('API Error:', error);
 * } else {
 *   console.log('Data:', data);
 * }
 * @param url
 * @param init
 * @returns
 */
export default async function safeFetch<T>(
  url: string,
  init?: SafeFetchInit,
): Promise<Result<T>> {
  const { timeoutMs = 15000, controller: userController, ...rest } = init || {};

  // Create timeout controller
  const timeoutController = new AbortController();

  // Use user's controller if provided, otherwise our timeout one
  const signal = userController
    ? anySignal([userController.signal, timeoutController.signal])
    : timeoutController.signal;

  const id = setTimeout(() => {
    timeoutController.abort();
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      credentials: "include",
      signal,
      ...rest,
    });

    const data = await parseBody(res);

    if (!res.ok) {
      return [
        null,
        new ApiError(res.status, res.statusText, data, res.headers),
      ];
    }

    return [data as T, null];
  } catch (err: any) {
    if (err.name === "AbortError") {
      return [null, new ApiError(0, "Request aborted or timeout")];
    }

    return [null, new ApiError(0, err.message || "Network error")];
  } finally {
    clearTimeout(id);
  }
}
