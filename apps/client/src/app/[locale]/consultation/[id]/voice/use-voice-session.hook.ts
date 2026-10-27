"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RtcSession, RtcSnapshot } from "@repo/rtc";
import type { VoicePhase } from "./voice-phase";
import { joinCall } from "@/realtime/topics/call";
import { mediaReady } from "@/realtime/topics/consultation";
import { useVoiceSessionStore } from "@/store/voiceSessionStore";

/**
 * Maps an RTC snapshot onto the consultation-room voice vocabulary.
 * Alone in the room means the expert has not joined yet, so the
 * requesting (ringing) copy stays on screen until audio can flow.
 */
export function toVoicePhase(
  snapshot: RtcSnapshot | null,
  joining: boolean,
): VoicePhase {
  if (snapshot === null) return joining ? "connecting" : "requesting";
  if (snapshot.phase === "failed" || snapshot.phase === "ended") return "ended";
  if (snapshot.phase === "reconnecting") return "reconnecting";
  if (snapshot.phase === "live") {
    const expertJoined = snapshot.participants.some((p) => !p.isLocal);
    return expertJoined ? "live" : "requesting";
  }
  return "connecting";
}

export interface VoiceRtcControls {
  snapshot: RtcSnapshot | null;
  voicePhase: VoicePhase | null;
  muted: boolean;
  speakerMuted: boolean;
  cameraEnabled: boolean;
  busy: boolean;
  error: string | null;
  active: boolean;
  join: (consultationId: number, identity: string, token?: { token: string | null; channelName: string | null; tokenExpiresAt?: string | null }) => Promise<void>;
  leave: () => Promise<void>;
  toggleMic: () => Promise<void>;
  toggleSpeaker: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  clearError: () => void;
}

/**
 * SSR-safe voice session over `@repo/rtc`.
 * The vendor SDK only loads inside event handlers via dynamic import, so this
 * hook never touches browser media APIs during render.
 *
 * The hook is provider-blind: the adapter comes from the package's default
 * factory and the media token plus channel come opaquely from the realtime
 * `joinCall` ack. No Twilio/Agora imports, config, or channel conventions
 * live in app code. The legacy REST voice-token endpoint is deprecated.
 *
 * Sessions created in the prep modal (via useConsultationRequest) are stored
 * in useVoiceSessionStore. This hook subscribes to that store so the session
 * is automatically picked up when entering the room.
 */
export function useVoiceSession(): VoiceRtcControls {
  const sessionRef = useRef<RtcSession | null>(null);
  const mountedRef = useRef(true);
  const [snapshot, setSnapshot] = useState<RtcSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  // Subscribe to the global store for sessions created externally (e.g., prep modal)
  const storeSession = useVoiceSessionStore((s) => s.session);
  const storeConsultationId = useVoiceSessionStore((s) => s.consultationId);
  const storeSetSession = useVoiceSessionStore((s) => s.setSession);
  const storeLeaveAndClear = useVoiceSessionStore((s) => s.leaveAndClearSession);

  // Sync local ref with store on mount and when store session changes
  useEffect(() => {
    if (storeSession && storeSession !== sessionRef.current) {
      sessionRef.current = storeSession;
      setSnapshot(storeSession.getSnapshot());
      setActive(true);
      const unsub = storeSession.subscribe((next) => {
        if (mountedRef.current) setSnapshot(next);
      });
      return () => unsub();
    }
  }, [storeSession]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const ensureSession = useCallback(async (): Promise<RtcSession> => {
    if (sessionRef.current) return sessionRef.current;
    const existing = storeSession;
    if (existing) {
      sessionRef.current = existing;
      existing.subscribe((next) => {
        if (mountedRef.current) setSnapshot(next);
      });
      setSnapshot(existing.getSnapshot());
      return existing;
    }
    const { createDefaultRtcSession } = await import("@repo/rtc");
    const session = createDefaultRtcSession();
    session.subscribe((next) => {
      if (mountedRef.current) setSnapshot(next);
    });
    sessionRef.current = session;
    storeSetSession(session);
    return session;
  }, [storeSession, storeSetSession]);

  const join = useCallback(
    async (
      consultationId: number,
      identity: string,
      token?: { token: string | null; channelName: string | null; tokenExpiresAt?: string | null } | null,
    ): Promise<void> => {
      setBusy(true);
      setError(null);
      setActive(true);
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
        const currentSnapshot = session.getSnapshot();
        if (currentSnapshot.phase !== "live" || currentSnapshot.roomName !== channelName) {
          await session.join({
            roomName: channelName,
            identity,
            kind: "voice",
            token: tokenValue,
          });
        }
        storeSetSession(session, consultationId);
        // Local side is inside Agora — tell the backend so billing can start
        // once the peer also reports media_ready. Fire-and-forget.
        mediaReady(consultationId);
      } catch (err) {
        if (mountedRef.current) {
          // Tear down the Agora client so a failed join doesn't leave a
          // dangling XHR/polling connection to the Agora edge.
          void sessionRef.current?.leave().catch(() => undefined);
          storeLeaveAndClear();
          sessionRef.current = null;
          setError(err instanceof Error ? err.message : "Could not join voice.");
          setActive(false);
          setSnapshot(null);
        }
      } finally {
        if (mountedRef.current) setBusy(false);
      }
    },
    [ensureSession, storeSetSession, storeLeaveAndClear],
  );

  const leave = useCallback(async (): Promise<void> => {
    setBusy(true);
    try {
      await sessionRef.current?.leave();
      await storeLeaveAndClear();
    } catch {
      // Leave is best-effort; the snapshot reset below is what the UI reads.
    } finally {
      sessionRef.current = null;
      if (mountedRef.current) {
        setSnapshot(null);
        setActive(false);
        setBusy(false);
      }
    }
  }, [storeLeaveAndClear]);

  const toggleMic = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (!session) return;
    const micEnabled = session.getSnapshot().localMedia.microphoneEnabled;
    if (micEnabled) await session.mute();
    else await session.unmute();
  }, []);

  const toggleSpeaker = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (!session) return;
    const muted = session.getSnapshot().localMedia.speakerMuted;
    await session.setSpeakerMuted(!muted);
  }, []);

  const toggleCamera = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (!session) return;
    await session.setCameraEnabled(
      !session.getSnapshot().localMedia.cameraEnabled,
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const voicePhase = active ? toVoicePhase(snapshot, busy) : null;
  const muted = snapshot ? !snapshot.localMedia.microphoneEnabled : false;
  const speakerMuted = snapshot ? snapshot.localMedia.speakerMuted : false;
  const cameraEnabled = snapshot ? snapshot.localMedia.cameraEnabled : false;

  return {
    snapshot,
    voicePhase,
    muted,
    speakerMuted,
    cameraEnabled,
    busy,
    error,
    active,
    join,
    leave,
    toggleMic,
    toggleSpeaker,
    toggleCamera,
    clearError,
  };
}
