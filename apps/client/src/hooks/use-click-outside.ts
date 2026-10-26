"use client";

import type { RefObject } from "react";
import { useOnClickOutside } from "@/hooks/external-hooks";

// Wrapper over usehooks-ts' useOnClickOutside to keep our `enabled` toggle.
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  enabled = true,
) {
  // Cast is safe: the hook guards on `ref.current` before use.
  useOnClickOutside<T>(ref as RefObject<T>, () => {
    if (enabled) callback();
  });
}
