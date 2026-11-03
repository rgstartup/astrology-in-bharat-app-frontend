import type { ConsultationEndedPayload } from "@/realtime/types/consultation";

export type ConsultationSessionStatus = "pending" | "active" | "completed";

const TERMINAL_REDIRECT = ["rejected", "cancelled", "expired", "missed"];
// Completed is NOT a redirect - user should see history/summary
const COMPLETED_STATES = ["completed"];

type DetermineStatusParams = {
  decision: string | null;
  endedVerdict: ConsultationEndedPayload | null;
  joinedStatus: string | null;
};

/**
 * Pure room status determination. Live verdicts drive transitions, but the
 * authoritative join-ack status covers (re)joins after the verdict already
 * fired. Completed consultations show history - they do NOT redirect.
 */
export function determineSessionStatus({
  decision,
  endedVerdict,
  joinedStatus,
}: DetermineStatusParams): ConsultationSessionStatus {
  // A completed/ended consultation must win over an accepted verdict.
  // Otherwise ending a live call leaves sessionStatus stuck at "active",
  // which keeps the timer running and resurrects the cancel-request button.
  if (endedVerdict) return "completed";
  if (joinedStatus && COMPLETED_STATES.includes(joinedStatus)) return "completed";
  if (
    decision === "accepted" ||
    (joinedStatus &&
      (joinedStatus === "accepted" || joinedStatus === "active"))
  ) {
    return "active";
  }
  return "pending";
}

/**
 * Whether a terminal joined status should trigger a redirect to home.
 * Only redirect for truly terminal states where there's no history to view.
 */
export function shouldRedirect(joinedStatus: string | null): boolean {
  if (!joinedStatus) return false;
  if (joinedStatus === "accepted" || joinedStatus === "active") return false;
  if (COMPLETED_STATES.includes(joinedStatus)) return false;
  return TERMINAL_REDIRECT.includes(joinedStatus);
}
