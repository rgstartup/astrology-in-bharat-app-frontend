import { RtcError } from "./errors";
import type { RtcAdapterConfig } from "./config";
import type {
  LocalMediaState,
  NetworkQuality,
  RtcConnectOptions,
  RtcEventName,
  RtcParticipant,
  RtcPhase,
  RtcProviderName,
  RtcSnapshot,
  SessionKind,
} from "./types";

/**
 * Contract every provider SDK adapter must satisfy.
 * Adapters are thin: they translate SDK callbacks into these
 * methods/events. All cross-provider logic lives in the session.
 */
export interface RtcAdapter {
  /** Provider this adapter wraps. */
  readonly provider: RtcProviderName;
  /** True after `configure` succeeds. */
  readonly isConfigured: boolean;

  /**
   * Initiate the adapter with the explicit options its SDK requires
   * (lazy SDK import happens here). The room token is NOT part of
   * initiation — it is supplied per join via `connect`.
   *
   * @param config Typed init options (see `TwilioAdapterConfig` / `AgoraAdapterConfig`).
   * @throws RtcError with code `MISSING_CONFIG` when required options are absent.
   */
  configure(config: RtcAdapterConfig): void;

  /**
   * Join a room/channel with a backend-minted token.
   *
   * @param options Room, identity, kind, and token.
   * @throws RtcError with code `NOT_CONFIGURED`, `CONNECT_FAILED`, or `NOT_IMPLEMENTED` (stub phase).
   */
  connect(options: RtcConnectOptions): Promise<void>;

  /**
   * Leave the current room and release SDK resources.
   *
   * @throws RtcError with code `DISCONNECT_FAILED`.
   */
  disconnect(): Promise<void>;

  /**
   * Mute or unmute the local microphone.
   *
   * @param muted True to mute, false to unmute.
   */
  setMicrophoneMuted(muted: boolean): Promise<void>;

  /**
   * Mute or unmute remote (speaker) audio playback.
   *
   * @param muted True to silence remote audio, false to restore it.
   */
  setSpeakerMuted(muted: boolean): Promise<void>;

  /**
   * Start or stop publishing camera (video sessions only).
   *
   * @param enabled True to publish, false to stop.
   */
  setCameraEnabled(enabled: boolean): Promise<void>;

  /**
   * Switch active input device.
   *
   * @param kind Which device family to switch.
   * @param deviceId Target device id from `enumerateDevices`.
   */
  switchDevice(
    kind: "audioinput" | "videoinput",
    deviceId: string,
  ): Promise<void>;

  /**
   * Subscribe to adapter-level callbacks.
   *
   * @param event Event name.
   * @param listener Callback invoked with the event payload.
   * @returns Unsubscribe function.
   */
  on(event: AdapterEventName, listener: AdapterListener): () => void;
}

/** Adapter-level events forwarded into the session snapshot. */
export type AdapterEventName =
  | "participants"
  | "network-quality"
  | "reconnecting"
  | "reconnected"
  | "adapter-error";

/** Payload delivered with adapter events. */
export type AdapterEventPayload =
  | { participants: RtcParticipant[] }
  | { quality: NetworkQuality }
  | { error: RtcError };

/** Listener for adapter events. */
export type AdapterListener = (payload: AdapterEventPayload) => void;

/** Listener for session snapshots. */
export type RtcSnapshotListener = (snapshot: RtcSnapshot) => void;

function initialLocalMedia(): LocalMediaState {
  return {
    microphoneEnabled: true,
    cameraEnabled: false,
    speakerMuted: false,
    audioDeviceId: null,
    videoDeviceId: null,
  };
}

function toSnapshot(state: {
  phase: RtcPhase;
  kind: SessionKind | null;
  roomName: string | null;
  participants: RtcParticipant[];
  localMedia: LocalMediaState;
  networkQuality: NetworkQuality;
  lastError: string | null;
}): RtcSnapshot {
  return {
    phase: state.phase,
    kind: state.kind,
    roomName: state.roomName,
    participants: [...state.participants],
    localMedia: { ...state.localMedia },
    networkQuality: state.networkQuality,
    lastError: state.lastError,
  };
}

/**
 * Headless RTC session. Owns the phase machine and snapshot fan-out;
 * the adapter owns SDK specifics. Framework-agnostic: React bindings
 * subscribe via `subscribe`, vanilla code uses `getSnapshot` + `on`.
 */
