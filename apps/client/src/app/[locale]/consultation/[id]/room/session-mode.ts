import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ConsultationMode } from "@/realtime/types/consultation";

/**
 * Normalizes a history session mode into the room's voice vocabulary.
 * Backend history uses `CHAT | AUDIO_CALL | VIDEO_CALL` (nullable on old rows);
 * the room uses `chat | voice | video`.
 *
 * @param mode - Raw mode string from `ChatHistorySessionDto`.
 * @returns Normalized consultation mode, or null when unknown.
 */
export function normalizeHistoryMode(mode: string | null | undefined): ConsultationMode | null {
  if (!mode) return null;
  const normalized = mode.toLowerCase();
  if (normalized === "chat") return "chat";
  if (normalized === "voice" || normalized === "audio_call" || normalized === "audio-call" || normalized === "call") return "voice";
  if (normalized === "video" || normalized === "video_call" || normalized === "video-call") return "video";
  return null;
}

/**
 * Resolves the room's effective mode. Live consultation state wins (it tracks
 * upgrades and reconnects); the latest history session is the instant seed so
 * first paint does not wait for the socket; default is chat.
 *
 * @param sessions - History sessions, oldest-first.
 * @param liveMode - Live mode from `useConsultation().state`, if resolved.
 * @returns Effective room mode.
 */
export function resolveRoomMode(
  sessions: ChatHistorySessionDto[],
  liveMode: ConsultationMode | null | undefined,
): ConsultationMode {
  if (liveMode === "voice" || liveMode === "video" || liveMode === "chat") return liveMode;
  if (sessions.length === 0) return "chat";
  const last = sessions[sessions.length - 1];
  const historyMode = normalizeHistoryMode(last?.mode);
  if (historyMode) return historyMode;
  return "chat";
}
