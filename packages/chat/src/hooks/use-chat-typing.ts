"use client";

import { useMemo } from "react";
import type { TypingStatus } from "../types";

/**
 * Derives the typing indicator from a remote-typing boolean. Waterfall input:
 * silent unless the peer is actively typing.
 */
export function useChatTypingDisplay(
  remoteTyping: boolean,
  senderName: string,
): TypingStatus | null {
  return useMemo(() => {
    if (!remoteTyping) return null;
    return { senderName, isTyping: true };
  }, [remoteTyping, senderName]);
}
