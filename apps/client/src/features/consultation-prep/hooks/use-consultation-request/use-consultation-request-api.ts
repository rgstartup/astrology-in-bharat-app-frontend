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
}

/**
 * Initiates a consultation through apiV2 and handles retry and domain errors.
 * Returns consultation metadata on success; returns null on failure/abort so
 * the application layer can decide whether to proceed to the socket request.
 *
 * @param options - Consultation inputs and state/request callbacks.
 * @returns A callback that runs the API initiation and returns metadata.
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
}: ConsultationRequestApiOptions) {
  return useCallback(
    async (metadata: SomeoneElseData | null): Promise<{
      consultationId: number;
      sessionId: number;
      requestExpiresInSec: number;
      maxMinutes?: number;
    } | null> => {
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
          return null;
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
            return null;
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
            return null;
          }

          if (controller.signal.aborted) {
            setIsWaiting(false);
            return null;
          }
          return {
            consultationId: retry.data.consultationId,
            sessionId: retry.data.sessionId,
            requestExpiresInSec: retry.data.requestExpiresInSec,
            maxMinutes: retry.data.maxMinutes,
          };
        }

        if (!result.ok) {
          setIsWaiting(false);
          if (
            result.code === ConsultationErrorCode.EXPERT_BUSY_IN_CONSULTATION
          ) {
            toast.error(
              "Expert is busy in a consultation. Please try again later.",
            );
            return null;
          }
          if (result.code === ConsultationErrorCode.INSUFFICIENT_BALANCE) {
            onInsufficientBalance();
            return null;
          }
          if (result.code === ConsultationErrorCode.PRICE_NOT_FOUND) {
            const label =
              mode === "voice" ? "voice consultations" : "chat consultations";
            toast.error(`This expert does not offer ${label}.`);
            return null;
          }
          if (result.code === ConsultationErrorCode.EXPERT_UNAVAILABLE) {
            toast.error(
              "This expert is currently unavailable. Please try again later.",
            );
            return null;
          }
          toast.error(
            result.message || "Failed to start consultation. Please try again.",
          );
          return null;
        }

        if (controller.signal.aborted) {
          setIsWaiting(false);
          return null;
        }
        return {
          consultationId: result.data.consultationId,
          sessionId: result.data.sessionId,
          requestExpiresInSec: result.data.requestExpiresInSec,
          maxMinutes: result.data.maxMinutes,
        };
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
    ],
  );
}
