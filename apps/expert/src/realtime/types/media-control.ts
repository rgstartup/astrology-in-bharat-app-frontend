export interface MediaControlAck {
  status: string;
  consultationId: number;
  message?: string;
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
