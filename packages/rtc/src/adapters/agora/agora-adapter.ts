import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { resolveAgoraConfig } from "../../core/config";
import type { AgoraAdapterConfig, RtcAdapterConfig } from "../../core/config";
import { RtcError } from "../../core/errors";
import {
  assertAdapterConfigured,
  type AdapterEventName,
  type AdapterListener,
  type RtcAdapter,
} from "../../core/provider";
import { releaseMediaStreamTrack } from "../../core/media-track";
import type { RtcConnectOptions, SessionKind } from "../../core/types";
import { buildAgoraParticipants, mapAgoraQuality } from "./agora-mapping";

/**
 * Agora RTC adapter over `agora-rtc-sdk-ng` (bundled dep, top-level
 * import). Import this entrypoint from client code only. Remote audio is
 * auto-played (headless-safe); remote/local video tracks surface on
 * `RtcParticipant.videoTrack` for the app to render.
 */
export class AgoraAdapter implements RtcAdapter {
  /** Provider label. */
  readonly provider = "agora" as const;
  private configured = false;
  private options: AgoraAdapterConfig | null = null;
  private client: IAgoraRTCClient | null = null;
  private audioTrack: IMicrophoneAudioTrack | null = null;
  private videoTrack: ICameraVideoTrack | null = null;
  private identity = "";
  private kind: SessionKind = "voice";
  private speakerMuted = false;
  private listeners = new Map<AdapterEventName, Set<AdapterListener>>();
  // In-flight connection guard: abort join if disconnect() is called during connect()
  private connectingAbortController: AbortController | null = null;

  /** True after `configure` succeeds. */
  get isConfigured(): boolean {
    return this.configured;
  }

  /**
   * Initiate the adapter with its required SDK options.
   *
   * @param config Explicit init options (`{ appId, mode?, codec? }`).
   * @throws RtcError with code `MISSING_CONFIG` when `appId` is absent.
   */
  configure(config: RtcAdapterConfig): void {
    this.options = resolveAgoraConfig(config);
    this.configured = true;
    AgoraRTC.onAutoplayFailed = () => {
      console.warn(
        "[AgoraRTC] Browser blocked audio autoplay; a user gesture is required to resume playback.",
      );
    };
  }

  /**
   * Join an Agora channel with a backend-minted token.
   *
   * @param options Room (channel), identity, kind, and token.
   * @throws RtcError with code `NOT_CONFIGURED` or `CONNECT_FAILED`.
   */
  async connect(options: RtcConnectOptions): Promise<void> {
    assertAdapterConfigured(this);

    // Create abort controller for in-flight cancellation
    this.connectingAbortController = new AbortController();
    const { signal } = this.connectingAbortController;

    const client = AgoraRTC.createClient({
      mode: this.options?.mode ?? "rtc",
      codec: this.options?.codec ?? "vp8",
    });
    this.client = client;
    this.identity = options.identity;
    this.kind = options.kind;
    this.watchClient(client, options.roomName);
    try {
      if (options.kind === "video") {
        const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
        this.audioTrack = mic;
        this.videoTrack = cam;
      } else {
        this.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      }

      // Check for abort before join
      if (signal.aborted) {
        throw new RtcError(
          "CONNECT_ABORTED",
          "Connection aborted",
          "agora",
          false,
        );
      }

      await client.join(
        this.options?.appId ?? "",
        options.roomName,
        options.token,
        null,
      );

      // Check for abort after join
      if (signal.aborted) {
        await this.teardown();
        throw new RtcError(
          "CONNECT_ABORTED",
          "Connection aborted",
          "agora",
          false,
        );
      }

      const tracks =
        this.videoTrack === null
          ? [this.audioTrack]
          : [this.audioTrack, this.videoTrack];
      await client.publish(tracks);
      const localAudioTrack = this.audioTrack?.getMediaStreamTrack();
      console.info("[AgoraRTC] local media published", {
        roomName: options.roomName,
        participantUids: [
          client.uid,
          ...client.remoteUsers.map((user) => user.uid),
        ],
        microphoneEnabled: localAudioTrack?.enabled ?? false,
      });
    } catch (error: unknown) {
      await this.teardown();
      const message =
        error instanceof Error ? error.message : "Agora join failed";
      throw new RtcError("CONNECT_FAILED", message, "agora", true);
    } finally {
      this.connectingAbortController = null;
    }
    this.refresh();
  }

  /**
   * Leave the channel and release local tracks.
   * Aborts any in-flight connection attempt.
   */
  async disconnect(): Promise<void> {
    assertAdapterConfigured(this);

    // Abort in-flight connection if one is in progress
    if (this.connectingAbortController) {
      this.connectingAbortController.abort();
    }

    await this.teardown();
    console.log(`[Agora]: tear down running`);
    this.refresh();
  }

  /**
   * Mute/unmute the local microphone.
   *
   * @param muted Target mute state.
   */
  async setMicrophoneMuted(muted: boolean): Promise<void> {
    assertAdapterConfigured(this);
    await this.audioTrack?.setMuted(muted);
    this.refresh();
  }

  /**
   * Mute or unmute remote (speaker) audio playback.
   * Applies the volume to every currently-subscribed remote audio track, and
   * remembers the target so newly published remote tracks are muted on arrival.
   *
   * @param muted True to silence remote audio, false to restore it.
   */
  async setSpeakerMuted(muted: boolean): Promise<void> {
    assertAdapterConfigured(this);
    this.speakerMuted = muted;
    const volume = muted ? 0 : 100;
    const client = this.client;
    if (client === null) return;
    for (const user of client.remoteUsers) {
      const audioTrack = user.audioTrack;
      if (audioTrack) {
        audioTrack.setVolume(volume);
      }
    }
    this.refresh();
  }

