"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RtcSession, RtcSnapshot } from "@repo/rtc";
import type { ExpertSessionPhase } from "@/components/consultation/types";
import { joinCall } from "@/realtime/topics/call";
import { mediaReady } from "@/realtime/topics/consultation";

export interface ExpertVoiceRtcControls {
  snapshot: RtcSnapshot | null;
  voicePhase: ExpertSessionPhase | null;
  muted: boolean;
  speakerMuted: boolean;
  busy: boolean;
  error: string | null;
  active: boolean;
  join: (
    consultationId: number,
    identity: string,
    token?: {
      token: string | null;
      channelName: string | null;
      tokenExpiresAt?: string | null;
    },
    onLocalReady?: () => void,
  ) => Promise<void>;
  leave: () => Promise<void>;
  toggleMic: () => Promise<void>;
  toggleSpeaker: () => Promise<void>;
  clearError: () => void;
}

/**
 * Maps an RTC snapshot onto the expert consultation-stage vocabulary.
 * Alone in the room means the client has not joined yet, so the connecting
 * copy stays on screen until audio can flow.
 */
export function toExpertVoicePhase(
  snapshot: RtcSnapshot | null,
  joining: boolean,
): ExpertSessionPhase {
  if (snapshot === null) return joining ? "connecting" : "incoming";
  if (snapshot.phase === "failed" || snapshot.phase === "ended") return "ended";
  if (snapshot.phase === "reconnecting") return "reconnecting";
  if (snapshot.phase === "live") {
    const clientJoined = snapshot.participants.some((p) => !p.isLocal);
    return clientJoined ? "live" : "connecting";
  }
  return "connecting";
}

/**
 * SSR-safe voice session over `@repo/rtc` (Agora adapter, loaded lazily).
 * The vendor SDK only loads inside event handlers via dynamic import, so this
 * hook never touches browser media APIs during render.
 *
 * Provider-blind like its client counterpart: the adapter comes straight from
 * the package entrypoint and the media token plus channel come opaquely from
 * the realtime `joinCall` ack. No channel conventions live in app code.
 */
// Shared singleton session to preserve the live RTC session across navigation
// between incoming waiting modal and consultation room.
let globalSession: RtcSession | null = null;
let globalSnapshot: RtcSnapshot | null = null;
let globalBusy = false;
let globalError: string | null = null;
let globalActive = false;
let globalConsultationId: number | null = null;
let globalLeaving = false;
const stateSubscribers = new Set<() => void>();

function notifySubscribers() {
  stateSubscribers.forEach((fn) => fn());
}

/**
 * SSR-safe voice session over `@repo/rtc` (Agora adapter, loaded lazily).
 * The vendor SDK only loads inside event handlers via dynamic import, so this
 * hook never touches browser media APIs during render.
 *
 * Provider-blind like its client counterpart: the adapter comes straight from
 * the package entrypoint and the media token plus channel come opaquely from
 * the realtime `joinCall` ack. No channel conventions live in app code.
 *
 * Preserves the active RTC session across component remounts and navigation.
 */
