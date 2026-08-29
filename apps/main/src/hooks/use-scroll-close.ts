"use client";

import { useEffect } from "react";

export function useScrollClose(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("scroll", callback, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", callback);
    };
  }, [callback, enabled]);
}
