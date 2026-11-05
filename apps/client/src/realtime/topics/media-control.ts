import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  MediaControlAck,
  MicMutedPayload,
  MicUnmutedPayload,
  SpeakerMutedPayload,
  SpeakerUnmutedPayload,
  TimerPausedPayload,
  TimerResumedPayload,
  CameraSwitchedPayload,
} from "@/realtime/types/media-control";

/**
 * Media control events for active voice/video consultations.
 * Inbound commands with ACKs for budget-critical operations.
 */
export const MEDIA_CONTROL_EVENTS = {
  COMMANDS: {
    MUTE_MIC: "consultation:media_control:mute_mic",
    UNMUTE_MIC: "consultation:media_control:unmute_mic",
    MUTE_SPEAKER: "consultation:media_control:mute_speaker",
    UNMUTE_SPEAKER: "consultation:media_control:unmute_speaker",
    PAUSE_TIMER: "consultation:media_control:pause_timer",
    RESUME_TIMER: "consultation:media_control:resume_timer",
    SWITCH_CAMERA: "consultation:media_control:switch_camera",
  },
  EVENTS: {
    MIC_MUTED: "consultation:media_control:mic_muted",
    MIC_UNMUTED: "consultation:media_control:mic_unmuted",
    SPEAKER_MUTED: "consultation:media_control:speaker_muted",
    SPEAKER_UNMUTED: "consultation:media_control:speaker_unmuted",
    TIMER_PAUSED: "consultation:media_control:timer_paused",
    TIMER_RESUMED: "consultation:media_control:timer_resumed",
    CAMERA_SWITCHED: "consultation:media_control:camera_switched",
  },
} as const;

/**
 * Mute local microphone and notify the peer.
 */
export const muteMic = (consultationId: number): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.MUTE_MIC, {
    consultationId,
  });

/**
 * Unmute local microphone and notify the peer.
 */
export const unmuteMic = (consultationId: number): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.UNMUTE_MIC, {
    consultationId,
  });

/**
 * Mute local speaker (playback) and notify the peer.
 * Note: This signals a local preference; the remote peer may choose to respect it.
 */
export const muteSpeaker = (consultationId: number): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.MUTE_SPEAKER, {
    consultationId,
  });

/**
 * Unmute local speaker and notify the peer.
 */
export const unmuteSpeaker = (consultationId: number): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.UNMUTE_SPEAKER, {
    consultationId,
  });

/**
 * Pause the consultation billing timer (goes through orchestrator.pause with billing_hold reason).
 * Budget-critical operation requiring ACK.
 *
 * @param intent - 'cancel_dialog' asks the server to arm the cancel-dialog
 *   grace window; the ack then carries the server-granted `graceDeadline`.
 */
export const pauseTimer = (
  consultationId: number,
  intent?: "cancel_dialog",
): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.PAUSE_TIMER, {
    consultationId,
    ...(intent ? { intent } : {}),
  });

/**
 * Resume the consultation billing timer (goes through orchestrator.resume).
 * Budget-critical operation requiring ACK.
 */
export const resumeTimer = (
  consultationId: number,
): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.RESUME_TIMER, {
    consultationId,
  });

/**
 * Switch the local camera device and notify the peer.
 */
export const switchCamera = (
  consultationId: number,
  cameraId?: string,
): Promise<MediaControlAck> =>
  emitWithAck<MediaControlAck>(MEDIA_CONTROL_EVENTS.COMMANDS.SWITCH_CAMERA, {
    consultationId,
    cameraId,
  });

/**
 * Subscribe to media control events from the server.
 */
export const subscribeMediaControlEvents = (
  consultationId: number,
  handlers: {
    onMicMuted?: (payload: MicMutedPayload) => void;
    onMicUnmuted?: (payload: MicUnmutedPayload) => void;
    onSpeakerMuted?: (payload: SpeakerMutedPayload) => void;
    onSpeakerUnmuted?: (payload: SpeakerUnmutedPayload) => void;
    onTimerPaused?: (payload: TimerPausedPayload) => void;
    onTimerResumed?: (payload: TimerResumedPayload) => void;
    onCameraSwitched?: (payload: CameraSwitchedPayload) => void;
  },
): (() => void) => {
  const socket = realtimeSocket();

  const handleMicMuted = (payload: MicMutedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onMicMuted?.(payload);
  };

  const handleMicUnmuted = (payload: MicUnmutedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onMicUnmuted?.(payload);
  };

  const handleSpeakerMuted = (payload: SpeakerMutedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onSpeakerMuted?.(payload);
  };

  const handleSpeakerUnmuted = (payload: SpeakerUnmutedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onSpeakerUnmuted?.(payload);
  };

  const handleTimerPaused = (payload: TimerPausedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onTimerPaused?.(payload);
  };

  const handleTimerResumed = (payload: TimerResumedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onTimerResumed?.(payload);
  };

  const handleCameraSwitched = (payload: CameraSwitchedPayload) => {
    if (Number(payload.consultationId) !== consultationId) return;
    handlers.onCameraSwitched?.(payload);
  };

  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.MIC_MUTED, handleMicMuted);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.MIC_UNMUTED, handleMicUnmuted);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.SPEAKER_MUTED, handleSpeakerMuted);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.SPEAKER_UNMUTED, handleSpeakerUnmuted);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.TIMER_PAUSED, handleTimerPaused);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.TIMER_RESUMED, handleTimerResumed);
  socket.on(MEDIA_CONTROL_EVENTS.EVENTS.CAMERA_SWITCHED, handleCameraSwitched);

  return () => {
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.MIC_MUTED, handleMicMuted);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.MIC_UNMUTED, handleMicUnmuted);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.SPEAKER_MUTED, handleSpeakerMuted);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.SPEAKER_UNMUTED, handleSpeakerUnmuted);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.TIMER_PAUSED, handleTimerPaused);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.TIMER_RESUMED, handleTimerResumed);
    socket.off(MEDIA_CONTROL_EVENTS.EVENTS.CAMERA_SWITCHED, handleCameraSwitched);
  };
};
