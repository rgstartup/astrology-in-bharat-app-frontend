export type {
  LegacyResult,
  SafeFetchInstance,
  SafeFetchResultInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
} from "./safeFetch";

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
export type { Result } from "./result";

export {
  createSafeFetchUploadInstance,
  safeUpload,
  type UploadProgress,
  type SafeUploadInit,
  type SafeFetchUploadInstance,
} from "./upload";

import safeFetch from "./safeFetch";
export default safeFetch;
