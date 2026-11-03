"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RtcSession, RtcSnapshot } from "@repo/rtc";
import type { VoicePhase } from "../types/voice-phase";
import { joinCall } from "@/realtime/topics/call";
import {
  CONSULTATION_EVENTS,
  mediaReady,
} from "@/realtime/topics/consultation";
import { realtimeSocket } from "@/realtime/socket";
import type { ConsultationStatePayload } from "@/realtime/types/consultation";
import type { ConsultationDecisionPayload } from "@/realtime/types/chat";
import { useVoiceSessionStore } from "../stores/voice-session.store";

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
  join: (consultationId: number, identity: string) => Promise<void>;
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
export function useVoiceSession(
  consultationId: number | null = null,
): VoiceRtcControls {
  const sessionRef = useRef<RtcSession | null>(null);
  const mountedRef = useRef(true);
  const [snapshot, setSnapshot] = useState<RtcSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  // Subscribe to the global store for sessions created externally (e.g., prep modal)
  const storeSession = useVoiceSessionStore((s) => s.session);
  const storeSetSession = useVoiceSessionStore((s) => s.setSession);
  const storeLeaveAndClear = useVoiceSessionStore(
    (s) => s.leaveAndClearSession,
  );
  const storeClearVoiceTokens = useVoiceSessionStore((s) => s.clearVoiceTokens);
  const storeSetVoiceToken = useVoiceSessionStore((s) => s.setVoiceToken);
  const storeTakeVoiceToken = useVoiceSessionStore((s) => s.takeVoiceToken);
  const storeSetJoiningId = useVoiceSessionStore(
    (s) => s.setJoiningConsultationId,
  );

  /** Wait for the realtime socket to connect (with auth), with a timeout. */
  const waitForSocket = useCallback(
    (socket: ReturnType<typeof realtimeSocket>, timeoutMs = 10_000): Promise<boolean> => {
      const isSocketAuthenticatedWithToken = (s: ReturnType<typeof realtimeSocket>) =>
        s.connected && Boolean((s.auth as { token?: string } | undefined)?.token);

      if (isSocketAuthenticatedWithToken(socket)) return Promise.resolve(true);
      return new Promise((resolve) => {
        let timer: ReturnType<typeof setTimeout>;
        const onConnect = () => {
          if (isSocketAuthenticatedWithToken(socket)) {
            socket.off("connect", onConnect);
            clearTimeout(timer);
            resolve(true);
          }
        };
        timer = setTimeout(() => {
          socket.off("connect", onConnect);
          resolve(false);
        }, timeoutMs);
        socket.on("connect", onConnect);
      });
    },
    [],
  );

  // Voice credentials belong to the RTC lifecycle, not the consultation state hook.
  useEffect(() => {
    if (consultationId === null) return;
    const socket = realtimeSocket();
    const captureVoiceToken = (payload: {
      consultationId: number | string;
      token?: string | null;
      tokenExpiresAt?: string | null;
      channelName?: string | null;
    }) => {
      if (
        !payload ||
        Number(payload.consultationId) !== consultationId ||
        (!payload.token && !payload.channelName)
      ) {
        return;
      }
      storeSetVoiceToken(consultationId, {
        token: payload.token ?? null,
        tokenExpiresAt: payload.tokenExpiresAt ?? null,
        channelName: payload.channelName ?? null,
      });
    };

    const captureAccepted = (payload: ConsultationDecisionPayload) =>
      captureVoiceToken(payload);
    const captureResumed = (payload: ConsultationStatePayload) =>
      captureVoiceToken(payload);

    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, captureAccepted);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, captureResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, captureResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, captureResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, captureResumed);

    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, captureAccepted);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, captureResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, captureResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, captureResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, captureResumed);
    };
  }, [consultationId, storeSetVoiceToken]);

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
    async (consultationId: number, identity: string): Promise<void> => {
      const currentStore = useVoiceSessionStore.getState();
      if (
        currentStore.session !== null &&
        currentStore.session.getSnapshot().phase === "live"
      ) {
        return;
      }
      if (currentStore.joiningConsultationId === consultationId) {
        return;
      }
      storeSetJoiningId(consultationId);

      const token = storeTakeVoiceToken(consultationId);
      setBusy(true);
      setError(null);
      setActive(false);
      let tentativeSession: RtcSession | null = null;
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
        tentativeSession = session;
        const currentSnapshot = session.getSnapshot();
        if (
          currentSnapshot.phase !== "live" ||
          currentSnapshot.roomName !== channelName
        ) {
          await session.join({
            roomName: channelName,
            identity,
            kind: "voice",
            token: tokenValue,
          });
        }
        storeSetSession(session, consultationId, identity);
        setActive(true);
        // Local side is inside Agora — tell the backend so billing can start
        // once the peer also reports media_ready. Fire-and-forget.
        mediaReady(consultationId);
      } catch (err) {
        console.log("[VoiceConsultation] join failed", {
          consultationId,
          error: err instanceof Error ? err.message : String(err),
        });
        if (mountedRef.current) {
          const refreshedStore = useVoiceSessionStore.getState();
          // Tear down tentative session ONLY if it is not the active store session
          if (tentativeSession && tentativeSession !== refreshedStore.session) {
            void tentativeSession.leave().catch(() => undefined);
          }
          // Do not overwrite sessionRef.current or set error if another caller has established a live session
          if (refreshedStore.session === null) {
            sessionRef.current = null;
            setError(
              err instanceof Error ? err.message : "Could not join voice.",
            );
            setActive(false);
            setSnapshot(null);
          }
        }
        throw err;
      } finally {
        if (useVoiceSessionStore.getState().joiningConsultationId === consultationId) {
          storeSetJoiningId(null);
        }
        if (mountedRef.current) setBusy(false);
      }
    },
    [ensureSession, storeSetSession, storeSetJoiningId, storeTakeVoiceToken],
  );
  // Hard-refresh survival: rejoin the persisted voice session on mount.
  // Only { consultationId, identity } survive a hard refresh (sessionStorage).
  // The non-serializable RtcSession is gone; we rebuild it via joinCall + ensureSession.
  const storeConsultationId = useVoiceSessionStore((s) => s.consultationId);
  const storeIdentity = useVoiceSessionStore((s) => s.identity);

  useEffect(() => {
    let cancelled = false;
    const rejoinPersisted = async () => {
      if (storeConsultationId === null || storeIdentity === null) return;
      if (sessionRef.current !== null) return; // already live

      const socket = realtimeSocket();
      let retries = 0;
      const maxRetries = 3;
      let connected = false;
      while (retries < maxRetries && !cancelled) {
        connected = await waitForSocket(socket);
        if (connected) break;
        retries++;
        if (retries < maxRetries && !cancelled) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
      if (cancelled || !connected) return;

      try {
        // Re-read live store state: intent may have been cleared while waiting
        // for the socket (e.g. consultation ended during reconnect). Reading
        // the closure values here could rejoin a terminated call.
        const current = useVoiceSessionStore.getState();
        if (current.consultationId === null || current.identity === null) return;

        // If the store already holds an active session or a join is already in flight,
        // don't touch it — the mount rejoin effect must never tear down or duplicate
        // a session it didn't create.
        if (current.session !== null || current.joiningConsultationId === current.consultationId) return;
        // Another caller (e.g. useDirectVoice) may have already joined while
        // we waited for the socket. Don't start a duplicate join.
        if (sessionRef.current !== null) return;

        // On hard refresh the socket may still be authenticating (the
        // RealtimeProvider's getSocketTokenAction() is an async Server Action).
        // joinCall() → emitWithAck times out if the socket isn't yet
        // authenticated. Retry a few times so the auth flow can complete
        // before we give up and clear the stale intent.
        let joinAttempt = 0;
        const maxJoinAttempts = 3;
        while (joinAttempt < maxJoinAttempts && !cancelled) {
          joinAttempt++;
          try {
            await join(current.consultationId, current.identity);
            return; // success — rejoin complete
          } catch {
            if (joinAttempt >= maxJoinAttempts) break;
            if (cancelled) break;
            await new Promise((r) => setTimeout(r, 3000));
            // Re-read intent before retrying — it may have been cleared.
            const refreshed = useVoiceSessionStore.getState();
            if (refreshed.consultationId === null || refreshed.identity === null) return;
            if (sessionRef.current !== null) return;
          }
        }
      } catch {
        // join() already set error and cleared sessionRef; drop the stale intent
        storeSetSession(null, null, null);
      }
    };
    rejoinPersisted();
    return () => {
      cancelled = true;
    };
  }, [storeConsultationId, storeIdentity, join, storeSetSession, waitForSocket]);

  const leave = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    try {
      // If the active RTC session is in the bridge store, that store action
      // owns teardown. Calling both paths leaves the same Agora session twice
      // and can strand the next resume between leave/join.
      if (session && session !== storeSession) {
        await session.leave().catch(() => undefined);
      } else {
        await storeLeaveAndClear(session ?? undefined);
      }
    } catch {
      // Leave is best-effort; the snapshot reset below is what the UI reads.
      if (!session || session === storeSession) {
        await storeLeaveAndClear(session ?? undefined).catch(() => undefined);
      }
    } finally {
      sessionRef.current = null;
      storeClearVoiceTokens();
      if (mountedRef.current) {
        setSnapshot(null);
        setActive(false);
        setBusy(false);
      }
    }
  }, [storeLeaveAndClear, storeSession]);

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
