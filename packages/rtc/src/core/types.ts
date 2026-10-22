/**
 * Core domain types for headless real-time communication.
 * SDK-agnostic: Twilio, Agora, or future providers map onto these shapes.
 */

/** Media mode for a session. Voice is audio-only; video adds camera tracks. */
export type SessionKind = "voice" | "video";

/** Lifecycle phase of an RTC session, owned by the session factory. */
export type RtcPhase =
  | "idle"
  | "requesting-permissions"
  | "connecting"
  | "live"
  | "reconnecting"
  | "ended"
  | "failed";

/** Which provider backs the session. */
export type RtcProviderName = "twilio" | "agora";

/** A remote (or local) participant in abstract terms. */
export interface RtcParticipant {
  /** Stable participant identity (e.g. `client-42` or `expert-7`). */
  identity: string;
  /** True for the local user. */
  isLocal: boolean;
  /** True while the participant publishes audio. */
  audioEnabled: boolean;
  /** True while the participant publishes video. */
  videoEnabled: boolean;
  /**
   * Live video track for the app to attach to its own `<video>` element
   * (local preview included via the `isLocal` participant). Null when the
   * camera is off or the session is voice-only. Remote audio needs no
   * element and is auto-played by the adapter.
   */
  videoTrack: MediaStreamTrack | null;
}

/** Snapshot of local publish state. */
export interface LocalMediaState {
  /** True while the microphone is unmuted. */
  microphoneEnabled: boolean;
  /** True while the camera is publishing (video sessions only). */
  cameraEnabled: boolean;
  /** True while remote audio is audible (speaker on). */
  speakerMuted: boolean;
  /** Active input device ids, when known. */
  audioDeviceId: string | null;
  videoDeviceId: string | null;
}

/** Coarse network quality reported by the adapter. */
export type NetworkQuality = "unknown" | "poor" | "fair" | "good" | "excellent";

/** Full snapshot subscribers receive. */
export interface RtcSnapshot {
  /** Current lifecycle phase. */
  phase: RtcPhase;
  /** Active media mode, null before connect. */
  kind: SessionKind | null;
  /** Room/channel name, null before connect. */
  roomName: string | null;
  /** Participants including the local user when connected. */
  participants: RtcParticipant[];
  /** Local publish state. */
  localMedia: LocalMediaState;
  /** Last reported network quality. */
  networkQuality: NetworkQuality;
  /** Last fatal error message, null when healthy. */
  lastError: string | null;
}

/** Events emitted by a session. */
export type RtcEventName =
  | "phase"
  | "participants"
  | "local-media"
  | "network-quality"
  | "error";

/** Callback invoked by the app to mint a fresh RTC access token. */
export interface RtcTokenProvider {
  /**
   * Mint a short-lived access token for this room/identity.
   *
   * @returns Token string issued by the backend (via app Server Action).
   */
  (): Promise<string>;
}

/** Options accepted by `adapter.connect`. */
export interface RtcConnectOptions {
  /** Room or channel name to join. */
  roomName: string;
  /** Identity to present to the room. */
  identity: string;
  /** Media mode for this join. */
  kind: SessionKind;
  /** Short-lived access token minted by the backend. */
  token: string;
}
