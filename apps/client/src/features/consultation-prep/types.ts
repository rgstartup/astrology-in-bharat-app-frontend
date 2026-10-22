import type { SomeoneElseData } from "@/actions/chat";
import type { ConsultationMode } from "@/store/consultationPrepStore";

export type { ConsultationMode };

/**
 * Outcome verdict from the expert response to a consultation request.
 */
export type ConsultationVerdict =
  | "accepted"
  | "rejected"
  | "expired"
  | "timeout"
  | "cancelled";

/**
 * Terminal negative outcome surfaced in the waiting modal.
 */
export type WaitOutcome = "rejected" | "timeout" | null;

export type { SomeoneElseData };
