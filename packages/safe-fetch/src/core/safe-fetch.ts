// Thin backward-compat wrapper.
//
// All implementation moved to core.ts, legacy.ts, result-instance.ts, envelope.ts.
// This file re-exports everything so existing import paths keep working.

// ---- Core types and functions (re-exported) ----
export type {
  SafeFetchInit,
  SafeFetchInstanceConfig,
  LegacyResult,
  SafeFetchInstance,
  SafeFetchResultInstance,
} from "./index";

export {
  executeFetch,
  toResult,
  mergeHeaders,
  resolveUrl,
  withBody,
  getCallSite,
} from "./index";

// ---- Legacy tuple-based instance ----
export { createSafeFetchInstance } from "./safe-fetch.instance";

// ---- Result-based instance (recommended) ----
export { createSafeFetchResultInstance } from "./safe-fetch-result.instance";

// ---- Envelope-aware instance (new) ----
export { createSafeFetchEnvelopeInstance } from "./safe-fetch-result-envelope.instance";
export type {
  EnvelopeResponse,
  EnvelopeErrorPayload,
  EnvelopeMeta,
} from "./safe-fetch-result-envelope.instance";
export { EnvelopeError } from "./safe-fetch-result-envelope.instance";

// ---- Default export: simple safeFetch function (legacy) ----
import { executeFetch, getCallSite } from "./index";
import { ApiError, type ApiErrorBody } from "./error";
import type { Result } from "./result";
import { createSafeFetchResultInstance } from "./safe-fetch-result.instance";

/**
 * @desc A safe wrapper around fetch that returns a tuple of [data, error] instead of throwing.
 * Maintained for backward compatibility.
 * @deprecated Use `safeFetchResult` returning `Result<T>` discriminated union.
 */
export default async function safeFetch<T>(
  url: string,
  init?: import("./index").SafeFetchInit,
): Promise<[T | null, ApiError<ApiErrorBody> | null]> {
  const callSite = getCallSite(safeFetch);
  const [data, error] = await executeFetch<T>(url, init, {}, callSite);
  return [data, error];
}

/**
 * @desc A safe wrapper around fetch returning Result<T> discriminated union ({ ok: true, data } | { ok: false, error }).
 */
export const safeFetchResult = createSafeFetchResultInstance();
