"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { IExpert } from "@repo/lib";
import { ConsultationErrorCode } from "@repo/lib";
import { apiV2, API_ROUTES } from "@/actions";
import {
  type InitiateConsultationData,
  type InitiateConsultationErrorBody,
  type InitiateConsultationResult,
  type SomeoneElseData,
} from "@/actions/chat";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import {
  requestConsultation,
  mediaReady,
} from "@/realtime/topics/consultation";
import { CHAT_STATUS } from "@/realtime/types/chat";
import type { ConsultationWaitStep } from "../components/consultation-wait-stepper.component";
import { useVerdictWait } from "./use-verdict-wait";
import { useGoToRoom } from "./use-go-to-room";
import { useAuthStore } from "@/store/authStore";
import { useVoiceSessionStore } from "@/store/voiceSessionStore";

export interface ConsultationRequestOptions {
  expertId: string;
  mode: ConsultationMode;
  expert: Partial<IExpert> | null;
  /** Trips the prep modal's forced-recharge step on INSUFFICIENT_BALANCE. */
  onInsufficientBalance: () => void;
  /** Existing consultation to re-initiate into (e.g. continue chat). */
  consultationId?: number | null;
}

/**
 * Consultation request protocol:
 * Step 1: Microphone access preflight and grant via getUserMedia.
 * Step 2: Request initiate + socket emit, wait for expert accept verdict.
 * Step 3: Establish Agora RTC session via @repo/rtc, store in voiceSessionStore,
 *         emit consultation:media_ready, run 3-second countdown, and redirect to room.
 *
 * @param options - Expert ID, mode, expert details, and low-balance handler.
 * @returns State flags, step transitions, and initiate handler.
 */
