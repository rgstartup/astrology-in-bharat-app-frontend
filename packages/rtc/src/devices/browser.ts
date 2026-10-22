"use client";

import { RtcError } from "./../core/errors";
import type {
  DeviceProvider,
  DevicePermissionState,
  MediaRequestKind,
  MediaRequestResult,
} from "././device-provider";

function hasNavigatorMedia(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (typeof window === "undefined" || window.isSecureContext !== false) &&
    typeof navigator.mediaDevices?.getUserMedia === "function"
  );
}

function toRequestConstraints(kind: MediaRequestKind): MediaStreamConstraints {
  if (kind === "mic") {
    return { audio: true, video: false };
  }
  if (kind === "camera") {
    return { audio: false, video: true };
  }
  return { audio: true, video: true };
}

function mapDomException(name: string, message: string): RtcError {
  if (name === "NotAllowedError" || name === "SecurityError") {
    return new RtcError("PERMISSION_DENIED", message, "device", false);
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return new RtcError("DEVICE_NOT_FOUND", message, "device", false);
  }
  if (name === "OverconstrainedError" || name === "ConstraintNotSatisfiedError") {
    return new RtcError("DEVICE_CONSTRAINED", message, "device", true);
  }
  return new RtcError("CONNECT_FAILED", message, "device", true);
}

/**
 * Browser device layer over `navigator.mediaDevices`.
 * SSR-safe: every method no-ops or reports `unsupported` outside the browser.
 */
export class BrowserDeviceProvider implements DeviceProvider {
  /** Platform label for logs. */
  readonly platform = "browser";

  /**
   * Request mic/camera via `getUserMedia`.
   *
   * @param kind Which media to request.
   * @returns Granted flag plus live stream.
   * @throws RtcError with device-mapped code on denial or missing hardware.
   */
  async requestMedia(kind: MediaRequestKind): Promise<MediaRequestResult> {
    if (!hasNavigatorMedia()) {
      throw new RtcError(
        "UNSUPPORTED",
        "Media devices unavailable (SSR or insecure context)",
        "device",
        false,
      );
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        toRequestConstraints(kind),
      );
      return { granted: true, stream };
    } catch (error: unknown) {
      console.error("[rtc] getUserMedia failed", kind, error);
      if (error instanceof DOMException) {
        throw mapDomException(error.name, error.message);
      }
      const message =
        error instanceof Error ? error.message : "Media request failed";
      throw new RtcError("CONNECT_FAILED", message, "device", true);
    }
  }

  /**
   * Stop all tracks on a previously acquired stream.
   *
   * @param stream Stream to release, if any.
   */
  releaseMedia(stream: MediaStream | null): void {
    if (stream === null) {
      return;
    }
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }

  /**
   * Enumerate input devices. Labels stay empty until permission is granted.
   *
   * @returns Device list, empty outside the browser.
   */
  async enumerate(): Promise<MediaDeviceInfo[]> {
    if (!hasNavigatorMedia()) {
      return [];
    }
    return navigator.mediaDevices.enumerateDevices();
  }

  /**
   * Query permission state without prompting.
   *
   * @param kind Which media to query.
   * @returns Granted/denied/prompt, or unsupported outside the browser.
   */
  async permissionState(kind: "mic" | "camera"): Promise<DevicePermissionState> {
    if (
      typeof navigator === "undefined" ||
      typeof navigator.permissions?.query !== "function"
    ) {
      return "unsupported";
    }
    const name = kind === "mic" ? "microphone" : "camera";
    try {
      const status = await navigator.permissions.query({
        name,
      });
      if (status.state === "granted") {
        return "granted";
      }
      if (status.state === "denied") {
        return "denied";
      }
      return "prompt";
    } catch {
      return "unsupported";
    }
  }
}
