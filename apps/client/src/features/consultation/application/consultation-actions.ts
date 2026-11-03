/**
 * Plain orchestration functions for consultation actions.
 *
 * These hold the business rules (validation, sequencing, side effects) so
 * hooks and components don't inline orchestration logic. Dependencies are
 * injected to keep them pure and testable, but the decision logic lives here.
 */

export type EndConsultationChatDeps = {
  endLiveChat: () => Promise<unknown>;
  clearConsultationRoom: () => void;
  resetVoiceSession: () => void;
  onError: (message: string) => void;
};

export type EndConsultationChatResult = {
  ok: boolean;
  status: string | undefined;
};

/**
 * Ends a live chat consultation.
 *
 * Business rules:
 *   - Only treat the call as successful when the server acks `ended` or
 *     `ignored`; any other status is a failure.
 *   - On success, tear down RTC and reset cached voice state so a restart
 *     begins clean.
 *   - On failure, report via the provided error callback (never throw).
 */
export async function endConsultationChat({
  endLiveChat,
  clearConsultationRoom,
  resetVoiceSession,
  onError,
}: EndConsultationChatDeps): Promise<EndConsultationChatResult> {
  return endLiveChat()
    .then((ack) => {
      const status = (ack as { status?: string } | undefined)?.status;
      const endedOk = status === "ended" || status === "ignored";
      if (!endedOk) {
        onError("Failed to end chat. Please try again.");
        return { ok: false, status };
      }
      clearConsultationRoom();
      resetVoiceSession();
      return { ok: true, status };
    })
    .catch(() => {
      onError("Failed to end chat. Please try again.");
      return { ok: false, status: undefined };
    });
}

export type EndVoiceCallDeps = {
  endVoice: () => Promise<unknown>;
  onError?: (message: string) => void;
};

/**
 * Ends a live voice call via the direct voice RTC layer.
 *
 * Business rules:
 *   - Swallows unexpected rejection and reports via onError when provided,
 *     so the caller can decide whether to surface a UI error.
 */
export async function endVoiceCall({
  endVoice,
  onError,
}: EndVoiceCallDeps): Promise<unknown> {
  return endVoice().catch((err) => {
    onError?.("Failed to end voice call. Please try again.");
    throw err;
  });
}

export type CancelConsultationDeps = {
  pauseLiveChat: (reason?: string) => Promise<unknown>;
  resumeLiveChat: (mode?: "chat" | "voice" | "video") => Promise<unknown>;
  onError?: (message: string) => void;
};

/**
 * Cancels a consultation by placing it on a billing hold, then releasing
 * the hold back to the previous mode.
 *
 * Business rules:
 *   - Always pause with `billing_hold` reason before releasing.
 *   - Release back to voice mode after the hold is acknowledged.
 *   - Surfaces errors via onError when provided.
 */
export async function cancelConsultation({
  pauseLiveChat,
  resumeLiveChat,
  onError,
}: CancelConsultationDeps): Promise<void> {
  return pauseLiveChat("billing_hold")
    .then(() => {
      void resumeLiveChat("voice");
    })
    .catch((err) => {
      onError?.("Failed to cancel consultation. Please try again.");
      throw err;
    });
}
