"use client";

import { useEventListener } from "@/hooks/external-hooks";

// Wrapper over usehooks-ts' useEventListener to keep our `enabled` toggle.
export function useScrollClose(callback: () => void, enabled = true) {
  useEventListener(
    "scroll",
    () => {
      if (enabled) callback();
    },
    undefined,
    { passive: true },
  );
}
