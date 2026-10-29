/**
 * Shared voice-upgrade phase type for the consultation room.
 *
 * Lifecycle after the user confirms "Upgrade to voice":
 * requesting (dialing) -> connecting -> live -> reconnecting? -> live
 * -> ended (drops back to chat).
 *
 * @remarks Kept in a dependency-free module so stories, the stage root,
 * and the sidebar can share one vocabulary.
 */
export type VoicePhase = "requesting" | "connecting" | "live" | "reconnecting" | "ended";

/**
 * Sentence-case status label for a voice phase.
 *
 * @param phase - Current voice phase.
 * @returns Human readable status label.
 */
export function getVoicePhaseLabel(phase: VoicePhase): string {
  if (phase === "requesting") return "Calling expert";
  if (phase === "connecting") return "Connecting audio";
  if (phase === "reconnecting") return "Reconnecting";
  if (phase === "ended") return "Voice ended";
  return "Voice live";
}

/**
 * Helper copy for a voice phase shown under the expert name.
 *
 * @param phase - Current voice phase.
 * @returns Helper sentence.
 */
export function getVoicePhaseHelper(phase: VoicePhase): string {
  if (phase === "requesting") return "Ringing the expert. Chat history is kept.";
  if (phase === "connecting") return "Securing your audio channel.";
  if (phase === "reconnecting") return "Audio dropped. Holding your session timer.";
  if (phase === "ended") return "You are back on chat. Nothing was lost.";
  return "Chat is paused while you talk. Billing continues at the voice rate.";
}
