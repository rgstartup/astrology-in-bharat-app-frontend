"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useDirectVoice } from "../hooks/use-direct-voice";
import { useSwitchToVoice } from "../hooks/use-switch-to-voice";
import { VoiceCancelDialog } from "../components/dialog/voice-cancel-dialog";
import { formatTime } from "../utils/format-time";
import { useRoomLifecycle } from "./room-lifecycle";
import { useVoiceCancelActions } from "./use-voice-cancel-actions";

/** Voice flow mode: "direct" (voice-first) or "switch" (chat upgrade). */
export type VoiceMode = "direct" | "switch";

export interface VoiceContextValue {
  /** Which voice flow is active: "direct" (voice-first) or "switch" (chat upgrade). */
  mode: VoiceMode;
  /** Whether the RTC voice session is currently active. */
  active: boolean;
  /** Current RTC phase: "requesting" | "connecting" | "live" | "ended". */
  phase: string;
  /** Whether the local mic is muted. */
  muted: boolean;
  /** Whether the local speaker is muted. */
  speakerMuted: boolean;
  /** Whether the local camera is enabled. */
  cameraEnabled: boolean;
  /** Whether the voice stage UI should be shown. */
  showVoiceStage: boolean;
  /** Whether the voice stage is minimized (switch mode only). */
  isPanelExpanded: boolean;

  // Controls — delegate to the active backing hook.
  togglePanelExpanded: () => void;
  toggleMic: () => void;
  toggleSpeaker: () => void;
  toggleCamera: () => void;
  /** Ends the voice consultation (rtc.leave + endConsultation in direct mode). */
  endVoice: () => void;
  /** Cancels the voice consultation (rtc.leave + cancelConsultation in direct mode). */
  cancelVoice: () => void;
  /** Pauses the billing timer and mutes mic + speaker without ending the call (direct mode only). */
  pauseVoice: () => void;
  /** Opens the voice cancel dialog (direct mode only), pausing billing while open. */
  openVoiceCancel: () => void;
  /** Continues the same consultation over chat (direct mode only). */
  switchToChat: () => void;
  /** Returns to voice from minimized chat (switch mode only). */
  returnToVoice: () => void;
  /** Upgrades from chat to voice/video (switch mode only). */
  handleUpgrade: (mode: "voice" | "video") => void;

  // Derived state for SessionDock.
  elapsedText: string;
  rate: number;
  voiceRate: number;
}

export const VoiceContext = createContext<VoiceContextValue | null>(null);
export interface VoiceProviderProps {
  children: React.ReactNode;
}

/**
 * Unified voice provider. Holds both useDirectVoice and useSwitchToVoice,
 * activates the right one based on roomMode, and exposes a single stable
 * interface so consumers never branch on isDirectVoice.
 */
export function VoiceProvider({ children }: VoiceProviderProps) {
  const {
    roomConsultationId,
    user,
    expertData,
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

  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const isDirectVoice = roomMode === "voice";

  const directVoice = useDirectVoice({
    consultationId: roomConsultationId,
    userId: user?.id ?? null,
    sessionStatus,
    decision,
    enabled:
      isDirectVoice &&
      !isSessionEnded &&
      (pausedState === null || pausedState.reason === "billing_hold"),
    onLocalReady: undefined,
    ended: isSessionEnded,
  });

  const switchToVoice = useSwitchToVoice({
    expertId: expertData?.id ?? 0,
    userId: user?.id ?? null,
  });

  const voiceRate = switchToVoice.voicePrice ?? 0;
  const displayVoiceRate = voiceRate;

  // --- Direct voice: pauseVoice (billing hold + mute) ---
  const pauseVoice = useCallback(async (): Promise<void> => {
    if (!isDirectVoice) return;
    await pauseLiveChat().catch(() => undefined);

    if (!directVoice.muted) {
      await directVoice.toggleMic().catch(() => undefined);
    }

    if (!directVoice.speakerMuted) {
      await directVoice.toggleSpeaker().catch(() => undefined);
    }
  }, [isDirectVoice, pauseLiveChat, directVoice]);

  // --- handleUpgrade (switch mode only) ---
  const handleUpgrade = useCallback(
    (mode: "voice" | "video") => {
      if (mode !== "voice") return;
      void switchToVoice.startVoice();
    },
    [switchToVoice],
  );

  // --- Voice cancel dialog (direct voice only) ---
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

  // --- Timer gating: single effect replaces the two near-identical ones ---
  useEffect(() => {
    if (!isDirectVoice) {
      setVoiceLive(true);
      return;
    }
    setVoiceLive(directVoice.phase === "live");
  }, [isDirectVoice, directVoice.phase, setVoiceLive]);

  const showVoiceStage = !isSessionEnded && isPanelExpanded;

  const contextValue = useMemo<VoiceContextValue>(
    () => ({
      mode: isDirectVoice ? "direct" : "switch",
      active: isDirectVoice ? directVoice.active : switchToVoice.voiceActive,
      phase: isDirectVoice ? directVoice.phase : switchToVoice.voicePhase,
      muted: isDirectVoice ? directVoice.muted : switchToVoice.muted,
      speakerMuted: isDirectVoice
        ? directVoice.speakerMuted
        : switchToVoice.speakerMuted,
      cameraEnabled: isDirectVoice
        ? directVoice.cameraEnabled
        : switchToVoice.cameraEnabled,
      showVoiceStage,
      isPanelExpanded,
      togglePanelExpanded: () => setIsPanelExpanded(!isPanelExpanded),
      toggleMic: () =>
        void (isDirectVoice
          ? directVoice.toggleMic()
          : switchToVoice.toggleMic()),
      toggleSpeaker: () =>
        void (isDirectVoice
          ? directVoice.toggleSpeaker()
          : switchToVoice.toggleSpeaker()),
      toggleCamera: () =>
        void (isDirectVoice
          ? directVoice.toggleCamera()
          : switchToVoice.toggleCamera()),
      endVoice: () =>
        void (isDirectVoice
          ? directVoice.endVoice()
          : switchToVoice.endVoice()),
      cancelVoice: () =>
        void (isDirectVoice
          ? directVoice.cancelVoice()
          : switchToVoice.cancelVoice()),
      pauseVoice,
      openVoiceCancel,
      switchToChat: () =>
        void (isDirectVoice
          ? directVoice.switchToChat()
          : switchToVoice.backToChat()),
      returnToVoice: () =>
        void (isDirectVoice ? undefined : switchToVoice.returnToVoice()),
      handleUpgrade,
      elapsedText: formatTime(elapsedTime),
      rate: displayVoiceRate,
      voiceRate,
    }),
    [
      isDirectVoice,
      directVoice,
      switchToVoice,
      elapsedTime,
      displayVoiceRate,
      voiceRate,
      showVoiceStage,
      pauseVoice,
      openVoiceCancel,
      handleUpgrade,
      switchToVoice.minimized,
    ],
  );

  return (
    <VoiceContext.Provider value={contextValue}>
      {isDirectVoice && (
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
      )}
      {children}
    </VoiceContext.Provider>
  );
}

/**
 * Hook to access the unified voice context.
 *
 * @returns VoiceContextValue
 * @throws Error if used outside VoiceProvider
 */
export function useVoiceContext(): VoiceContextValue {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoiceContext must be used within VoiceProvider");
  }
  return context;
}
