"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useSwitchToVoice } from "../hooks/use-switch-to-voice";
import { resolveVoiceRate } from "@/lib/pricing";
import { useConsultationRoomStore } from "../stores/consultation-room.store";
import { useRoomLifecycle } from "./room-lifecycle.provider";

export interface SwitchToVoiceContextValue {
  voice: ReturnType<typeof useSwitchToVoice>;
  voiceRate: number;
  displayVoiceRate: number;
  handleUpgrade: (mode: "voice" | "video") => void;
}

const SwitchToVoiceContext = createContext<SwitchToVoiceContextValue | null>(
  null,
);

export interface SwitchToVoiceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider managing the chat-to-switch to voice lifecycle, including
 * upgrade audio toggles, pricing derivation, and resume state restoration.
 *
 * @param props - Provider children
 */
export function SwitchToVoiceProvider({
  children,
}: SwitchToVoiceProviderProps) {
  const {
    expertData,
    user,
    resumeRevision,
    elapsedTime,
    timeLeft,
    setVoiceLive,
  } = useRoomLifecycle();
  const resetRoomForResume = useConsultationRoomStore((s) => s.resetForResume);
  const handledResumeRevision = useRef(0);

  const voice = useSwitchToVoice({
    expertId: expertData.id,
    userId: user?.id ?? null,
  });

  // Gate the room timer on RTC liveness for switch-to-voice: paused while
  // connecting, active once live. Chat mode leaves voiceLive true (default).
  useEffect(() => {
    if (!voice.voiceActive) {
      setVoiceLive(true);
      return;
    }
    setVoiceLive(voice.voicePhase === "live");
  }, [voice.voiceActive, voice.voicePhase, setVoiceLive]);

  // Reset the room store for every backend resume event, independently of
  // the consultation-state subscription or whether this is the first cycle.
  useEffect(() => {
    if (
      resumeRevision === 0 ||
      handledResumeRevision.current === resumeRevision
    )
      return;
    handledResumeRevision.current = resumeRevision;
    resetRoomForResume(elapsedTime, timeLeft);
    voice.returnToVoice();
  }, [
    resumeRevision,
    elapsedTime,
    timeLeft,
    resetRoomForResume,
    voice.returnToVoice,
  ]);

  const voiceRate = useMemo(() => resolveVoiceRate(expertData), [expertData]);
  const displayVoiceRate = voice.voicePrice ?? voiceRate;

  const handleUpgrade = useCallback(
    (mode: "voice" | "video") => {
      if (mode !== "voice") return;
      void voice.startVoice();
    },
    [voice],
  );

  const contextValue = useMemo<SwitchToVoiceContextValue>(
    () => ({
      voice,
      voiceRate,
      displayVoiceRate,
      handleUpgrade,
    }),
    [voice, voiceRate, displayVoiceRate, handleUpgrade],
  );

  return (
    <SwitchToVoiceContext.Provider value={contextValue}>
      {children}
    </SwitchToVoiceContext.Provider>
  );
}

/**
 * Hook to access the switch to voice context.
 *
 * @returns SwitchToVoiceContextValue
 * @throws Error if used outside SwitchToVoiceProvider
 */
export function useSwitchToVoiceContext(): SwitchToVoiceContextValue {
  const context = useContext(SwitchToVoiceContext);
  if (!context) {
    throw new Error(
      "useSwitchToVoiceContext must be used within a SwitchToVoiceProvider",
    );
  }
  return context;
}
