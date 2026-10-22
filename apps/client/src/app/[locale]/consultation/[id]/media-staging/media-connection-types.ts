/**
 * Media connection step for real-time Agora voice and video staging.
 *
 * Lifecycle upon joining room:
 * 1. token_connecting: Token is being validated and local Agora channel is connecting.
 * 2. peer_waiting: Local Agora channel connected, waiting for the remote peer (expert) to connect.
 * 3. ready: Both parties have emitted media_ready and media stream is starting.
 * 4. timeout: Handshake exceeded timeout window (>20s), prompting retry or return to chat.
 */
export type MediaConnectionStep =
  | "token_connecting"
  | "peer_waiting"
  | "ready"
  | "timeout";

/**
 * Kind of media session being staged.
 */
export type MediaKind = "voice" | "video";

/**
 * Formats user-facing status title for the connection stage.
 *
 * @param kind - Voice or video session kind.
 * @param step - Current connection step.
 * @param expertName - Name of the consulting expert.
 * @returns Human readable title string.
 */
export function getMediaStepTitle(
  kind: MediaKind,
  step: MediaConnectionStep,
  expertName: string,
): string {
  if (step === "token_connecting") {
    if (kind === "video") return "Connecting secure video channel…";
    return "Connecting secure audio channel…";
  }
  if (step === "peer_waiting") {
    return `Waiting for ${expertName} to connect…`;
  }
  if (step === "timeout") {
    return "Connection taking longer than usual";
  }
  return "Connected! Starting session…";
}

/**
 * Formats user-facing descriptive subtitle for the connection stage.
 *
 * @param kind - Voice or video session kind.
 * @param step - Current connection step.
 * @param expertName - Name of the consulting expert.
 * @returns Explanatory subtitle string.
 */
export function getMediaStepSubtitle(
  kind: MediaKind,
  step: MediaConnectionStep,
  expertName: string,
): string {
  if (step === "token_connecting") {
    return "Authenticating encrypted media line…";
  }
  if (step === "peer_waiting") {
    if (kind === "video") {
      return `Your camera and mic are ready. Waiting for ${expertName} to join the video room.`;
    }
    return `Your audio channel is ready. Waiting for ${expertName} to join the call.`;
  }
  if (step === "timeout") {
    return "We are having trouble establishing the media stream with the expert. You can retry or return to chat.";
  }
  return "Both participants connected. Media starting now.";
}
