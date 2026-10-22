import type {
  NetworkQuality,
  RtcParticipant,
  SessionKind,
} from "./../../core/types";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

/**
 * Map Agora uplink/downlink quality (0–6) to the package scale.
 *
 * @param uplink Agora uplink score.
 * @param downlink Agora downlink score.
 * @returns Coarse network quality (worst of the two legs).
 */
export function mapAgoraQuality(uplink: number, downlink: number): NetworkQuality {
  const worst = Math.max(uplink, downlink);
  if (worst <= 0) {
    return "unknown";
  }
  if (worst === 1) {
    return "excellent";
  }
  if (worst === 2) {
    return "good";
  }
  if (worst === 3) {
    return "fair";
  }
  return "poor";
}

/**
 * Map an Agora remote user to a participant.
 *
 * @param user Agora remote user.
 * @returns Participant snapshot.
 */
export function mapAgoraRemoteUser(user: IAgoraRTCRemoteUser): RtcParticipant {
  return {
    identity: String(user.uid),
    isLocal: false,
    audioEnabled: user.hasAudio,
    videoEnabled: user.hasVideo,
    videoTrack: user.videoTrack?.getMediaStreamTrack() ?? null,
  };
}

/** Local state needed to build the local participant entry. */
export interface AgoraLocalState {
  /** App-level identity passed at join. */
  identity: string;
  /** Session media mode. */
  kind: SessionKind;
  /** Live microphone track, if any. */
  audioTrack: IMicrophoneAudioTrack | null;
  /** Live camera track, if any. */
  videoTrack: ICameraVideoTrack | null;
}

/**
 * Build the participant snapshot for an Agora client, local first.
 *
 * @param client Active Agora client.
 * @param local Local track state.
 * @returns Participants including live video tracks for app rendering.
 */
export function buildAgoraParticipants(
  client: IAgoraRTCClient,
  local: AgoraLocalState,
): RtcParticipant[] {
  const participants: RtcParticipant[] = [
    {
      identity: local.identity,
      isLocal: true,
      audioEnabled: local.audioTrack === null ? false : !local.audioTrack.muted,
      videoEnabled: local.videoTrack !== null && local.kind === "video",
      videoTrack: local.videoTrack?.getMediaStreamTrack() ?? null,
    },
  ];
  for (const user of client.remoteUsers) {
    participants.push(mapAgoraRemoteUser(user));
  }
  return participants;
}
