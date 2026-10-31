"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@repo/design/shadcn";
import { withPreflight, type PreflightDevice } from "@repo/rtc/devices";
import { RtcError } from "@repo/rtc";
import type { ConsultationMode } from "@/store/consultationPrepStore";

/**
 * Inline recovery hint shown when device access fails before a
 * voice/video consultation starts.
 * - `blocked`: already denied at browser level — user must unblock via
 *   address-bar site settings and reload.
 * - `denied`: dismissed or refused at the live browser prompt — retrying
 *   re-triggers the prompt.
 * - `missing`: no hardware found — user must connect a device.
 */
export type DeviceHintKind = "blocked" | "denied" | "missing";

/**
 * Persisted once the user refuses device access, so the next attempt skips
 * the (now pointless) browser prompt and shows unblock steps instead.
 */
const DEVICE_DENIED_STORAGE_KEY = "consultation-prep:devices-denied";

function clearDeniedMark(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DEVICE_DENIED_STORAGE_KEY);
  } catch {
    return;
  }
}

/**
 * Microphone/camera gate for voice and video consultation starts, plus the
 * recovery-hint state shown when the probe fails.
 */
export function useDevicePreflight() {
  const [deviceHint, setDeviceHint] = useState<DeviceHintKind | null>(null);

  useEffect(() => {
    clearDeniedMark();
  }, []);

  const clearDeviceHint = useCallback(() => {
    setDeviceHint(null);
  }, []);

  /**
   * Probes required devices before start. Chat mode always passes through.
   *
   * @returns false when the start must be aborted (hint set or hard error).
   */
  const runPreflight = useCallback(
    async (mode: ConsultationMode): Promise<boolean> => {
      if (mode !== "voice" && mode !== "video") return true;
      if (typeof window !== "undefined" && window.isSecureContext === false) {
        clearDeniedMark();
        toast.error(
          "Microphone requires HTTPS or localhost. Chrome blocks mic prompts on plain HTTP LAN IPs. Enable chrome://flags/#unsafely-treat-insecure-origin-as-secure to test on mobile.",
        );
        return false;
      }
      const devices: PreflightDevice[] =
        mode === "video" ? ["mic", "camera"] : ["mic"];
      setDeviceHint(null);
      clearDeniedMark();
      try {
        await withPreflight(devices, async () => undefined);
        return true;
      } catch (error) {
        if (error instanceof RtcError && error.code === "DEVICE_NOT_FOUND") {
          setDeviceHint("missing");
        } else if (error instanceof RtcError && error.code === "UNSUPPORTED") {
          toast.error(error.message);
        } else {
          setDeviceHint("denied");
        }
        return false;
      }
    },
    [],
  );

  /**
   * Retry after the user unblocks devices via browser site settings:
   * forget the denial mark so the next attempt probes live again.
   */
  const resetDevices = useCallback(() => {
    clearDeniedMark();
    setDeviceHint(null);
  }, []);

  return { deviceHint, clearDeviceHint, runPreflight, resetDevices };
}
