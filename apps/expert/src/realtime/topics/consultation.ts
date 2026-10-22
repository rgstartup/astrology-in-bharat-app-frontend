import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  ConsultationActionAck,
  ConsultationMode,
  ConsultationRoomsResult,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";
import type { JoinChatAck } from "@/realtime/types/chat";

export const CONSULTATION_EVENTS = {
  COMMANDS: {
    REQUEST: "consultation:request",
    ACCEPT: "consultation:accept",
    REJECT: "consultation:reject",
    CANCEL: "consultation:cancel",
    START: "consultation:start",
    JOIN: "consultation:join",
    LEAVE: "consultation:leave",
    PAUSE: "consultation:pause",
    RESUME: "consultation:resume",
    DISCONNECT: "consultation:disconnect",
    END: "consultation:end",
    GET_STATUS: "consultation:get_status",
    VOICE_TOKEN: "consultation:voice_token",
    MEDIA_READY: "consultation:media_ready",
  },
  EVENTS: {
    STATE: "consultation:state",
    INCOMING: "consultation:incoming",
    ACCEPTED: "consultation:accepted",
    REJECTED: "consultation:rejected",
    CANCELLED: "consultation:cancelled",
    STARTED: "consultation:started",
    MEDIA_READY: "consultation:media_ready",
    PAUSED: "consultation:paused",
    RESUMED: "consultation:resumed",
    DISCONNECTED: "consultation:disconnected",
    ENDED: "consultation:ended",
  },
  BUDGET: {
    TICK: "consultation:budget:tick",
    WARNING: "consultation:budget:warning",
    EXHAUSTED: "consultation:budget:exhausted",
    RESTORED: "consultation:budget:restored",
  },
} as const;

/**
  * Consultation room membership: one room covers chat + call.
  * `mode` only selects the billing rate (and a voice token for voice/video).
  */
export const joinRoom = (
  consultationId: number,
  mode: ConsultationMode = "chat",
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CONSULTATION_EVENTS.COMMANDS.JOIN, {
    consultationId,
    mode,
  });

export const leaveRoom = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CONSULTATION_EVENTS.COMMANDS.LEAVE, {
    consultationId,
  });

export const joinConsultationRooms = async (
  consultationId: number,
): Promise<ConsultationRoomsResult> => {
  const room = await joinRoom(consultationId, "chat");
  return { consultationId, room };
};

export const leaveConsultationRooms = async (
  consultationId: number,
): Promise<void> => {
  await leaveRoom(consultationId).catch(() => undefined);
};

export const acceptConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.ACCEPT, {
    consultationId,
  });

export const requestConsultation = (
  consultationId: number,
  expertId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.REQUEST, {
    consultationId,
    expertId,
  });

export const cancelConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.CANCEL, {
    consultationId,
  });

export const rejectConsultation = (
  consultationId: number,
  reason?: string,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.REJECT, {
    consultationId,
    reason,
  });

export const startConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.START, {
    consultationId,
  });

export const pauseConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.PAUSE, {
    consultationId,
  });

export const resumeConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.RESUME, {
    consultationId,
  });

export const endConsultation = (
  consultationId: number,
  reason?: string,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.END, {
    consultationId,
    reason,
  });

export const getConsultationStatus = (
  consultationId: number,
): Promise<ConsultationStatePayload | null> =>
  emitWithAck<ConsultationStatePayload | null>(
    CONSULTATION_EVENTS.COMMANDS.GET_STATUS,
    { consultationId },
  );

/** Renew an expiring Agora voice token for a live consultation. */
export const voiceToken = (
  consultationId: number,
): Promise<{ token: string; tokenExpiresAt: string; channelName: string }> =>
  emitWithAck<{
    token: string;
    tokenExpiresAt: string;
    channelName: string;
  }>(CONSULTATION_EVENTS.COMMANDS.VOICE_TOKEN, { consultationId });

/**
 * Signal that the local side has joined the Agora channel for this
 * consultation. The backend starts billing once both sides report ready
 * (see `ConsultationOrchestratorService.mediaReady`); failure here must
 * never block the voice join, so it is fire-and-forget.
 */
export const mediaReady = (consultationId: number): void => {
  const socket = realtimeSocket();
  if (socket.connected) {
    socket.emit(CONSULTATION_EVENTS.COMMANDS.MEDIA_READY, {
      consultationId,
    });
    return;
  }
  // Socket not connected (e.g. mid-reconnect): emit once on reconnect so the
  // readiness signal is not lost. Listener self-removes after firing.
  const onceConnected = (): void => {
    socket.off("connect", onceConnected);
    socket.emit(CONSULTATION_EVENTS.COMMANDS.MEDIA_READY, {
      consultationId,
    });
  };
  socket.on("connect", onceConnected);
};
