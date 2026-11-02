import { useCallback } from "react";
import { toast } from "@repo/design/shadcn";
import { requestConsultation } from "@/realtime/topics/consultation";
import { CHAT_STATUS } from "@/realtime/types/chat";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";
import type { ConsultationWaitStep } from "../../components/consultation-wait-stepper.component";
import { useGoToRoom } from "../use-go-to-room";
import { useVerdictWait } from "../use-verdict-wait";
import { useConsultationRequestStore } from "../../stores/consultation-request-state.store";

interface ConsultationRequestDispatchOptions {
  expertId: string;
  mode: ConsultationMode;
  expert: Parameters<typeof useGoToRoom>[0];
  setWaitStep: (step: ConsultationWaitStep) => void;
  setIsWaiting: (waiting: boolean) => void;
  isAborted: () => boolean;
  onVerdictResolved?: () => void;
}

/**
 * Sends the socket request, persists its waiting window, and routes the expert verdict.
 *
 * @param options - Request mode, expert routing, and waiting state handlers.
 * @returns A callback that dispatches a consultation request and waits for its verdict.
 */
export function useConsultationRequestDispatch({
  expertId,
  mode,
  expert,
  setWaitStep,
  setIsWaiting,
  isAborted,
  onVerdictResolved,
}: ConsultationRequestDispatchOptions) {
  const verdictWait = useVerdictWait();
  const goToRoom = useGoToRoom(expert);
  const setRequestWindow = useConsultationRequestStore(
    (state) => state.setRequestWindow,
  );

  const sendConsultationRequest = useCallback(
    async (
      consultationId: number,
      sessionId: number,
      expiresInSec: number,
      maxMinutes?: number,
    ) => {
      setWaitStep("waiting_acceptance");

      if (isAborted()) {
        setIsWaiting(false);
        return;
      }

      try {
        const ack = await requestConsultation(consultationId, Number(expertId));
        if (isAborted()) {
          setIsWaiting(false);
          return;
        }

        if (
          ack.status !== "requested" &&
          ack.status !== CHAT_STATUS.REQUESTED
        ) {
          toast.error("Expert did not receive your request. Please try again.");
          setIsWaiting(false);
          return;
        }
      } catch {
        toast.error(
          "Could not reach the expert. Please check your connection and try again.",
        );
        setIsWaiting(false);
        return;
      }

      if (isAborted()) {
        setIsWaiting(false);
        return;
      }

      const affordableMinutes =
        typeof maxMinutes === "number" && maxMinutes > 0 ? maxMinutes : null;
      const pendingExpiresAt = new Date(
        Date.now() + expiresInSec * 1000,
      ).toISOString();
      setRequestWindow(consultationId, affordableMinutes, pendingExpiresAt);

      const result = await verdictWait.waitVerdict(
        consultationId,
        expiresInSec,
      );
      if (result.verdict === "accepted") {
        if (mode === "voice" || mode === "video") onVerdictResolved?.();
        goToRoom(expertId, sessionId, consultationId);
        return;
      }

      if (result.verdict !== "cancelled") onVerdictResolved?.();
      setIsWaiting(false);
    },
    [
      expertId,
      goToRoom,
      isAborted,
      mode,
      onVerdictResolved,
      setRequestWindow,
      setIsWaiting,
      setWaitStep,
      verdictWait,
    ],
  );

  return { sendConsultationRequest, verdictWait };
}
