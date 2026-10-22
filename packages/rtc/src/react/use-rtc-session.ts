"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRtcSession } from "./../core/provider";
import type { RtcAdapter } from "./../core/provider";
import type {
  RtcSnapshot,
  SessionKind,
  RtcTokenProvider,
} from "./../core/types";

/** Params for {@link useRtcSession}. */
export interface UseRtcSessionParams {
  /** Configured adapter (Twilio/Agora stub in phase 1). */
  adapter: RtcAdapter;
  /** Backend token minter owned by the app (Server Action + apiV2). */
  tokenProvider: RtcTokenProvider;
  /** Room/channel to join. */
  roomName: string;
  /** Identity to present in the room. */
  identity: string;
  /** Media mode. */
  kind: SessionKind;
}

/** Headless session controls returned to UI layers. */
export interface UseRtcSessionReturn {
  /** Latest session snapshot (render-agnostic data only). */
  snapshot: RtcSnapshot;
  /** Join the room using a fresh token from `tokenProvider`. */
  join: () => Promise<void>;
  /** Leave the room. */
  leave: () => Promise<void>;
  /** Mute the microphone. */
  mute: () => Promise<void>;
  /** Unmute the microphone. */
  unmute: () => Promise<void>;
  /**
   * Publish or stop the camera.
   *
   * @param enabled True to publish.
   */
  setCameraEnabled: (enabled: boolean) => Promise<void>;
  /** True while an async transition is in flight. */
  busy: boolean;
}

function idleSnapshot(kind: SessionKind): RtcSnapshot {
  return {
    phase: "idle",
    kind,
    roomName: null,
    participants: [],
    localMedia: {
      microphoneEnabled: true,
      cameraEnabled: false,
      speakerMuted: false,
      audioDeviceId: null,
      videoDeviceId: null,
    },
    networkQuality: "unknown",
    lastError: null,
  };
}

/**
 * Headless React binding over any `RtcAdapter`.
 * Owns no UI; returns snapshot data plus join/leave/mute actions
 * for the app's own components to render.
 *
 * @param params Adapter, token provider, room, identity, and kind.
 * @returns Snapshot plus session actions.
 */
export function useRtcSession(params: UseRtcSessionParams): UseRtcSessionReturn {
  const { adapter, tokenProvider, roomName, identity, kind } = params;
  const sessionRef = useRef<ReturnType<typeof createRtcSession> | null>(null);
  if (sessionRef.current === null) {
    sessionRef.current = createRtcSession(adapter);
  }
  const [snapshot, setSnapshot] = useState<RtcSnapshot>(() =>
    idleSnapshot(kind),
  );
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    const session = sessionRef.current;
    if (session === null) {
      return;
    }
    setSnapshot(session.getSnapshot());
    const unsubscribe = session.subscribe(setSnapshot);
    return unsubscribe;
  }, [adapter]);

  const join = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (session === null) {
      return;
    }
    setBusy(true);
    try {
      const token = await tokenProvider();
      await session.join({ roomName, identity, kind, token });
    } finally {
      setBusy(false);
    }
  }, [tokenProvider, roomName, identity, kind]);

  const leave = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (session === null) {
      return;
    }
    setBusy(true);
    try {
      await session.leave();
    } finally {
      setBusy(false);
    }
  }, []);

  const mute = useCallback(async (): Promise<void> => {
    await sessionRef.current?.mute();
  }, []);

  const unmute = useCallback(async (): Promise<void> => {
    await sessionRef.current?.unmute();
  }, []);

  const setCameraEnabled = useCallback(
    async (enabled: boolean): Promise<void> => {
      await sessionRef.current?.setCameraEnabled(enabled);
    },
    [],
  );

  return useMemo(
    () => ({ snapshot, join, leave, mute, unmute, setCameraEnabled, busy }),
    [snapshot, join, leave, mute, unmute, setCameraEnabled, busy],
  );
}
