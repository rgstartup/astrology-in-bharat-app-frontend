import { useCallback, useState } from "react";

/**
 * Checks microphone access and retains the prep flow's grant/denial state.
 *
 * @returns Current microphone state and permission/recovery handlers.
 */
export function useConsultationMicrophone() {
  const [micGranted, setMicGranted] = useState(false);
  const [micDenied, setMicDenied] = useState(false);

  const checkMicPermission = useCallback(async (): Promise<boolean> => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setMicDenied(true);
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicGranted(true);
      setMicDenied(false);
      return true;
    } catch {
      setMicGranted(false);
      setMicDenied(true);
      return false;
    }
  }, []);

  const clearMicDenied = useCallback(() => setMicDenied(false), []);

  return { micGranted, micDenied, checkMicPermission, clearMicDenied };
}
