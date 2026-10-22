import { RtcError } from "../core/errors";
import { BrowserDeviceProvider } from "./browser";
import type { DeviceProvider, MediaRequestKind } from "./device-provider";

/** Device families a preflight check can require. */
export type PreflightDevice = "mic" | "camera";

/**
 * Callback invoked only after every requested device is confirmed enabled.
 *
 * @returns Value forwarded to the `withPreflight` caller.
 */
export type PreflightCallback<T> = () => T | Promise<T>;

function toMediaRequestKind(devices: PreflightDevice[]): MediaRequestKind {
  const needsMic = devices.includes("mic");
  const needsCamera = devices.includes("camera");
  if (needsMic && needsCamera) {
    return "mic-and-camera";
  }
  if (needsCamera) {
    return "camera";
  }
  return "mic";
}

/**
 * Ensure the requested browser devices are enabled before invoking a callback.
 * Acquires (then immediately releases) a throwaway stream as a permission
 * probe so the callback's own join/connect never contends for the hardware.
 * The callback never runs when permission is denied or hardware is missing.
 *
 * @param devices Device families to verify (`[]` skips the probe entirely).
 * @param callback Invoked only after all requested devices are enabled.
 * @param provider Device layer to probe; browser `getUserMedia` by default.
 * @returns Whatever the callback resolves to.
 * @throws RtcError with device-mapped code when the probe fails.
 */
export async function withPreflight<T>(
  devices: PreflightDevice[],
  callback: PreflightCallback<T>,
  provider: DeviceProvider = new BrowserDeviceProvider(),
): Promise<T> {
  if (devices.length === 0) {
    return callback();
  }
  const result = await provider.requestMedia(toMediaRequestKind(devices));
  provider.releaseMedia(result.stream);
  if (!result.granted) {
    throw new RtcError(
      "PERMISSION_DENIED",
      "Required devices not enabled",
      "device",
      false,
    );
  }
  return callback();
}