export function useVoiceSession(): ExpertVoiceRtcControls {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    stateSubscribers.add(listener);
    return () => {
      stateSubscribers.delete(listener);
    };
  }, []);

  const ensureSession = useCallback(async (): Promise<RtcSession> => {
    if (globalSession) return globalSession;
    const { createDefaultRtcSession } = await import("@repo/rtc");
    const session = createDefaultRtcSession();
    session.subscribe((next) => {
      globalSnapshot = next;
      notifySubscribers();
    });
    globalSession = session;
    return session;
  }, []);

  const join = useCallback(
    async (
      consultationId: number,
      identity: string,
      token?: {
        token: string | null;
        channelName: string | null;
        tokenExpiresAt?: string | null;
      } | null,
      onLocalReady?: () => void,
    ): Promise<void> => {
      // If already active in the same consultation room, preserve and notify ready
      if (
        globalSession &&
        globalActive &&
        globalConsultationId === consultationId
      ) {
        onLocalReady?.();
        return;
      }

      globalBusy = true;
      globalError = null;
      globalActive = true;
      globalConsultationId = consultationId;
      notifySubscribers();

      try {
        let channelName: string | null = null;
        let tokenValue: string | null = null;
        if (token?.token) {
          // Accept-time token supplied directly — skip the per-join round trip.
          channelName = token.channelName ?? null;
          tokenValue = token.token;
        } else {
          const ack = await joinCall(consultationId);
          if (!ack.token || !ack.channelName) {
            throw new Error(
              "Voice is unavailable right now. Please try again shortly.",
            );
          }
          channelName = ack.channelName;
          tokenValue = ack.token;
        }
        if (!tokenValue || !channelName) {
          throw new Error(
            "Voice is unavailable right now. Please try again shortly.",
          );
        }
        const session = await ensureSession();
        await session.join({
          roomName: channelName,
          identity,
          kind: "voice",
          token: tokenValue,
        });
        // Local side is inside Agora — tell the backend so billing can start
        // once the peer also reports media_ready. Fire-and-forget.
        mediaReady(consultationId);
        // Signal the parent that the local side is ready so the waiting lobby
        // can transition once the peer also reports media_ready.
        onLocalReady?.();
      } catch (err) {
        // Tear down the Agora client so a failed join doesn't leave a
        // dangling connection.
        await globalSession?.leave().catch(() => undefined);
        globalSession = null;
        globalError =
          err instanceof Error ? err.message : "Could not join voice.";
        globalActive = false;
        globalSnapshot = null;
        globalConsultationId = null;
      } finally {
        globalBusy = false;
        notifySubscribers();
      }
    },
    [ensureSession],
  );

  const leave = useCallback(async (): Promise<void> => {
    if (globalLeaving || (!globalSession && !globalActive && !globalBusy)) {
      return;
    }
    globalLeaving = true;
    try {
      await globalSession?.leave();
    } catch {
      // Leave is best-effort; the snapshot reset below is what the UI reads.
    } finally {
      globalSession = null;
      globalSnapshot = null;
      globalActive = false;
      globalBusy = false;
      globalConsultationId = null;
      globalLeaving = false;
      notifySubscribers();
    }
  }, []);

  const toggleMic = useCallback(async (): Promise<void> => {
    if (!globalSession) return;
    const micEnabled = globalSession.getSnapshot().localMedia.microphoneEnabled;
    if (micEnabled) await globalSession.mute();
    else await globalSession.unmute();
    notifySubscribers();
  }, []);

  const toggleSpeaker = useCallback(async (): Promise<void> => {
    if (!globalSession) return;
    const muted = globalSession.getSnapshot().localMedia.speakerMuted;
    await globalSession.setSpeakerMuted(!muted);
    notifySubscribers();
  }, []);

  const clearError = useCallback(() => {
    globalError = null;
    notifySubscribers();
  }, []);

  const voicePhase = globalActive
    ? toExpertVoicePhase(globalSnapshot, globalBusy)
    : null;
  const muted = globalSnapshot
    ? !globalSnapshot.localMedia.microphoneEnabled
    : false;
  const speakerMuted = globalSnapshot
    ? globalSnapshot.localMedia.speakerMuted
    : false;

  return useMemo(
    () => ({
      snapshot: globalSnapshot,
      voicePhase,
      muted,
      speakerMuted,
      busy: globalBusy,
      error: globalError,
      active: globalActive,
      join,
      leave,
      toggleMic,
      toggleSpeaker,
      clearError,
    }),
    [
      globalSnapshot,
      voicePhase,
      muted,
      speakerMuted,
      globalBusy,
      globalError,
      globalActive,
      join,
      leave,
      toggleMic,
      toggleSpeaker,
      clearError,
    ],
  );
}
