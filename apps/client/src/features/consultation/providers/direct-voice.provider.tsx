"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useDirectVoice } from "../hooks/use-direct-voice";
import { useConsultationMedia } from "../hooks/use-consultation-media";

import { VoiceCancelDialog } from "../components/voice/voice-cancel-dialog";
import type { SessionDockProps } from "../components/session/session-dock";
import type { SessionPhase } from "../types/session-phase";

import { formatTime } from "../utils/format-time";
import { useRoomLifecycle } from "./room-lifecycle.provider";
import { useSwitchToVoiceContext } from "./switch-to-voice.provider";
import { useVoiceCancelActions } from "./use-voice-cancel-actions";

export interface DirectVoiceContextValue {
  directVoice: ReturnType<typeof useDirectVoice>;
  isDirectVoice: boolean;
  showVoiceStage: boolean;
  dockProps: SessionDockProps | null;
  openVoiceCancel: () => void;
}

const DirectVoiceContext = createContext<DirectVoiceContextValue | null>(null);

export interface DirectVoiceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider managing direct voice consultation lifecycle: Agora connection,
 * media readiness, billing-hold synchronization, and voice cancellation / switch-to-chat dialogs.
 *
 * @param props - Provider children
 */
export function DirectVoiceProvider({ children }: DirectVoiceProviderProps) {
  const {
    roomConsultationId,
    user,
    sessionStatus,
    decision,
    acceptedVoiceToken,
    isSessionEnded,
    pausedState,
    roomMode,
    elapsedTime,
    pauseLiveChat,
    resumeLiveChat,
    refreshSessions,
    setVoiceLive,
  } = useRoomLifecycle();

  const { voice, displayVoiceRate } = useSwitchToVoiceContext();

  const [micConfirmed] = useState<boolean>(true);

  const media = useConsultationMedia({
    consultationId: roomConsultationId ?? 0,
    actorType: "client",
  });

  const isDirectVoice = roomMode === "voice";

  const directVoice = useDirectVoice({
    consultationId: roomConsultationId,
    userId: user?.id ?? null,
    sessionStatus,
    decision,
    enabled:
      isDirectVoice &&
      micConfirmed &&
      !isSessionEnded &&
      (pausedState === null || pausedState.reason === "billing_hold"),
    voiceToken: acceptedVoiceToken,
    onLocalReady: media.setLocalReady,
    ended: isSessionEnded,
  });

  // Gate the room timer on RTC liveness for direct voice mode: paused while
  // connecting, active once live. Chat mode leaves voiceLive true (default).
  useEffect(() => {
    if (!isDirectVoice) {
      setVoiceLive(true);
      return;
    }
    setVoiceLive(directVoice.phase === "live");
  }, [isDirectVoice, directVoice.phase, setVoiceLive]);

  const {
    voiceCancelOpen,
    voiceCancelBusy,
    openVoiceCancel,
    handleVoiceCancelOpenChange,
    handleVoiceContinueOverChat,
    handleVoiceEndSession,
  } = useVoiceCancelActions({
    sessionStatus,
    pauseLiveChat,
    resumeLiveChat,
    refreshSessions,
    directVoice,
  });

  const showVoiceStage =
    !isSessionEnded &&
    !voice.minimized &&
    (voice.voiceActive ||
      (isDirectVoice && directVoice.active && directVoice.phase !== "ended"));

  const dockProps: SessionDockProps | null = useMemo(() => {
    if (
      isSessionEnded ||
      directVoice.phase === "ended" ||
      !directVoice.active
    ) {
      return null;
    }
    if (isDirectVoice) {
      return {
        kind: "voice",
        phase: directVoice.phase as SessionPhase,
        elapsedText: formatTime(elapsedTime),
        rate: displayVoiceRate,
        muted: directVoice.muted,
        onToggleMute: () => void directVoice.toggleMic(),
        speakerMuted: directVoice.speakerMuted,
        onToggleSpeaker: () => void directVoice.toggleSpeaker(),
        onEnd: openVoiceCancel,
        onCancelRequest: openVoiceCancel,
      };
    }
    return null;
  }, [
    isSessionEnded,
    isDirectVoice,
    directVoice,
    elapsedTime,
    displayVoiceRate,
    openVoiceCancel,
  ]);

  const contextValue = useMemo<DirectVoiceContextValue>(
    () => ({
      directVoice,
      isDirectVoice,
      showVoiceStage,
      dockProps,
      openVoiceCancel,
    }),
    [directVoice, isDirectVoice, showVoiceStage, dockProps, openVoiceCancel],
  );

  return (
    <DirectVoiceContext.Provider value={contextValue}>
      <VoiceCancelDialog
        open={voiceCancelOpen}
        onOpenChange={handleVoiceCancelOpenChange}
        onContinueOverChat={() => {
          void handleVoiceContinueOverChat();
        }}
        onEndSession={() => {
          void handleVoiceEndSession();
        }}
        busy={voiceCancelBusy}
      />
      {children}
    </DirectVoiceContext.Provider>
  );
}

/**
 * Hook to access direct voice consultation context.
 *
 * @returns DirectVoiceContextValue
 * @throws Error if used outside DirectVoiceProvider
 */
export function useDirectVoiceContext(): DirectVoiceContextValue {
  const context = useContext(DirectVoiceContext);
  if (!context) {
    throw new Error(
      "useDirectVoiceContext must be used within a DirectVoiceProvider",
    );
  }
  return context;
}