export interface RtcSession {
  /** Provider backing this session. */
  readonly provider: RtcProviderName;
  /** Current snapshot (immutable copy). */
  getSnapshot(): RtcSnapshot;
  /**
   * Subscribe to snapshot changes.
   *
   * @param listener Invoked on every state change.
   * @returns Unsubscribe function.
   */
  subscribe(listener: RtcSnapshotListener): () => void;
  /**
   * Join a room. Requests no permissions itself; the app should call
   * the device layer first so denial surfaces before connecting.
   *
   * @param options Room, identity, kind, and token.
   */
  join(options: RtcConnectOptions): Promise<void>;
  /** Leave the room and reset to `idle`. */
  leave(): Promise<void>;
  /** Mute or unmute remote (speaker) audio playback. */
  setSpeakerMuted(muted: boolean): Promise<void>;
  /** Mute the local microphone. */
  mute(): Promise<void>;
  /** Unmute the local microphone. */
  unmute(): Promise<void>;
  /**
   * Publish or stop the camera.
   *
   * @param enabled True to publish.
   */
  setCameraEnabled(enabled: boolean): Promise<void>;
  /**
   * Forward an adapter event name for logging/telemetry.
   *
   * @param event Event name being observed.
   */
  observedEvent(event: RtcEventName): void;
}

/**
 * Create a headless session over any adapter.
 *
 * @param adapter Configured provider adapter.
 * @returns Session owning phase + snapshot state.
 */
export function createRtcSession(adapter: RtcAdapter): RtcSession {
  let phase: RtcPhase = "idle";
  let kind: SessionKind | null = null;
  let roomName: string | null = null;
  let participants: RtcParticipant[] = [];
  let localMedia: LocalMediaState = initialLocalMedia();
  let networkQuality: NetworkQuality = "unknown";
  let lastError: string | null = null;
  const snapshotListeners = new Set<RtcSnapshotListener>();

  function emit(): void {
    const snapshot = toSnapshot({
      phase,
      kind,
      roomName,
      participants,
      localMedia,
      networkQuality,
      lastError,
    });
    for (const listener of snapshotListeners) {
      listener(snapshot);
    }
  }

  function setPhase(next: RtcPhase): void {
    phase = next;
    emit();
  }

  const offParticipants = adapter.on("participants", (payload) => {
    if ("participants" in payload) {
      participants = [...payload.participants];
      emit();
    }
  });
  const offQuality = adapter.on("network-quality", (payload) => {
    if ("quality" in payload) {
      networkQuality = payload.quality;
      emit();
    }
  });
  const offReconnecting = adapter.on("reconnecting", () => {
    if (phase === "live") {
      setPhase("reconnecting");
    }
  });
  const offReconnected = adapter.on("reconnected", () => {
    if (phase === "reconnecting") {
      setPhase("live");
    }
  });
  const offError = adapter.on("adapter-error", (payload) => {
    if ("error" in payload) {
      lastError = payload.error.message;
      emit();
    }
  });
  void offParticipants;
  void offQuality;
  void offReconnecting;
  void offReconnected;
  void offError;

  return {
    provider: adapter.provider,
    getSnapshot(): RtcSnapshot {
      return toSnapshot({
        phase,
        kind,
        roomName,
        participants,
        localMedia,
        networkQuality,
        lastError,
      });
    },
    subscribe(listener: RtcSnapshotListener): () => void {
      snapshotListeners.add(listener);
      return () => {
        snapshotListeners.delete(listener);
      };
    },
    async join(options: RtcConnectOptions): Promise<void> {
      lastError = null;
      kind = options.kind;
      roomName = options.roomName;
      setPhase("connecting");
      try {
        await adapter.connect(options);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "RTC join failed";
        lastError = message;
        setPhase("failed");
        throw error;
      }
      localMedia = {
        ...initialLocalMedia(),
        cameraEnabled: options.kind === "video",
      };
      setPhase("live");
    },
    async leave(): Promise<void> {
      try {
        await adapter.disconnect();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "RTC leave failed";
        lastError = message;
        throw error;
      }
      kind = null;
      roomName = null;
      participants = [];
      localMedia = initialLocalMedia();
      networkQuality = "unknown";
      setPhase("ended");
      setPhase("idle");
    },
    async mute(): Promise<void> {
      await adapter.setMicrophoneMuted(true);
      localMedia = { ...localMedia, microphoneEnabled: false };
      emit();
    },
    async unmute(): Promise<void> {
      await adapter.setMicrophoneMuted(false);
      localMedia = { ...localMedia, microphoneEnabled: true };
      emit();
    },
    async setCameraEnabled(enabled: boolean): Promise<void> {
      await adapter.setCameraEnabled(enabled);
      localMedia = { ...localMedia, cameraEnabled: enabled };
      emit();
    },
    async setSpeakerMuted(muted: boolean): Promise<void> {
      await adapter.setSpeakerMuted(muted);
      localMedia = { ...localMedia, speakerMuted: muted };
      emit();
    },
    observedEvent(): void {
      return;
    },
  };
}

/**
 * Guard helper: throw when an adapter is used before `configure`.
 *
 * @param adapter Adapter to check.
 * @throws RtcError with code `NOT_CONFIGURED`.
 */
export function assertAdapterConfigured(adapter: RtcAdapter): void {
  if (!adapter.isConfigured) {
    throw new RtcError(
      "NOT_CONFIGURED",
      `${adapter.provider} adapter used before configure()`,
      adapter.provider,
      false,
    );
  }
}
