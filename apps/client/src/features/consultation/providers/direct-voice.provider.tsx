"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useDirectVoice } from "../hooks/use-direct-voice";
import { useConsultationMedia } from "../hooks/use-consultation-media";

import { VoiceCancelDialog } from "../components/dialog/voice-cancel-dialog";
import type { SessionDockProps } from "../components/session/session-dock";
import type { SessionPhase } from "../types/session-phase";

import { formatTime } from "../utils/format-time";
import { useRoomLifecycle } from "./room-lifecycle";
import { useSwitchToVoiceContext } from "./switch-to-voice.provider";
import { useVoiceCancelActions } from "./use-voice-cancel-actions";

export interface DirectVoiceContextValue {
  directVoice: ReturnType<typeof useDirectVoice>;
  isDirectVoice: boolean;
  showVoiceStage: boolean;
  /** @deprecated Use context methods directly instead of dockProps */
  dockProps: SessionDockProps | null;
  openVoiceCancel: () => void;

  // Direct method exposure for consumers (SessionDock, VoiceStage, VoiceControls)
  toggleMic: () => void;
  toggleSpeaker: () => void;
  toggleCamera: () => void;
  endVoice: () => void;
  cancelVoice: () => void;
  switchToChat: () => void;
  toggleExpand: () => void;
  /** Pauses the billing timer and mutes mic + speaker without ending the call. */
  pauseVoice: () => void;

  // Derived state for SessionDock
  elapsedText: string;
  rate: number;
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
    isSessionEnded,
    pausedState,
    roomMode,
    elapsedTime,
    pauseLiveChat,
    resumeLiveChat,
    refreshSessions,
    setVoiceLive,
    handleEndChat,
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
    voiceGraceSeconds,
    openVoiceCancel,
    handleVoiceCancelOpenChange,
    handleVoiceContinueOverChat,
    handleVoiceEndSession,
  } = useVoiceCancelActions({
    consultationId: roomConsultationId,
    sessionStatus,
    resumeLiveChat,
    refreshSessions,
    directVoice,
    handleEndChat,
  });

  // Pauses the billing timer and mutes local media without ending the call.
  // Used by the PhoneOff button in direct voice mode so the consultation
  // stays alive while the client is muted/on hold.
  const pauseVoice = useCallback(async (): Promise<void> => {
    await pauseLiveChat().catch(() => undefined);
    if (!directVoice.muted) {
      await directVoice.toggleMic().catch(() => undefined);
    }
    if (!directVoice.speakerMuted) {
      await directVoice.toggleSpeaker().catch(() => undefined);
    }
  }, [pauseLiveChat, directVoice]);

  const showVoiceStage =
    !isSessionEnded &&
    (isDirectVoice
      ? directVoice.active && directVoice.phase !== "ended"
      : !voice.minimized && voice.voiceActive);

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
      // Direct method exposure for consumers (SessionDock, VoiceStage, VoiceControls)
      toggleMic: () => void directVoice.toggleMic(),
      toggleSpeaker: () => void directVoice.toggleSpeaker(),
      toggleCamera: () => void directVoice.toggleCamera(),
      endVoice: () => void directVoice.endVoice(),
      cancelVoice: () => void directVoice.cancelVoice(),
      switchToChat: () => void directVoice.switchToChat(),
      // toggleExpand is managed by SessionDock local state, not by directVoice
      // Consumers should use their own local state for expand/collapse
      toggleExpand: () => {
        // no-op: expand is local UI state in SessionDock
      },
      // Pause billing timer + mute mic/speaker without ending the call.
      pauseVoice: () => void pauseVoice(),
      // Derived state for SessionDock
      elapsedText: formatTime(elapsedTime),
      rate: displayVoiceRate,
    }),
    [directVoice, isDirectVoice, showVoiceStage, dockProps, openVoiceCancel, pauseVoice, elapsedTime, displayVoiceRate],
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
        graceSeconds={voiceGraceSeconds}
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
