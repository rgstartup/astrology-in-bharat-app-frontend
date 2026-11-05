export interface MediaControlAck {
  status: string;
  consultationId: number;
  message?: string;
  /**
   * Present on pauseTimer acks when the pause carries a grace window
   * (cancel-dialog hold): server-granted absolute deadline and duration.
   */
  state?: string;
  graceDeadline?: string | null;
  graceDurationSeconds?: number | null;
}

export interface MediaControlPayload {
  consultationId: number;
  actorType: "client" | "expert";
  actorId: number;
  timestamp: string;
}

export interface MicMutedPayload extends MediaControlPayload {}
export interface MicUnmutedPayload extends MediaControlPayload {}
export interface SpeakerMutedPayload extends MediaControlPayload {}
export interface SpeakerUnmutedPayload extends MediaControlPayload {}

export interface TimerPausedPayload extends MediaControlPayload {
  reason?: string;
}

export interface TimerResumedPayload extends MediaControlPayload {}

export interface CameraSwitchedPayload extends MediaControlPayload {
  cameraId?: string;
}
