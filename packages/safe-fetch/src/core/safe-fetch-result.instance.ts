import {
  SafeFetchResultInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
  toResult,
  mergeHeaders,
} from "./index";
import { createSafeFetchInstance } from "./safe-fetch.instance";
import { ApiErrorBody } from "./error";

/**
 * @desc Creates a reusable safeFetchResult instance returning Result<T> discriminated union ({ ok: true, data } | { ok: false, error }).
 */
export function createSafeFetchResultInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchResultInstance {
  const legacyInstance = createSafeFetchInstance(config);

  const instance = (<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) =>
    toResult(
      legacyInstance<T, TErrorBody>(url, init),
    )) as SafeFetchResultInstance;

  instance.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.get<T, TErrorBody>(url, init));

  instance.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.post<T, TErrorBody>(url, body, init));

  instance.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.put<T, TErrorBody>(url, body, init));

  instance.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.patch<T, TErrorBody>(url, body, init));

  instance.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.delete<T, TErrorBody>(url, init));

  instance.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => toResult(legacyInstance.upload<T, TErrorBody>(url, body, init));

  instance.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchResultInstance({
      ...config,
      ...overrides,
      headers: mergeHeaders(config.headers, overrides.headers),
    });

  return instance;
}
