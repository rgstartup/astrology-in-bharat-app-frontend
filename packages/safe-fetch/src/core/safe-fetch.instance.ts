import {
  SafeFetchInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
  LegacyResult,
  executeFetch,
  getCallSite,
  mergeHeaders,
  withBody,
} from "./index";
import { ApiErrorBody } from "./error";

/**
 * @desc Creates a reusable safeFetch instance with shared base URL, headers, and config —
 * returning legacy [data, error] tuples.
 * @deprecated Use `createSafeFetchResultInstance` returning `Result<T>` discriminated union.
 */
export function createSafeFetchInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchInstance {
  const instance = (<T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance);
    return executeFetch<T, TErrorBody>(url, init, config, callSite);
  }) as SafeFetchInstance;

  instance.get = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.get);
    return executeFetch<T, TErrorBody>(
      url,
      { method: "GET", ...init },
      config,
      callSite,
    );
  };

  instance.post = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.post);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("POST", body), ...init },
      config,
      callSite,
    );
  };

  instance.put = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.put);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("PUT", body), ...init },
      config,
      callSite,
    );
  };

  instance.patch = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body?: unknown,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.patch);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("PATCH", body), ...init },
      config,
      callSite,
    );
  };

  instance.delete = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.delete);
    return executeFetch<T, TErrorBody>(
      url,
      { method: "DELETE", ...init },
      config,
      callSite,
    );
  };

  instance.upload = <T, TErrorBody extends ApiErrorBody = ApiErrorBody>(
    url: string,
    body: FormData,
    init?: SafeFetchInit,
  ) => {
    const callSite = getCallSite(instance.upload);
    return executeFetch<T, TErrorBody>(
      url,
      { ...withBody("POST", body), ...init },
      config,
      callSite,
    );
  };

  /** Inherit config and override with new values — headers are merged, not replaced */
  instance.extend = (overrides: SafeFetchInstanceConfig) =>
    createSafeFetchInstance({
      ...config,
      ...overrides,
      headers: mergeHeaders(config.headers, overrides.headers),
    });

  return instance;
}