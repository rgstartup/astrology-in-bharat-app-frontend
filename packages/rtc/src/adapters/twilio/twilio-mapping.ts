import type { NetworkQuality, RtcParticipant } from "./../../core/types";
import type { Room } from "twilio-video";

/**
 * Map a Twilio network quality level (0–5) to the package scale.
 *
 * @param level Twilio `networkQualityLevel` (0 = unknown).
 * @returns Coarse network quality.
 */
export function mapTwilioQuality(level: number): NetworkQuality {
  if (level <= 0) {
    return "unknown";
  }
  if (level === 1) {
    return "poor";
  }
  if (level === 2) {
    return "fair";
  }
  if (level === 3) {
    return "good";
  }
  return "excellent";
}

/**
 * Build the participant snapshot for a Twilio room, local first.
 *
 * @param room Active Twilio room.
 * @returns Participants including live video tracks for app rendering.
 */
export function buildTwilioParticipants(room: Room): RtcParticipant[] {
  const local = room.localParticipant;
  const audioOn = [...local.audioTracks.values()].some((p) => p.isTrackEnabled);
  const videoPubs = [...local.videoTracks.values()];
  const participants: RtcParticipant[] = [
    {
      identity: local.identity,
      isLocal: true,
      audioEnabled: audioOn,
      videoEnabled: videoPubs.length > 0,
      videoTrack: videoPubs[0]?.track.mediaStreamTrack ?? null,
    },
  ];
  for (const remote of room.participants.values()) {
    const audioSubs = [...remote.audioTracks.values()].filter((p) => p.isSubscribed);
    const videoSubs = [...remote.videoTracks.values()].filter((p) => p.isSubscribed);
    participants.push({
      identity: remote.identity,
      isLocal: false,
      audioEnabled: audioSubs.some((p) => p.isTrackEnabled),
      videoEnabled: videoSubs.length > 0,
      videoTrack: videoSubs[0]?.track?.mediaStreamTrack ?? null,
    });
  }
  return participants;
}
