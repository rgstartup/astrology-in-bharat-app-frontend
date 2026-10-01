export {
  default as safeFetch,
  safeFetchResult,
  createSafeFetchInstance,
  createSafeFetchResultInstance,
} from "./safeFetch";
export {
  ApiError,
  type ApiErrorBody,
  type ApiErrorOptions,
  type ApiErrorPayload,
  type FieldErrors,
} from "./error";
export type {
  Result,
  LegacyResult,
  SafeFetchInstance,
  SafeFetchResultInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
} from "./safeFetch";

import safeFetch from "./safeFetch";
export default safeFetch;

