import { AgoraAdapter } from "./agora-adapter";
import { createRtcSession } from "./../../core/provider";
import type { RtcSession } from "./../../core/provider";

export { AgoraAdapter };

/**
 * Create a headless RTC session over a freshly configured Agora adapter.
 * Single place that owns the appId-guard plus adapter wiring, so the client
 * and expert apps never drift on SDK bootstrap.
 *
 * @param appId Agora App ID (public SDK config, never a secret).
 * @returns Session owning phase + snapshot state (unsubscribed until the
 * caller subscribes).
 * @throws Error with a voice-not-configured message when `appId` is empty.
 */
export function createAgoraSession(appId: string): RtcSession {
  if (!appId) {
    throw new Error(
      "Voice is not configured. Missing NEXT_PUBLIC_AGORA_APP_ID.",
    );
  }
  const adapter = new AgoraAdapter();
  adapter.configure({ appId });
  return createRtcSession(adapter);
}
