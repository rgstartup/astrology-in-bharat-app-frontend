/**
 * Device abstraction. Browser implementation ships now;
 * mobile (Expo/Capacitor) later implements this same interface
 * with native permission APIs, no core changes required.
 */

/** Permission outcome in UI-agnostic terms. */
export type DevicePermissionState =
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported";

/** Kind of media the caller wants. */
export type MediaRequestKind = "mic" | "camera" | "mic-and-camera";

/** Result of a permission request. */
export interface MediaRequestResult {
  /** True when at least one track was acquired. */
  granted: boolean;
  /** Live stream when granted and a Stream API exists, else null. */
  stream: MediaStream | null;
}

/** Contract for platform device layers. */
export interface DeviceProvider {
  /** Provider label for logs (`browser`, `expo`, ...). */
  readonly platform: string;

  /**
   * Request microphone and/or camera access.
   *
   * @param kind Which media to request.
   * @returns Granted flag plus live stream when available.
   */
  requestMedia(kind: MediaRequestKind): Promise<MediaRequestResult>;

  /**
   * Release tracks acquired by `requestMedia`.
   *
   * @param stream Stream to stop, if any.
   */
  releaseMedia(stream: MediaStream | null): void;

  /**
   * List available input devices (labels require prior permission).
   *
   * @returns Enumerated devices.
   */
  enumerate(): Promise<MediaDeviceInfo[]>;

  /**
   * Query permission state without prompting.
   *
   * @param kind Which media to query.
   */
  permissionState(kind: "mic" | "camera"): Promise<DevicePermissionState>;
}
