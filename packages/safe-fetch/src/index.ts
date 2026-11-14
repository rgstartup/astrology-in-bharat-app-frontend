export type {
  LegacyResult,
  SafeFetchInstance,
  SafeFetchResultInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
} from "./core";

export {
  default as safeFetch,
  safeFetchResult,
  createSafeFetchInstance,
  createSafeFetchResultInstance,
} from "./core/safe-fetch";

// Retry plugin (opt-in). Importing augments SafeFetchInit / SafeFetchInstanceConfig
// with retry / retryIntervalMs / retryOn fields.
export type { RetryConfig } from "./retry";
export { withRetry, withRetryResult } from "./retry";

// Envelope + retry wrapper (opt-in). Retries transient failures then unwraps
// symmetric backend response envelope.
export {
  createSafeFetchRetryEnvelopeInstance,
  safeFetchRetryEnvelope,
} from "./retry";

export {
  ApiError,
  type ApiErrorBody,
  type ApiErrorOptions,
  type ApiErrorPayload,
  type FieldErrors,
} from "./core/error";
export type { Result } from "./core/result";

export {
  createSafeFetchUploadInstance,
  safeUpload,
  type UploadProgress,
  type SafeUploadInit,
  type SafeFetchUploadInstance,
} from "./upload";

// Envelope upload wrapper (opt-in). Unwraps symmetric backend response envelope
// for XHR uploads.
export {
  createSafeFetchUploadEnvelopeInstance,
  safeUploadEnvelope,
} from "./upload";

// Envelope wrapper (opt-in). Handles symmetric backend response envelope.
export type {
  EnvelopeResponse,
  EnvelopeErrorPayload,
  EnvelopeMeta,
} from "./core/safe-fetch-result-envelope.instance";
export {
  EnvelopeError,
  createSafeFetchEnvelopeInstance,
} from "./core/safe-fetch-result-envelope.instance";

import safeFetch from "./core/safe-fetch";
export default safeFetch;
