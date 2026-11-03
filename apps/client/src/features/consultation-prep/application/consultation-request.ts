/**
 * Plain orchestration functions for consultation-prep request protocol.
 *
 * Holds the business rules (validation, sequencing, side effects) so hooks
 * and components don't inline orchestration logic. Dependencies are injected
 * to keep them pure and testable; the decision logic lives here.
 */

import type { SomeoneElseData } from "@/actions/chat";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

export type ExecuteConsultationRequestDeps = {
  /** Starts the mic permission check (voice/video modes only). */
  checkMicPermission: () => Promise<boolean>;
  /** Clears the mic-denied UI flag. */
  clearMicDenied: () => void;
  /** Returns true when an abort was requested. */
  isAborted: () => boolean;
  /** Starts a fresh abort controller. */
  beginAbort: () => void;
  /** HTTP initiation + retry. Returns consultation metadata on success, null on failure/abort. */
  initiateApi: (
    metadata: SomeoneElseData | null,
  ) => Promise<{
    consultationId: number;
    sessionId: number;
    requestExpiresInSec: number;
    maxMinutes?: number;
  } | null>;
  /** Socket request + verdict wait + room routing on accept. Returns the verdict result. */
  sendRequestAndWaitVerdict: (
    consultationId: number,
    sessionId: number,
    requestExpiresInSec: number,
    maxMinutes?: number,
  ) => Promise<{
    verdict: "accepted" | "rejected" | "expired" | "timeout" | "cancelled";
    consultationId: number;
    sessionId: number;
  } | null>;
};

export type ExecuteConsultationRequestResult = {
  verdict:
    | "accepted"
    | "rejected"
    | "expired"
    | "timeout"
    | "cancelled"
    | null;
  consultationId: number | null;
  sessionId: number | null;
};

/**
 * Orchestrates the full consultation request flow: mic gate, API initiation,
 * socket request, verdict wait, and room routing.
 *
 * Business rules:
 *   - voice/video modes require mic access before the API call.
 *   - On INSUFFICIENT_BALANCE-style retry into an existing consultation, the
 *     API dep is responsible for returning that consultation's id/session.
 *   - Aborts short-circuit every step without side effects.
 *   - On accepted verdict, routing to the room is handled by the socket dep.
 *
 * @param deps - Injected dependencies (API, socket, mic, abort).
 * @param metadata - Someone-else form data, or null.
 * @param mode - Consultation mode (chat | voice | video).
 * @returns The final verdict and consultation/session ids (null on negative).
 */
export async function executeConsultationRequest({
  checkMicPermission,
  clearMicDenied,
  isAborted,
  beginAbort,
  initiateApi,
  sendRequestAndWaitVerdict,
}: ExecuteConsultationRequestDeps,
metadata: SomeoneElseData | null,
mode: ConsultationMode,
): Promise<ExecuteConsultationRequestResult> {
  clearMicDenied();
  beginAbort();

  if (isAborted()) {
    return { verdict: null, consultationId: null, sessionId: null };
  }

  if (mode === "voice" || mode === "video") {
    const granted = await checkMicPermission();
    if (!granted || isAborted()) {
      return { verdict: null, consultationId: null, sessionId: null };
    }
  }

  if (isAborted()) {
    return { verdict: null, consultationId: null, sessionId: null };
  }

  const started = await initiateApi(metadata);
  if (!started || isAborted()) {
    return { verdict: null, consultationId: null, sessionId: null };
  }

  const result = await sendRequestAndWaitVerdict(
    started.consultationId,
    started.sessionId,
    started.requestExpiresInSec,
    started.maxMinutes,
  );
  if (!result || isAborted()) {
    return { verdict: null, consultationId: null, sessionId: null };
  }

  return result;
}
