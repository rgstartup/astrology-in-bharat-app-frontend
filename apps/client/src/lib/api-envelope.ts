import {
  createSafeFetchEnvelopeInstance,
  type SafeFetchEnvelopeInstance,
  type SafeFetchInstanceConfig,
  type EnvelopeResponse,
  type EnvelopeErrorPayload,
  type EnvelopeErrorDetail,
  type EnvelopeMeta,
  type EnvelopeResult,
} from "@repo/safe-fetch";

export type {
  EnvelopeResponse,
  EnvelopeErrorPayload,
  EnvelopeErrorDetail,
  EnvelopeMeta,
  EnvelopeResult,
  SafeFetchEnvelopeInstance,
};

/**
 * Creates an envelope-aware API instance for client apps.
 * Directly returns EnvelopeResult<T> with result.ok = envelope.success,
 * result.data = envelope.data, and result.meta = envelope.meta.
 */
export function createExpertApiEnvelopeInstance(
  config: SafeFetchInstanceConfig = {},
): SafeFetchEnvelopeInstance {
  return createSafeFetchEnvelopeInstance(config);
}