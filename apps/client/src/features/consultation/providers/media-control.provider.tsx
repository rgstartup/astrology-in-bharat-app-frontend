"use client";

import { useVoiceSession } from "@/features/consultation/hooks/use-voice-session";
import { useRoomIdentity } from "./room-lifecycle";
import { useMediaControl } from "@/realtime/hooks/use-media-control";

export interface MediaControlProviderProps {
  children: React.ReactNode;
}

/**
 * Syncs incoming media-control events (mic/speaker/camera toggled by peer or
 * system) onto the local RTC session for the active consultation room.
 *
 * Mounted once in the room tree alongside SwitchToVoiceProvider and
 * DirectVoiceProvider so media-control broadcasts are reflected locally for
 * the entire voice/video session lifecycle.
 */
export function MediaControlProvider({
  children,
}: MediaControlProviderProps) {
  const { roomConsultationId } = useRoomIdentity();

  // useVoiceSession picks up the session from the store; consultationId is
  // passed explicitly so media-control subscriptions are scoped to this room.
  useVoiceSession(roomConsultationId ?? undefined);
  useMediaControl(roomConsultationId ?? null);

  return <>{children}</>;
}
