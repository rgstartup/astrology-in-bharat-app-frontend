"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatIncoming } from "@/realtime/hooks/use-chat-incoming";
import { useVoiceSession } from "@/realtime/hooks/use-voice-session";
import { useConsultationMedia } from "@/realtime/hooks/use-consultation-media";
import { realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import { ChatIncomingCard } from "./chat-incoming-card";
import {
  ExpertCallWaitingModal,
  type ExpertWaitStep,
} from "@/components/consultation/expert-call-waiting-modal.component";
import type {
  ClientIntakeProfile,
  ExpertSessionKind,
} from "@/components/consultation/types";
import type { ChatIncomingPayload } from "@/realtime/types/chat";

/**
 * Floating stack of incoming consultation requests with review modal.
 *
 * Appears whenever any join request (chat, voice, video) is received.
 * Cards show compact details in bottom-right. Clicking a card opens
 * the ExpertCallWaitingModal to review devotee details and accept/reject.
 */
export function ChatIncomingStack() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { pending, accept, reject, dismiss, voiceToken } = useChatIncoming();
  const voice = useVoiceSession();

  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const [micGranted, setMicGranted] = useState(false);
  const [callWaitSteps, setCallWaitSteps] = useState<Record<number, ExpertWaitStep>>({});
  const [callCountdowns, setCallCountdowns] = useState<Record<number, number | null>>({});
  const [cancelledMap, setCancelledMap] = useState<Record<number, boolean>>({});
  const [timedOutMap, setTimedOutMap] = useState<Record<number, boolean>>({});

  // Keep reference to recent incoming payloads so modal displays devotee details even after settle
  const recentRequestsRef = useRef<Map<number, ChatIncomingPayload>>(new Map());

  useEffect(() => {
    pending.forEach((req) => {
      recentRequestsRef.current.set(req.consultationId, req);
    });
  }, [pending]);

  // Bilateral media readiness monitoring for active consultation
  const media = useConsultationMedia({
    consultationId: activeModalId,
    actorType: "expert",
  });

  // Query microphone permission state on mount
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions) return;
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (status.state === "granted") {
          setMicGranted(true);
        }
        status.onchange = () => {
          if (status.state === "granted") {
            setMicGranted(true);
          }
        };
      })
      .catch(() => undefined);
  }, []);

  // Listen for consultation cancellation
  useEffect(() => {
    const socket = realtimeSocket();
    const onCancelled = (p: { consultationId: number | string }) => {
      if (p?.consultationId == null) return;
      const cid = Number(p.consultationId);
      if (activeModalId === cid) {
        setCancelledMap((prev) => ({ ...prev, [cid]: true }));
      }
    };

    socket.on(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
    };
  }, [activeModalId]);

  // Real microphone permission probe
  const handleGrantMic = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicGranted(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicGranted(true);
    } catch (err) {
      console.warn("Microphone access denied:", err);
      toast.error("Microphone access is required for voice and video consultations");
    }
  };

  const handleOpenModal = (consultationId: number) => {
    setActiveModalId(consultationId);
  };

  const handleCloseModal = () => {
    if (activeModalId !== null) {
      const cid = activeModalId;
      dismiss(cid);
      setCallWaitSteps((prev) => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
      setCallCountdowns((prev) => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
      setCancelledMap((prev) => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
      setTimedOutMap((prev) => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
    }
    setActiveModalId(null);
  };

  const startReadyCountdown = useCallback(
    (consultationId: number, kind: ExpertSessionKind) => {
      setCallWaitSteps((prev) => ({ ...prev, [consultationId]: "ready" }));
      setCallCountdowns((prev) => ({ ...prev, [consultationId]: 3 }));

      const interval = window.setInterval(() => {
        setCallCountdowns((prev) => {
          const current = prev[consultationId];
          if (current === null || current === undefined || current <= 1) {
            window.clearInterval(interval);
            dismiss(consultationId);
            // Drop the step latched during this accept so a later REOPENED
            // request for the same consultation id opens a fresh modal
            // instead of rendering the previous "accepted" state.
            setCallWaitSteps((p) => {
              const next = { ...p };
              delete next[consultationId];
              return next;
            });
            setCallCountdowns((p) => {
              const next = { ...p };
              delete next[consultationId];
              return next;
            });
            setActiveModalId(null);
            router.push(`/dashboard/consultations/${consultationId}?mode=${kind}`);
            return { ...prev, [consultationId]: 0 };
          }
          return { ...prev, [consultationId]: current - 1 };
        });
      }, 1000);
    },
    [dismiss, router],
  );

  const handleAccept = async (
    consultationId: number,
    sessionId: number | null,
    kind: ExpertSessionKind,
  ) => {
    setCallWaitSteps((prev) => ({ ...prev, [consultationId]: "connecting_media" }));
    const ack = await accept(consultationId, sessionId, false);

    if (ack.status === "accepted") {
      if (kind === "voice" || kind === "video") {
        const tokenVal = ack.token ?? voiceToken.token;
        const channelVal = ack.channelName ?? voiceToken.channelName;
        const expiresVal = ack.tokenExpiresAt ?? voiceToken.tokenExpiresAt;
        const expertId = user?.id;
        const identity =
          expertId != null
            ? `expert_${expertId}_consult_${consultationId}`
            : `expert_consult_${consultationId}`;

        if (tokenVal && channelVal) {
          try {
            await voice.join(
              consultationId,
              identity,
              {
                token: tokenVal,
                channelName: channelVal,
                tokenExpiresAt: expiresVal,
              },
              () => {
                media.setLocalReady();
              },
            );
          } catch (err) {
            console.error("Agora join failed in modal:", err);
          }
        }
      } else {
        // Chat mode: ready immediately without media connection
        startReadyCountdown(consultationId, kind);
      }
    } else {
      // Accept ack failure (settled elsewhere / terminal status): unlatch the
      // step instead of freezing the modal on the "accepted" row.
      setCallWaitSteps((prev) => {
        const next = { ...prev };
        delete next[consultationId];
        return next;
      });
      setCallCountdowns((prev) => {
        const next = { ...prev };
        delete next[consultationId];
        return next;
      });
      toast.error("Could not accept the consultation request");
    }
  };

  // Watch for bilateral media readiness or fallback when connecting media
  useEffect(() => {
    if (activeModalId === null) return;
    const currentStep = callWaitSteps[activeModalId];
    if (currentStep !== "connecting_media") return;

    const activeReq =
      pending.find((req) => req.consultationId === activeModalId) ??
      recentRequestsRef.current.get(activeModalId);
    const resolvedKind: ExpertSessionKind =
      activeReq?.mode ?? (activeReq?.token || activeReq?.channelName ? "voice" : "chat");

    if (media.bothReady) {
      startReadyCountdown(activeModalId, resolvedKind);
      return;
    }

    // Safety fallback: if devotee media_ready is slightly delayed, proceed after 5 seconds
    const fallbackTimer = window.setTimeout(() => {
      startReadyCountdown(activeModalId, resolvedKind);
    }, 5000);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [activeModalId, callWaitSteps, media.bothReady, pending, startReadyCountdown]);

  const handleReject = async (consultationId: number) => {
    if (activeModalId === consultationId) {
      setActiveModalId(null);
    }
    setCallWaitSteps((prev) => {
      const next = { ...prev };
      delete next[consultationId];
      return next;
    });
    setCallCountdowns((prev) => {
      const next = { ...prev };
      delete next[consultationId];
      return next;
    });
    await reject(consultationId);
  };

  const handleCardExpire = (consultationId: number) => {
    if (activeModalId === consultationId) {
      setTimedOutMap((prev) => ({ ...prev, [consultationId]: true }));
    }
    dismiss(consultationId);
  };

  const activeRequest =
    (activeModalId !== null
      ? pending.find((req) => req.consultationId === activeModalId)
      : null) ??
    (activeModalId !== null ? recentRequestsRef.current.get(activeModalId) : null);

  if (pending.length === 0 && activeModalId === null) return null;

  return (
    <>
      {/* Floating Incoming Cards Stack (Bottom-Right) */}
      <aside
        aria-label="Incoming consultations"
        aria-live="polite"
        className="fixed right-4 bottom-4 z-40 flex flex-col gap-2.5"
      >
        {pending.map((req) => (
          <ChatIncomingCard
            key={req.consultationId}
            request={req}
            onOpenModal={handleOpenModal}
            onReject={handleReject}
            onExpire={handleCardExpire}
          />
        ))}
      </aside>

      {/* Review & Waiting Modal */}
      {activeRequest && activeModalId !== null && (
        <ActiveRequestModalOverlay
          request={activeRequest}
          step={callWaitSteps[activeRequest.consultationId]}
          countdown={callCountdowns[activeRequest.consultationId] ?? null}
          timedOut={Boolean(timedOutMap[activeRequest.consultationId])}
          cancelled={Boolean(cancelledMap[activeRequest.consultationId])}
          micGranted={micGranted}
          onGrantMic={handleGrantMic}
          onAccept={(resolvedKind) =>
            void handleAccept(
              activeRequest.consultationId,
              activeRequest.sessionId ?? null,
              resolvedKind,
            )
          }
          onDecline={() => void handleReject(activeRequest.consultationId)}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

/**
 * Modal overlay containing ExpertCallWaitingModal.
 */
function ActiveRequestModalOverlay({
  request,
  step,
  countdown,
  timedOut,
  cancelled,
  micGranted,
  onGrantMic,
  onAccept,
  onDecline,
  onClose,
}: {
  request: ChatIncomingPayload;
  step?: ExpertWaitStep;
  countdown: number | null;
  timedOut?: boolean;
  cancelled?: boolean;
  micGranted: boolean;
  onGrantMic: () => void;
  onAccept: (kind: ExpertSessionKind) => void;
  onDecline: () => void;
  onClose: () => void;
}) {
  const resolvedKind: ExpertSessionKind =
    request.mode ?? (request.token || request.channelName ? "voice" : "chat");

  const clientProfile: ClientIntakeProfile = {
    name: request.clientName ?? `Devotee #${request.clientId}`,
    avatar: request.avatar ?? null,
    gender: request.gender ?? undefined,
    dateOfBirth: request.dateOfBirth ?? undefined,
    timeOfBirth: request.timeOfBirth ?? undefined,
    placeOfBirth: request.placeOfBirth ?? undefined,
    rashi: request.rashi ?? undefined,
    nakshatra: request.nakshatra ?? undefined,
    lagna: request.lagna ?? undefined,
    topic: request.topic ?? undefined,
  };

  let resolvedStep = step;
  if (!resolvedStep) {
    if (resolvedKind === "chat") {
      resolvedStep = "accept_pending";
    } else if (micGranted) {
      resolvedStep = "accept_pending";
    } else {
      resolvedStep = "mic_access";
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Consultation request from ${clientProfile.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ExpertCallWaitingModal
          client={clientProfile}
          kind={resolvedKind}
          step={resolvedStep}
          ratePerMinute={request.ratePerMinute ?? 30}
          micGranted={micGranted}
          countdown={countdown}
          timedOut={timedOut}
          cancelled={cancelled}
          onGrantMic={onGrantMic}
          onAccept={() => onAccept(resolvedKind)}
          onDecline={onDecline}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default ChatIncomingStack;
