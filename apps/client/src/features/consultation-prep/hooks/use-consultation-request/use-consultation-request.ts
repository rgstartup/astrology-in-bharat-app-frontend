"use client";

import { useCallback, useRef, useState } from "react";
import type { SomeoneElseData } from "@/actions/chat";
import type { ConsultationWaitStep } from "../../components/consultation-wait-stepper.component";
import type { ConsultationRequestOptions } from "./types";
import { executeConsultationRequest } from "../../application";
import { useConsultationRequestApi } from "./use-consultation-request-api";
import { useConsultationRequestDispatch } from "./use-consultation-request-dispatch";
import { useConsultationMicrophone } from "./use-consultation-microphone";

/**
 * Coordinates consultation request state, microphone access, API initiation, and verdict dispatch.
 *
 * Thin React glue over the application layer (`executeConsultationRequest`).
 * All business rules (mic gate, API retry, socket request, verdict wait,
 * room routing) live in the plain orchestration function.
 *
 * @param options - Expert, mode, and callbacks for balance and verdict outcomes.
 * @returns Request state and handlers consumed by the consultation prep flow.
 */
export function useConsultationRequest({
  expertId,
  mode,
  expert,
  onInsufficientBalance,
  consultationId,
  onVerdictResolved,
}: ConsultationRequestOptions) {
  const [actionLoading, setActionLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitStep, setWaitStep] =
    useState<ConsultationWaitStep>("waiting_acceptance");
  const [existingChatDetails, setExistingChatDetails] = useState<{
    consultationId: number;
    expertId: string;
  } | null>(null);

  const pendingMetadataRef = useRef<SomeoneElseData | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const setWaiting = useCallback(
    (waiting: boolean) => setIsWaiting(waiting),
    [],
  );
  const getAbortController = useCallback(() => {
    if (
      !abortControllerRef.current ||
      abortControllerRef.current.signal.aborted
    ) {
      abortControllerRef.current = new AbortController();
    }
    return abortControllerRef.current;
  }, []);
  const isRequestAborted = useCallback(
    () => abortControllerRef.current?.signal.aborted ?? false,
    [],
  );
  const { micGranted, micDenied, checkMicPermission, clearMicDenied } =
    useConsultationMicrophone();

  const { sendConsultationRequest, verdictWait } =
    useConsultationRequestDispatch({
      expertId,
      mode,
      expert,
      setWaitStep,
      setIsWaiting: setWaiting,
      isAborted: isRequestAborted,
      onVerdictResolved,
    });

  const initiateApi = useConsultationRequestApi({
    expertId,
    mode,
    consultationId,
    onInsufficientBalance,
    setIsWaiting: setWaiting,
    setActionLoading,
    setExistingChatDetails,
    getAbortController,
  });

  const deps = {
    checkMicPermission,
    clearMicDenied,
    isAborted: isRequestAborted,
    beginAbort: () => {
      abortControllerRef.current = new AbortController();
    },
    initiateApi,
    sendRequestAndWaitVerdict: sendConsultationRequest,
  };

  const initiate = useCallback(
    async (metadata: SomeoneElseData | null) => {
      pendingMetadataRef.current = metadata;
      clearMicDenied();
      setIsWaiting(true);
      abortControllerRef.current = new AbortController();

      if (mode === "voice" || mode === "video") {
        setWaitStep("mic_access");
        const granted = await checkMicPermission();
        if (!granted || abortControllerRef.current?.signal.aborted) {
          if (abortControllerRef.current?.signal.aborted) setIsWaiting(false);
          return;
        }
      }

      if (abortControllerRef.current?.signal.aborted) {
        setIsWaiting(false);
        return;
      }

      const result = await executeConsultationRequest(deps, metadata, mode);
      setIsWaiting(false);
      if (result?.verdict === "accepted") {
        // Room routing already handled inside sendRequestAndWaitVerdict.
        return;
      }
    },
    [checkMicPermission, deps, mode],
  );

  const handleGrantMic = useCallback(async () => {
    setWaitStep("mic_access");
    clearMicDenied();
    const granted = await checkMicPermission();
    if (granted) await initiate(pendingMetadataRef.current);
  }, [checkMicPermission, clearMicDenied, initiate]);

  const cancelWaiting = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    verdictWait.cancelWaiting();
    setIsWaiting(false);
    setActionLoading(false);
    setWaitStep("waiting_acceptance");
    clearMicDenied();
  }, [clearMicDenied, verdictWait]);

  const clearWaiting = useCallback(() => {
    verdictWait.clearWaiting();
    setIsWaiting(false);
    setWaitStep("waiting_acceptance");
    clearMicDenied();
  }, [clearMicDenied, verdictWait]);

  return {
    actionLoading,
    isWaitingForExpert: isWaiting || verdictWait.isWaitingForExpert,
    cancelWaiting,
    waitOutcome: verdictWait.waitOutcome,
    clearWaiting,
    waitStep,
    setWaitStep,
    micGranted,
    micDenied,
    onGrantMic: handleGrantMic,
    onRetryMic: handleGrantMic,
    existingChatDetails,
    setExistingChatDetails,
    initiate,
  };
}
