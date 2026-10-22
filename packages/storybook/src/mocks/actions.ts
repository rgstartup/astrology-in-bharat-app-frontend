/**
 * Storybook replacement for the apps' action modules.
 *
 * The client app imports `@/actions` (named `apiV2`), while the expert app
 * imports its default client from `@/actions/api`. The real modules build
 * network clients against `NEXT_PUBLIC_API_URL` and perform authenticated
 * requests; stories exercise presentation only, so the webpack alias points
 * both entrypoints at this deterministic, no-network stub.
 */

/** Successful result shape returned by the mocked `apiV2` / `api` clients. */
type SuccessResult<T> = { ok: true; data: T | null };

/**
 * Resolves a deterministic successful result without performing any I/O.
 *
 * @param url - Requested URL, ignored.
 * @param body - Request body, ignored.
 * @returns A resolved {@link SuccessResult} carrying `null` data.
 */
function resolveSuccess<T>(url: string, body?: unknown): Promise<SuccessResult<T>> {
  void url;
  void body;
  return Promise.resolve({ ok: true, data: null });
}

/** Client-app client (`@/actions` → `apiV2`). */
export const apiV2 = {
  get: <T,>(url: string): Promise<SuccessResult<T>> => resolveSuccess<T>(url),
  post: <T,>(url: string, body?: unknown): Promise<SuccessResult<T>> =>
    resolveSuccess<T>(url, body),
};

/** Legacy alias kept so older stories can still import `api`. */
export const api = apiV2;

export default apiV2;
