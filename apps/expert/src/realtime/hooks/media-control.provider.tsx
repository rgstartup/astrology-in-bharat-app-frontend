"use client";

import { useVoiceSession } from "@/realtime/hooks/use-voice-session";
import { useMediaControl } from "@/realtime/hooks/use-media-control";

export interface MediaControlProviderProps {
  children: React.ReactNode;
  consultationId: number | null;
}

/**
 * Syncs incoming media-control events (mic/speaker toggled by peer or system)
 * onto the local RTC session for the active consultation.
 *
 * Mounted in the expert consultation room so media-control broadcasts are
 * reflected locally for the voice session lifecycle.
 */
export function MediaControlProvider({
  children,
  consultationId,
}: MediaControlProviderProps) {
  useVoiceSession();
  useMediaControl(consultationId);

  return <>{children}</>;
}
