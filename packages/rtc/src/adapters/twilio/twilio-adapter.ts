import Video, {
  type LocalAudioTrack,
  type LocalVideoTrack,
  type RemoteParticipant,
  type Room,
} from "twilio-video";
import { resolveTwilioConfig } from "../../core/config";
import type {
  RtcAdapterConfig,
  TwilioAdapterConfig,
} from "../../core/config";
import { RtcError } from "../../core/errors";
import {
  assertAdapterConfigured,
  type AdapterEventName,
  type AdapterEventPayload,
  type AdapterListener,
  type RtcAdapter,
} from "../../core/provider";
import type { RtcConnectOptions } from "../../core/types";
import { buildTwilioParticipants, mapTwilioQuality } from "./twilio-mapping";

function toConnectError(error: unknown): RtcError {
  const message = error instanceof Error ? error.message : "Twilio connect failed";
  return new RtcError("CONNECT_FAILED", message, "twilio", true);
}

/**
 * Twilio Video/Voice adapter over the `twilio-video` SDK (bundled dep,
 * top-level import). Import this entrypoint from client code only.
 * Remote audio is auto-played (headless-safe); remote/local video tracks
 * surface on `RtcParticipant.videoTrack` for the app to render.
 */
export class TwilioAdapter implements RtcAdapter {
  /** Provider label. */
  readonly provider = "twilio" as const;
  private configured = false;
  private options: TwilioAdapterConfig | null = null;
  private room: Room | null = null;
  private listeners = new Map<AdapterEventName, Set<AdapterListener>>();

  /** True after `configure` succeeds. */
  get isConfigured(): boolean {
    return this.configured;
  }

  /**
   * Initiate the adapter with its required SDK options.
   *
   * @param config Explicit init options (`{ edge? }`).
   * @throws RtcError with code `MISSING_CONFIG` when options are invalid.
   */
  configure(config: RtcAdapterConfig): void {
    this.options = resolveTwilioConfig(config);
    this.configured = true;
  }

  /**
   * Join a Twilio room with a backend-minted token.
   *
   * @param options Room, identity, kind, and token.
   * @throws RtcError with code `NOT_CONFIGURED` or `CONNECT_FAILED`.
   */
  async connect(options: RtcConnectOptions): Promise<void> {
    assertAdapterConfigured(this);
    try {
      this.room = await Video.connect(options.token, {
        name: options.roomName,
        audio: true,
        video: options.kind === "video" ? { width: 640 } : false,
        networkQuality: { local: 1 },
        ...(this.options?.edge !== undefined ? { edge: this.options.edge } : {}),
      });
    } catch (error: unknown) {
      throw toConnectError(error);
    }
    this.watchRoom(this.room);
    this.refresh();
  }

  /**
   * Leave the room and release local tracks.
   *
   * @throws RtcError with code `DISCONNECT_FAILED`.
   */
  async disconnect(): Promise<void> {
    assertAdapterConfigured(this);
    const room = this.room;
    this.room = null;
    if (room === null) {
      return;
    }
    try {
      room.removeAllListeners();
      room.disconnect();
      for (const publication of room.localParticipant.tracks.values()) {
        const track = publication.track;
        if (track.kind === "audio" || track.kind === "video") {
          track.stop();
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Twilio disconnect failed";
      throw new RtcError("DISCONNECT_FAILED", message, "twilio", false);
    }
    this.refresh();
  }

  /**
   * Mute/unmute the local microphone.
   *
   * @param muted Target mute state.
   */
  async setMicrophoneMuted(muted: boolean): Promise<void> {
    assertAdapterConfigured(this);
    for (const track of this.localAudioTracks()) {
      if (muted) {
        track.disable();
      } else {
        track.enable();
      }
    }
    this.refresh();
  }

  /**
   * Mute or unmute remote (speaker) audio playback.
   *
   * The `twilio-video` v2 types expose no per-track playback volume API,
   * so this is a no-op here (remote audio plays at system volume). The
   * Twilio call page is a separate legacy path; direct voice uses Agora.
   *
   * @param muted Target mute state (unused).
   */
  async setSpeakerMuted(_muted: boolean): Promise<void> {
    assertAdapterConfigured(this);
    return;
  }

  /**
   * Publish or release the camera (video sessions).
   *
   * @param enabled True to publish, false to unpublish and release.
   */
  async setCameraEnabled(enabled: boolean): Promise<void> {
    assertAdapterConfigured(this);
    const room = this.room;
    if (room === null) {
      return;
    }
    const existing = this.localVideoTracks();
    if (enabled && existing.length === 0) {
      const track = await Video.createLocalVideoTrack({ width: 640 });
      await room.localParticipant.publishTrack(track);
    }
    if (!enabled) {
      for (const track of existing) {
        room.localParticipant.unpublishTrack(track);
        track.stop();
      }
    }
    this.refresh();
  }

  /**
   * Switch active input device via track restart.
   *
   * @param kind Device family.
   * @param deviceId Target device id.
   */
  async switchDevice(
    kind: "audioinput" | "videoinput",
    deviceId: string,
  ): Promise<void> {
    assertAdapterConfigured(this);
    const targets =
      kind === "audioinput" ? this.localAudioTracks() : this.localVideoTracks();
    for (const track of targets) {
      await track.restart({ deviceId: { exact: deviceId } });
    }
  }

  /**
   * Subscribe to adapter events.
   *
   * @param event Event name.
   * @param listener Callback.
   * @returns Unsubscribe function.
   */
  on(event: AdapterEventName, listener: AdapterListener): () => void {
    const set = this.listeners.get(event) ?? new Set<AdapterListener>();
    set.add(listener);
    this.listeners.set(event, set);
    return () => {
      set.delete(listener);
    };
  }

  private dispatch(payload: AdapterEventPayload): void {
    const name: AdapterEventName =
      "participants" in payload
        ? "participants"
        : "quality" in payload
          ? "network-quality"
          : "adapter-error";
    for (const listener of this.listeners.get(name) ?? []) {
      listener(payload);
    }
  }

  private signal(name: "reconnecting" | "reconnected"): void {
    for (const listener of this.listeners.get(name) ?? []) {
      listener({ quality: "unknown" });
    }
  }

  private localAudioTracks(): LocalAudioTrack[] {
    const room = this.room;
    if (room === null) {
      return [];
    }
    return [...room.localParticipant.audioTracks.values()].map((p) => p.track);
  }

  private localVideoTracks(): LocalVideoTrack[] {
    const room = this.room;
    if (room === null) {
      return [];
    }
    return [...room.localParticipant.videoTracks.values()].map((p) => p.track);
  }

  private watchRoom(room: Room): void {
    room.on("participantConnected", (p) => this.watchParticipant(p));
    room.on("participantDisconnected", () => this.refresh());
    room.on("reconnecting", () => this.signal("reconnecting"));
    room.on("reconnected", () => this.signal("reconnected"));
    room.on("disconnected", () => this.refresh());
    room.localParticipant.on("networkQualityLevelChanged", (level: number) => {
      this.dispatch({ quality: mapTwilioQuality(level) });
    });
    for (const track of this.localAudioTracks()) {
      track.on("enabled", () => this.refresh());
      track.on("disabled", () => this.refresh());
    }
  }

  private watchParticipant(participant: RemoteParticipant): void {
    participant.on("trackSubscribed", () => this.refresh());
    participant.on("trackUnsubscribed", () => this.refresh());
    this.refresh();
  }

  private refresh(): void {
    const room = this.room;
    if (room === null) {
      this.dispatch({ participants: [] });
      return;
    }
    this.dispatch({ participants: buildTwilioParticipants(room) });
  }
}
