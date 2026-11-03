import { useMemo } from "react";
import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ConsultationStatePayload } from "@/realtime/types/consultation";
import type { ChatEndedPayload } from "@/realtime/types/chat";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";
import { calculateSessionTiming } from "../application/consultation-timing";

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
  return useMemo(
    () =>
      calculateSessionTiming({
        sessions,
        consultationState,
        decision,
        joinedStatus,
        endedVerdict,
        elapsedTime,
        timeLeft,
      }),
    [
      sessions,
      consultationState,
      decision,
      joinedStatus,
      endedVerdict,
      elapsedTime,
      timeLeft,
    ],
  );
}