  /**
   * Publish or stop the camera (video sessions).
   *
   * @param enabled True to capture, false to stop.
   */
  async setCameraEnabled(enabled: boolean): Promise<void> {
    assertAdapterConfigured(this);
    if (this.videoTrack === null) {
      throw new RtcError(
        "UNSUPPORTED",
        "Camera unavailable in voice session",
        "agora",
        false,
      );
    }
    await this.videoTrack.setEnabled(enabled);
    this.refresh();
  }

  /**
   * Switch active input device.
   *
   * @param kind Device family.
   * @param deviceId Target device id.
   */
  async switchDevice(
    kind: "audioinput" | "videoinput",
    deviceId: string,
  ): Promise<void> {
    assertAdapterConfigured(this);
    if (kind === "audioinput") {
      await this.audioTrack?.setDevice(deviceId);
    } else {
      await this.videoTrack?.setDevice(deviceId);
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

  private signal(name: "reconnecting" | "reconnected"): void {
    for (const listener of this.listeners.get(name) ?? []) {
      listener({ quality: "unknown" });
    }
  }

  private watchClient(client: IAgoraRTCClient, roomName: string): void {
    client.on("user-published", (user, mediaType) => {
      void (async () => {
        console.info("[AgoraRTC] remote media published", {
          roomName,
          localUid: client.uid,
          remoteUid: user.uid,
          mediaType,
        });
        try {
          await client.subscribe(user, mediaType);
          if (mediaType === "audio") {
            user.audioTrack?.play();
            console.info("[AgoraRTC] remote audio playback requested", {
              roomName,
              localUid: client.uid,
              remoteUid: user.uid,
              hasAudioTrack: Boolean(user.audioTrack),
            });
            // Honor the current speaker-muted state for late-joining peers.
            if (this.speakerMuted && user.audioTrack) {
              user.audioTrack.setVolume(0);
            }
          }
          this.refresh();
        } catch (error: unknown) {
          console.error("[AgoraRTC] remote subscribe/playback failed", {
            roomName,
            localUid: client.uid,
            remoteUid: user.uid,
            mediaType,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    });
    client.on("user-unpublished", () => this.refresh());
    client.on("user-joined", (user) => {
      console.info("[AgoraRTC] remote participant joined", {
        roomName,
        localUid: client.uid,
        remoteUid: user.uid,
      });
      this.refresh();
    });
    client.on("user-left", () => this.refresh());
    client.on("connection-state-change", (cur) => {
      if (cur === "RECONNECTING") {
        this.signal("reconnecting");
      }
      if (cur === "CONNECTED") {
        this.signal("reconnected");
      }
    });
    client.on("network-quality", (stats) => {
      const quality = mapAgoraQuality(
        stats.uplinkNetworkQuality,
        stats.downlinkNetworkQuality,
      );
      for (const listener of this.listeners.get("network-quality") ?? []) {
        listener({ quality });
      }
    });
  }

  private refresh(): void {
    const client = this.client;
    const notify = this.listeners.get("participants") ?? [];
    if (client === null) {
      for (const listener of notify) {
        listener({ participants: [] });
      }
      return;
    }
    const participants = buildAgoraParticipants(client, {
      identity: this.identity,
      kind: this.kind,
      audioTrack: this.audioTrack,
      videoTrack: this.videoTrack,
    });
    for (const listener of notify) {
      listener({ participants });
    }
  }

  private async teardown(): Promise<void> {
    const client = this.client;
    this.client = null;

    // Explicitly stop and close audio track to release hardware microphone
    const audioTrack = this.audioTrack;
    this.audioTrack = null;
    if (audioTrack) {
      let mediaTrack: MediaStreamTrack | null = null;
      try {
        mediaTrack = audioTrack.getMediaStreamTrack();
      } catch {
        // The SDK track may already be closed; still attempt its own cleanup.
      }
      try {
        audioTrack.stop();
      } catch {
        // Still stop the browser track and close the SDK wrapper below.
      }
      try {
        releaseMediaStreamTrack(mediaTrack);
      } catch {
        // Best effort - ignore errors during teardown.
      }
      try {
        audioTrack.close();
      } catch {
        // Best effort - the browser track has already been stopped above.
      }
      console.info("[AgoraRTC] local microphone track released", {
        readyState: mediaTrack?.readyState ?? "unavailable",
      });
    }

    // Explicitly stop and close video track
    const videoTrack = this.videoTrack;
    this.videoTrack = null;
    if (videoTrack) {
      let mediaTrack: MediaStreamTrack | null = null;
      try {
        mediaTrack = videoTrack.getMediaStreamTrack();
      } catch {
        // The SDK track may already be closed; still attempt wrapper cleanup.
      }
      try {
        videoTrack.stop();
      } catch {
        // Still stop the browser track and close the SDK wrapper below.
      }
      try {
        releaseMediaStreamTrack(mediaTrack);
      } catch {
        // Best effort - ignore errors during teardown.
      }
      try {
        videoTrack.close();
      } catch {
        // Best effort - the browser track has already been stopped above.
      }
    }

    if (client !== null) {
      client.removeAllListeners();
      try {
        await client.leave();
      } catch {
        return;
      }
    }
  }
}
