import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ConsultationStatePayload } from "@/realtime/types/consultation";
import type { ChatEndedPayload } from "@/realtime/types/chat";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";

type CalculateTimingParams = {
  sessions: ChatHistorySessionDto[];
  consultationState: ConsultationStatePayload | null;
  decision: ConsultationDecision | null;
  joinedStatus: string | null;
  endedVerdict: ChatEndedPayload | null;
  elapsedTime: number;
  timeLeft: number | null;
};

type CalculateTimingResult = {
  isSessionEnded: boolean;
  endedElapsedSeconds: number | null;
  displayElapsedTime: number;
  displayTimeLeft: number;
};

/**
 * Pure calculation of authoritative ended status and frozen elapsed/remaining
 * times when a consultation completes or expires.
 */
export function calculateSessionTiming({
  sessions,
  consultationState,
  decision,
  joinedStatus,
  endedVerdict,
  elapsedTime,
  timeLeft,
}: CalculateTimingParams): CalculateTimingResult {
  const isLiveEnded = consultationState
    ? ["completed", "rejected", "cancelled", "expired"].includes(
        consultationState.state,
      )
    : false;

  const hasActiveHistorySession = sessions.some((s) => s.status === "active");

  const hasLiveActiveSignal =
    decision === "accepted" ||
    joinedStatus === "accepted" ||
    joinedStatus === "active" ||
    joinedStatus === "paused" ||
    consultationState?.state === "accepted" ||
    consultationState?.state === "active" ||
    consultationState?.state === "paused";

  const isHistoryEnded =
    sessions.length > 0 &&
    !hasActiveHistorySession &&
    !hasLiveActiveSignal &&
    sessions.every(
      (s) =>
        s.status === "completed" ||
        s.status === "rejected" ||
        s.status === "cancelled",
    );

  const isSessionEnded = isLiveEnded || isHistoryEnded || Boolean(endedVerdict);

  let endedElapsedSeconds: number | null = null;
  if (isSessionEnded) {
    if (
      endedVerdict &&
      typeof endedVerdict.totalDurationSeconds === "number" &&
      endedVerdict.totalDurationSeconds > 0
    ) {
      endedElapsedSeconds = endedVerdict.totalDurationSeconds;
    } else {
      let total = 0;
      for (const s of sessions) {
        if (s.startedAt && s.endedAt) {
          const ms =
            new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime();
          if (ms > 0) total += Math.floor(ms / 1000);
        }
      }
      endedElapsedSeconds = total > 0 ? total : null;
    }
  }

  const displayElapsedTime = endedElapsedSeconds ?? elapsedTime;
  const displayTimeLeft = isSessionEnded ? 0 : (timeLeft ?? 0);

  return {
    isSessionEnded,
    endedElapsedSeconds,
    displayElapsedTime,
    displayTimeLeft,
  };
}
