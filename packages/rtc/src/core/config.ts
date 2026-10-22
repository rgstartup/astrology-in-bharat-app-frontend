import { RtcError } from "./errors";

/**
 * Explicit init options for provider adapters.
 * The package never reads env itself: the app passes exactly what
 * each SDK needs to initiate, plus a room token at join time
 * (see `RtcConnectOptions.token`). No secrets live here —
 * account credentials stay server-side where tokens are minted.
 */

/**
 * Init options for the Twilio adapter.
 * The Twilio client SDK needs no account secrets; the room token
 * supplied at `connect` carries everything. No provider tag: the
 * class itself (`new TwilioAdapter()`) already identifies the provider.
 */
export interface TwilioAdapterConfig {
  /** Optional Twilio edge/region (e.g. `"roaming"`). */
  edge?: string;
}

/**
 * Init options for the Agora adapter.
 * The App ID is public SDK configuration, not a secret.
 * No provider tag: the class itself (`new AgoraAdapter()`)
 * already identifies the provider.
 */
export interface AgoraAdapterConfig {
  /** Agora App ID from the Agora console. */
  appId: string;
  /** Channel profile mode. Defaults to `"rtc"`. */
  mode?: "rtc" | "live";
  /** Video codec. Defaults to `"vp8"`. */
  codec?: "vp8" | "h264";
}

/** Init options accepted by any adapter's `configure`. */
export type RtcAdapterConfig = TwilioAdapterConfig | AgoraAdapterConfig;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readOptionalField(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  return trimmed;
}

/**
 * Validate init options for the Twilio adapter.
 *
 * @param config Caller-supplied options (typed as unknown at the boundary).
 * @returns Validated Twilio configuration.
 * @throws RtcError with code `MISSING_CONFIG` when the options are not an object.
 */
export function resolveTwilioConfig(config: unknown): TwilioAdapterConfig {
  if (!isRecord(config)) {
    throw new RtcError(
      "MISSING_CONFIG",
      "Twilio adapter requires an options object ({ edge? })",
      "twilio",
      false,
    );
  }
  const edge = readOptionalField(config["edge"]);
  if (edge === undefined) {
    return {};
  }
  return { edge };
}

/**
 * Validate init options for the Agora adapter.
 *
 * @param config Caller-supplied options (typed as unknown at the boundary).
 * @returns Validated Agora configuration.
 * @throws RtcError with code `MISSING_CONFIG` when `appId` is absent.
 */
export function resolveAgoraConfig(config: unknown): AgoraAdapterConfig {
  if (!isRecord(config)) {
    throw new RtcError(
      "MISSING_CONFIG",
      "Agora adapter requires an options object ({ appId, mode?, codec? })",
      "agora",
      false,
    );
  }
  const appId = readOptionalField(config["appId"]);
  if (appId === undefined) {
    throw new RtcError(
      "MISSING_CONFIG",
      "Agora adapter requires a non-empty appId",
      "agora",
      false,
    );
  }
  const modeRaw = readOptionalField(config["mode"]);
  const mode: AgoraAdapterConfig["mode"] =
    modeRaw === "live" ? "live" : "rtc";
  const codecRaw = readOptionalField(config["codec"]);
  const codec: AgoraAdapterConfig["codec"] =
    codecRaw === "h264" ? "h264" : "vp8";
  return { appId, mode, codec };
}
