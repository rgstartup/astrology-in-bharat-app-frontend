import { joinCall } from "@/realtime/topics/call";
import { joinChat, leaveChat } from "@/realtime/topics/chat";
import type { ConsultationRoomsResult } from "@/realtime/types/consultation";

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