export function useConsultationRequest({
  expertId,
  mode,
  expert,
  onInsufficientBalance,
  consultationId,
}: ConsultationRequestOptions) {
  const [actionLoading, setActionLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitStep, setWaitStep] =
    useState<ConsultationWaitStep>("waiting_acceptance");
  const [micGranted, setMicGranted] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );
  const [existingChatDetails, setExistingChatDetails] = useState<{
    consultationId: number;
    expertId: string;
  } | null>(null);

  const pendingMetadataRef = useRef<SomeoneElseData | null>(null);
  const pendingCredentialsRef = useRef<{
    consultationId: number;
    sessionId: number;
    token?: string;
    channelName?: string;
  } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const verdictWait = useVerdictWait();
  const goToRoom = useGoToRoom(expert);
  const user = useAuthStore((s) => s.user);

  /**
   * Step 1: Real mic check using navigator.mediaDevices.getUserMedia({ audio: true }).
   *
   * @returns True if granted, false on error or denial.
   */
  const checkMicPermission = useCallback(async (): Promise<boolean> => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setMicDenied(true);
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicGranted(true);
      setMicDenied(false);
      return true;
    } catch {
      setMicGranted(false);
      setMicDenied(true);
      return false;
    }
  }, []);

  /**
   * Step 3: Join Agora RTC channel using @repo/rtc createDefaultRtcSession().
   *
   * @param consultationId - ID of consultation room.
   * @param sessionId - Session ID.
   * @param token - Agora RTC voice token.
   * @param channelName - Target channel name.
   */
  const connectMediaAndEnterRoom = useCallback(
    async (
      consultationId: number,
      sessionId: number,
      token?: string,
      channelName?: string,
    ) => {
      setWaitStep("connecting_media");
      setMediaFailed(false);
      setMediaError(null);

      try {
        const { createDefaultRtcSession } = await import("@repo/rtc");
        const session = createDefaultRtcSession();
        const identity = user?.id
          ? `client_${user.id}_consult_${consultationId}`
          : `client_${consultationId}`;
        const roomName = channelName || `consultation_${consultationId}`;

        let tokenValue = token;
        let finalChannel = roomName;

        if (!tokenValue) {
          const { joinCall } = await import("@/realtime/topics/call");
          const ack = await joinCall(consultationId);
          tokenValue = ack.token ?? undefined;
          finalChannel = ack.channelName ?? roomName;
        }

        if (!tokenValue) {
          throw new Error("Could not acquire media connection token.");
        }

        await session.join({
          roomName: finalChannel,
          identity,
          kind: mode === "video" ? "video" : "voice",
          token: tokenValue,
        });

        // Store active session in voiceSessionStore to bridge route transition
        useVoiceSessionStore.getState().setSession(session, consultationId);

        // Tell backend media is ready so billing starts once peer is ready
        mediaReady(consultationId);

        // Step 3 ready: start 3s countdown
        setWaitStep("ready");
        setRedirectCountdown(3);

        await new Promise<void>((resolve) => {
          let count = 3;
          const interval = setInterval(() => {
            count -= 1;
            if (count <= 0) {
              clearInterval(interval);
              setRedirectCountdown(0);
              resolve();
            } else {
              setRedirectCountdown(count);
            }
          }, 1000);
        });

        goToRoom(expertId, sessionId, consultationId);
      } catch (err) {
        setMediaFailed(true);
        setMediaError(
          err instanceof Error ? err.message : "Media connection failed.",
        );
        useVoiceSessionStore.getState().clearSession();
      }
    },
    [expertId, goToRoom, mode, user?.id],
  );

  /**
   * Step 2: Emit consultation:request and wait for expert accept verdict.
   *
   * @param consultationId - ID of created consultation.
   * @param sessionId - Session ID.
   * @param expiresInSec - Waiting window in seconds.
   * @param maxMinutes - Affordable consultation minutes.
   */
  const sendConsultationRequest = useCallback(
    async (
      consultationId: number,
      sessionId: number,
      expiresInSec: number,
      maxMinutes?: number,
    ) => {
      setWaitStep("waiting_acceptance");
      setRedirectCountdown(null);

      if (abortControllerRef.current?.signal.aborted) {
        setIsWaiting(false);
        return;
      }

      try {
        const ack = await requestConsultation(consultationId, Number(expertId));
        if (abortControllerRef.current?.signal.aborted) {
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

      if (typeof window !== "undefined") {
        if (typeof maxMinutes === "number" && maxMinutes > 0) {
          window.sessionStorage.setItem(
            `chat:budget:${consultationId}`,
            String(maxMinutes),
          );
        }
        window.sessionStorage.setItem(
          `chat:pending:${consultationId}`,
          new Date(Date.now() + expiresInSec * 1000).toISOString(),
        );
      }

      const res = await verdictWait.waitVerdict(consultationId, expiresInSec);

      if (res.verdict === "accepted") {
        const token = res.payload?.token;
        const channelName = res.payload?.channelName;

        pendingCredentialsRef.current = {
          consultationId,
          sessionId,
          token,
          channelName,
        };

        if (mode === "voice" || mode === "video") {
          await connectMediaAndEnterRoom(
            consultationId,
            sessionId,
            token,
            channelName,
          );
        } else {
          goToRoom(expertId, sessionId, consultationId);
        }
      } else {
        setIsWaiting(false);
      }
    },
    [connectMediaAndEnterRoom, expertId, goToRoom, mode, verdictWait],
  );

  /**
   * Execute initiate action with error mapping.
   *
   * @param metadata - Kundli details or null.
   */
  const executeInitiate = useCallback(
    async (metadata: SomeoneElseData | null) => {
      if (
        !abortControllerRef.current ||
        abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current = new AbortController();
      }
      const controller = abortControllerRef.current;
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

        const res: InitiateConsultationResult = apiRes.ok
          ? { ok: true, data: apiRes.data }
          : {
              ok: false,
              code: apiRes.error?.errorCode ?? apiRes.error?.body?.errorCode,
              message:
                apiRes.error?.message ??
                "Failed to start consultation. Please try again.",
              body: apiRes.error?.body,
            };

        if (!res.ok) {
          const errCode = res.code;
          const errorBody = res.body;

          if (
            errCode === ConsultationErrorCode.ACTIVE_CONSULTATION_EXISTS &&
            errorBody?.existingConsultationId != null
          ) {
            setExistingChatDetails({
              consultationId: errorBody.existingConsultationId,
              expertId: String(errorBody.existingExpertId ?? expertId),
            });

            const retryApiRes = await apiV2.post<
              InitiateConsultationData,
              InitiateConsultationErrorBody
            >(
              API_ROUTES.CONSULTATION.INITIATE,
              {
                expert_id: Number(expertId),
                mode,
                consultation_id: errorBody.existingConsultationId,
                ...(metadata ? { metadata } : {}),
              },
              { controller },
            );

            if (controller.signal.aborted) {
              setIsWaiting(false);
              return;
            }

            const retry: InitiateConsultationResult = retryApiRes.ok
              ? { ok: true, data: retryApiRes.data }
              : {
                  ok: false,
                  code:
                    retryApiRes.error?.errorCode ??
                    retryApiRes.error?.body?.errorCode,
                  message:
                    retryApiRes.error?.message ??
                    "Failed to start consultation. Please try again.",
                  body: retryApiRes.error?.body,
                };

            if (!retry.ok) {
              if (retry.code === ConsultationErrorCode.INSUFFICIENT_BALANCE) {
                onInsufficientBalance();
                setIsWaiting(false);
                return;
              }
              toast.error(retry.message);
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

          setIsWaiting(false);

          if (errCode === ConsultationErrorCode.EXPERT_BUSY_IN_CONSULTATION) {
            toast.error(
              "Expert is busy in a consultation. Please try again later.",
            );
            return;
          }

          if (errCode === ConsultationErrorCode.INSUFFICIENT_BALANCE) {
            onInsufficientBalance();
            return;
          }

          if (errCode === ConsultationErrorCode.PRICE_NOT_FOUND) {
            const modeLabel =
              mode === "voice" ? "voice consultations" : "chat consultations";
            toast.error(`This expert does not offer ${modeLabel}.`);
            return;
          }

          if (errCode === ConsultationErrorCode.EXPERT_UNAVAILABLE) {
            toast.error(
              "This expert is currently unavailable. Please try again later.",
            );
            return;
          }

          toast.error(
            res.message || "Failed to start consultation. Please try again.",
          );
          return;
        }

        if (controller.signal.aborted) {
          setIsWaiting(false);
          return;
        }
        await sendConsultationRequest(
          res.data.consultationId,
          res.data.sessionId,
          res.data.requestExpiresInSec,
          res.data.maxMinutes,
        );
      } finally {
        setActionLoading(false);
      }
    },
    [
      expertId,
      mode,
      onInsufficientBalance,
      consultationId,
      sendConsultationRequest,
    ],
  );

  /**
   * Main initiate protocol handler: checks Step 1 for voice/video then executes Step 2.
   *
   * @param metadata - Form data for someone else or null.
   */
  const initiate = useCallback(
    async (metadata: SomeoneElseData | null) => {
      pendingMetadataRef.current = metadata;
      setMicDenied(false);
      setMediaFailed(false);
      setMediaError(null);
      setIsWaiting(true);
      abortControllerRef.current = new AbortController();

      if (mode === "voice" || mode === "video") {
        setWaitStep("mic_access");
        const granted = await checkMicPermission();
        if (!granted || abortControllerRef.current?.signal.aborted) {
          if (abortControllerRef.current?.signal.aborted) {
            setIsWaiting(false);
          }
          return;
        }
      }

      if (abortControllerRef.current?.signal.aborted) {
        setIsWaiting(false);
        return;
      }

      await executeInitiate(metadata);
    },
    [checkMicPermission, executeInitiate, mode],
  );

  /**
   * User tapped "Allow microphone" or "Try Again" after initial denial.
   */
  const handleGrantMic = useCallback(async () => {
    setWaitStep("mic_access");
    setMicDenied(false);
    const granted = await checkMicPermission();
    if (granted) {
      await executeInitiate(pendingMetadataRef.current);
    }
  }, [checkMicPermission, executeInitiate]);

  /**
   * User tapped "Retry Connection" after media join failure.
   */
  const handleRetryMedia = useCallback(async () => {
    const creds = pendingCredentialsRef.current;
    if (creds) {
      await connectMediaAndEnterRoom(
        creds.consultationId,
        creds.sessionId,
        creds.token,
        creds.channelName,
      );
    }
  }, [connectMediaAndEnterRoom]);

  const cancelWaiting = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    verdictWait.cancelWaiting();
    setIsWaiting(false);
    setActionLoading(false);
    setWaitStep("waiting_acceptance");
    setMicDenied(false);
    setMediaFailed(false);
    setMediaError(null);
    useVoiceSessionStore.getState().clearSession();
  }, [verdictWait]);

  const clearWaiting = useCallback(() => {
    verdictWait.clearWaiting();
    setIsWaiting(false);
    setWaitStep("waiting_acceptance");
    setMicDenied(false);
    setMediaFailed(false);
    setMediaError(null);
  }, [verdictWait]);

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
    mediaFailed,
    mediaError,
    onGrantMic: handleGrantMic,
    onRetryMic: handleGrantMic,
    onRetryMedia: handleRetryMedia,
    redirectCountdown,
    existingChatDetails,
    setExistingChatDetails,
    initiate,
  };
}
