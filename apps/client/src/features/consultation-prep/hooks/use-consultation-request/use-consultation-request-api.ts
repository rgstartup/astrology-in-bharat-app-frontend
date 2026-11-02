import { useCallback } from "react";
import { toast } from "@repo/design/shadcn";
import { ConsultationErrorCode } from "@repo/lib";
import { apiV2, API_ROUTES } from "@/actions";
import type {
  InitiateConsultationData,
  InitiateConsultationErrorBody,
  InitiateConsultationResult,
  SomeoneElseData,
} from "@/actions/chat";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";
import type { ExistingConsultationDetails } from "./types";

interface ConsultationRequestApiOptions {
  expertId: string;
  mode: ConsultationMode;
  consultationId?: number | null;
  onInsufficientBalance: () => void;
  setIsWaiting: (waiting: boolean) => void;
  setActionLoading: (loading: boolean) => void;
  setExistingChatDetails: (details: ExistingConsultationDetails) => void;
  getAbortController: () => AbortController;
  sendConsultationRequest: (
    consultationId: number,
    sessionId: number,
    expiresInSec: number,
    maxMinutes?: number,
  ) => Promise<void>;
}

/**
 * Initiates a consultation through apiV2 and handles retry and domain errors.
 *
 * @param options - Consultation inputs and state/request callbacks.
 * @returns A callback that starts the API portion of the request protocol.
 */
export function useConsultationRequestApi({
  expertId,
  mode,
  consultationId,
  onInsufficientBalance,
  setIsWaiting,
  setActionLoading,
  setExistingChatDetails,
  getAbortController,
  sendConsultationRequest,
}: ConsultationRequestApiOptions) {
  return useCallback(
    async (metadata: SomeoneElseData | null) => {
      const controller = getAbortController();
      setActionLoading(true);
      try {
        const apiRes = await apiV2.post<
          InitiateConsultationData,
          InitiateConsultationErrorBody
        >(
          API_ROUTES.CONSULTATION.INITIATE,
          {
            expert_id: Number(expertId),
            mode,
            ...(consultationId != null
              ? { consultation_id: consultationId }
              : {}),
            ...(metadata ? { metadata } : {}),
          },
          { controller },
        );
        if (controller.signal.aborted) {
          setIsWaiting(false);
          return;
        }

        const result: InitiateConsultationResult = apiRes.ok
          ? { ok: true, data: apiRes.data }
          : {
              ok: false,
              code: apiRes.error?.errorCode ?? apiRes.error?.body?.errorCode,
              message:
                apiRes.error?.message ??
                "Failed to start consultation. Please try again.",
              body: apiRes.error?.body,
            };

        if (
          !result.ok &&
          result.code === ConsultationErrorCode.ACTIVE_CONSULTATION_EXISTS &&
          result.body?.existingConsultationId != null
        ) {
          const existingId = result.body.existingConsultationId;
          setExistingChatDetails({
            consultationId: existingId,
            expertId: String(result.body.existingExpertId ?? expertId),
          });

          const retryRes = await apiV2.post<
            InitiateConsultationData,
            InitiateConsultationErrorBody
          >(
            API_ROUTES.CONSULTATION.INITIATE,
            {
              expert_id: Number(expertId),
              mode,
              consultation_id: existingId,
              ...(metadata ? { metadata } : {}),
            },
            { controller },
          );
          if (controller.signal.aborted) {
            setIsWaiting(false);
            return;
          }

          const retry: InitiateConsultationResult = retryRes.ok
            ? { ok: true, data: retryRes.data }
            : {
                ok: false,
                code:
                  retryRes.error?.errorCode ?? retryRes.error?.body?.errorCode,
                message:
                  retryRes.error?.message ??
                  "Failed to start consultation. Please try again.",
                body: retryRes.error?.body,
              };
          if (!retry.ok) {
            if (retry.code === ConsultationErrorCode.INSUFFICIENT_BALANCE)
              onInsufficientBalance();
            else toast.error(retry.message);
            setIsWaiting(false);
            return;
          }

          if (controller.signal.aborted) {
            setIsWaiting(false);
            return;
          }
          await sendConsultationRequest(
            retry.data.consultationId,
            retry.data.sessionId,
            retry.data.requestExpiresInSec,
            retry.data.maxMinutes,
          );
          return;
        }

        if (!result.ok) {
          setIsWaiting(false);
          if (
            result.code === ConsultationErrorCode.EXPERT_BUSY_IN_CONSULTATION
          ) {
            toast.error(
              "Expert is busy in a consultation. Please try again later.",
            );
            return;
          }
          if (result.code === ConsultationErrorCode.INSUFFICIENT_BALANCE) {
            onInsufficientBalance();
            return;
          }
          if (result.code === ConsultationErrorCode.PRICE_NOT_FOUND) {
            const label =
              mode === "voice" ? "voice consultations" : "chat consultations";
            toast.error(`This expert does not offer ${label}.`);
            return;
          }
          if (result.code === ConsultationErrorCode.EXPERT_UNAVAILABLE) {
            toast.error(
              "This expert is currently unavailable. Please try again later.",
            );
            return;
          }
          toast.error(
            result.message || "Failed to start consultation. Please try again.",
          );
          return;
        }

        if (controller.signal.aborted) {
          setIsWaiting(false);
          return;
        }
        await sendConsultationRequest(
          result.data.consultationId,
          result.data.sessionId,
          result.data.requestExpiresInSec,
          result.data.maxMinutes,
        );
      } finally {
        setActionLoading(false);
      }
    },
    [
      expertId,
      mode,
      consultationId,
      onInsufficientBalance,
      setIsWaiting,
      setActionLoading,
      setExistingChatDetails,
      getAbortController,
      sendConsultationRequest,
    ],
  );
}
