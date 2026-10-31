import { useMemo } from "react";
import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ConsultationStatePayload } from "@/realtime/types/consultation";
import type { ChatEndedPayload } from "@/realtime/types/chat";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";

interface UseRoomSessionTimingParams {
  sessions: ChatHistorySessionDto[];
  consultationState: ConsultationStatePayload | null;
  decision: ConsultationDecision | null;
  joinedStatus: string | null;
  endedVerdict: ChatEndedPayload | null;
  elapsedTime: number;
  timeLeft: number | null;
}

interface UseRoomSessionTimingReturn {
  isSessionEnded: boolean;
  endedElapsedSeconds: number | null;
  displayElapsedTime: number;
  displayTimeLeft: number;
}

/**
 * Calculates authoritative ended status and freezes elapsed/remaining times
 * when a consultation completes or expires.
 *
 * @param params - Sessions, live state, verdict, and raw timer values
 * @returns Derived timing and termination state
 */
export function useRoomSessionTiming({
  sessions,
  consultationState,
  decision,
  joinedStatus,
  endedVerdict,
  elapsedTime,
  timeLeft,
}: UseRoomSessionTimingParams): UseRoomSessionTimingReturn {
  const isLiveEnded = consultationState
    ? ["completed", "rejected", "cancelled", "expired"].includes(consultationState.state)
    : false;

  const hasActiveHistorySession = sessions.some((s) => s.status === "active");

  const hasLiveActiveSignal =
    decision === "accepted" ||
    joinedStatus === "accepted" ||
    joinedStatus === "active" ||
    consultationState?.state === "accepted" ||
    consultationState?.state === "active";

  const isHistoryEnded =
    sessions.length > 0 &&
    !hasActiveHistorySession &&
    !hasLiveActiveSignal &&
    sessions.every((s) => s.status === "completed" || s.status === "rejected" || s.status === "cancelled");

  const isSessionEnded = isLiveEnded || isHistoryEnded || Boolean(endedVerdict);

  const endedElapsedSeconds = useMemo(() => {
    if (!isSessionEnded) return null;
    if (endedVerdict && typeof endedVerdict.totalDurationSeconds === "number" && endedVerdict.totalDurationSeconds > 0) {
      return endedVerdict.totalDurationSeconds;
    }
    let total = 0;
    for (const s of sessions) {
      if (s.startedAt && s.endedAt) {
        const ms = new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime();
        if (ms > 0) total += Math.floor(ms / 1000);
      }
    }
    return total > 0 ? total : null;
  }, [isSessionEnded, endedVerdict, sessions]);

  const displayElapsedTime = endedElapsedSeconds ?? elapsedTime;
  const displayTimeLeft = isSessionEnded ? 0 : (timeLeft ?? 0);

  return {
    isSessionEnded,
    endedElapsedSeconds,
    displayElapsedTime,
    displayTimeLeft,
  };
}
