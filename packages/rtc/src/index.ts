import {
  resolveAgoraConfig,
  resolveTwilioConfig,
} from "././core/config";
import type {
  AgoraAdapterConfig,
  RtcAdapterConfig,
  TwilioAdapterConfig,
} from "././core/config";
import { RtcError } from "././core/errors";
import type { RtcErrorCode } from "././core/errors";
import { assertAdapterConfigured, createRtcSession } from "././core/provider";
import type {
  AdapterEventName,
  AdapterEventPayload,
  AdapterListener,
  RtcAdapter,
  RtcSession,
  RtcSnapshotListener,
} from "././core/provider";
import type {
  LocalMediaState,
  NetworkQuality,
  RtcConnectOptions,
  RtcEventName,
  RtcParticipant,
  RtcPhase,
  RtcProviderName,
  RtcSnapshot,
  RtcTokenProvider,
  SessionKind,
} from "././core/types";

export { resolveAgoraConfig, resolveTwilioConfig };
export { AGORA_CSP_REQUIREMENTS } from "./adapters/agora/csp-requirements";
export type {
  AgoraAdapterConfig,
  RtcAdapterConfig,
  TwilioAdapterConfig,
};
export { RtcError };
export type { RtcErrorCode };
export { assertAdapterConfigured, createRtcSession };

/**
 * Creates the standard configured RTC session using the environment configuration.
 * Provider details are abstracted away inside @repo/rtc.
 */
export function createDefaultRtcSession(): RtcSession {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
  if (!appId) {
    throw new Error(
      "Real-time audio/video is not configured. Missing environment credentials.",
    );
  }
  const { AgoraAdapter } = require("./adapters/agora/agora-adapter");
  const adapter = new AgoraAdapter();
  adapter.configure({ appId });
  return createRtcSession(adapter);
}
export type {
  AdapterEventName,
  AdapterEventPayload,
  AdapterListener,
  RtcAdapter,
  RtcSession,
  RtcSnapshotListener,
};
export type {
  LocalMediaState,
  NetworkQuality,
  RtcConnectOptions,
  RtcEventName,
  RtcParticipant,
  RtcPhase,
  RtcProviderName,
  RtcSnapshot,
  RtcTokenProvider,
  SessionKind,
};
