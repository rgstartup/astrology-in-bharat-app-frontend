/**
 * Shared session-addon types. Chat is the permanent base layer of every
 * consultation; voice or video attach alongside it, never replacing it:
 * chat, chat + voice, chat + video.
 *
 * @remarks Lives in `session/` (not `voice/`) because it covers both addons.
 */
export type SessionKind = "voice" | "video";

export type SessionPhase = "requesting" | "connecting" | "live" | "reconnecting" | "ended";

/**
 * Sentence-case status label for an addon session.
 *
 * @param kind - Voice or video.
 * @param phase - Current addon phase.
 * @returns Human readable status label.
 */
export function getSessionPhaseLabel(kind: SessionKind, phase: SessionPhase): string {
  if (phase === "requesting") return kind === "voice" ? "Calling expert" : "Ringing video";
  if (phase === "connecting") return kind === "voice" ? "Connecting audio" : "Connecting video";
  if (phase === "reconnecting") return "Reconnecting";
  if (phase === "ended") return kind === "voice" ? "Voice ended" : "Video ended";
  return kind === "voice" ? "Voice live" : "Video live";
}

/**
 * Combined room-mode label for the header and sidebar.
 *
 * @param kind - Active addon, or null for chat-only.
 * @returns Combined mode label.
 */
export function getRoomModeLabel(kind: SessionKind | null): string {
  if (kind === "voice") return "Chat + voice";
  if (kind === "video") return "Chat + video";
  return "Chat";
}
