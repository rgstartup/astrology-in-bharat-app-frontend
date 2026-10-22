import type { RtcProviderName } from "./types";

/**
 * Machine-readable RTC error codes. UI layers switch on `code`
 * to render their own copy; the package ships no strings for display
 * beyond `message` debug detail.
 */
export type RtcErrorCode =
  | "NOT_CONFIGURED"
  | "MISSING_CONFIG"
  | "NOT_IMPLEMENTED"
  | "PERMISSION_DENIED"
  | "DEVICE_NOT_FOUND"
  | "DEVICE_CONSTRAINED"
  | "TOKEN_FAILED"
  | "CONNECT_FAILED"
  | "DISCONNECT_FAILED"
  | "UNSUPPORTED";

/**
 * Unified error for all adapters and the device layer.
 */
export class RtcError extends Error {
  /** Machine-readable failure reason. */
  readonly code: RtcErrorCode;
  /** Adapter that raised the error, when applicable. */
  readonly adapter: RtcProviderName | "device" | "core";
  /** True when retrying the same call may succeed. */
  readonly recoverable: boolean;

  /**
   * Create an RTC error.
   *
   * @param code Machine-readable reason.
   * @param message Human-readable debug detail (not user-facing copy).
   * @param adapter Origin of the failure.
   * @param recoverable Whether a retry may succeed.
   */
  constructor(
    code: RtcErrorCode,
    message: string,
    adapter: RtcError["adapter"] = "core",
    recoverable = false,
  ) {
    super(message);
    this.name = "RtcError";
    this.code = code;
    this.adapter = adapter;
    this.recoverable = recoverable;
  }
}
