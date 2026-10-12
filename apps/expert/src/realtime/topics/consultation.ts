import { emitWithAck } from "@/realtime/socket";
import { joinCall } from "@/realtime/topics/call";
import { joinChat, leaveChat } from "@/realtime/topics/chat";
import type {
  ConsultationActionAck,
  ConsultationRoomsResult,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";

export const CONSULTATION_EVENTS = {
  COMMANDS: {
    REQUEST: "consultation:request",
    ACCEPT: "consultation:accept",
    REJECT: "consultation:reject",
    CANCEL: "consultation:cancel",
    START: "consultation:start",
    PAUSE: "consultation:pause",
    RESUME: "consultation:resume",
    DISCONNECT: "consultation:disconnect",
    END: "consultation:end",
    GET_STATUS: "consultation:get_status",
  },
  EVENTS: {
    STATE: "consultation:state",
    INCOMING: "consultation:incoming",
    ACCEPTED: "consultation:accepted",
    REJECTED: "consultation:rejected",
    CANCELLED: "consultation:cancelled",
    STARTED: "consultation:started",
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
  * Consultation room membership: a consultation rides on both the chat and
  * the call rooms (`chat:{id}` / `call:{id}`). One helper instead of two joins.
  */
export const joinConsultationRooms = async (
  consultationId: number,
): Promise<ConsultationRoomsResult> => {
  const [chat, call] = await Promise.all([
    joinChat(consultationId),
    joinCall(consultationId),
  ]);
  return { consultationId, chat, call };
};

export const leaveConsultationRooms = async (
  consultationId: number,
): Promise<void> => {
  await leaveChat(consultationId).catch(() => undefined);
};

export const acceptConsultation = (
  consultationId: number,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.ACCEPT, {
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
