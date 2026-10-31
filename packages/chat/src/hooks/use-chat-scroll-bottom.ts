"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const NEAR_BOTTOM_PX = 120;

function isNearBottom(element: HTMLElement): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight < NEAR_BOTTOM_PX;
}

function scrollToEnd(element: HTMLElement | null, anchor: HTMLElement | null): void {
  if (element) {
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    return;
  }
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

interface UseChatScrollBottomOptions {
  scrollRef: RefObject<HTMLDivElement | null>;
  anchorRef: RefObject<HTMLDivElement | null>;
  /** Bump to follow (e.g. timeline length); follows only while pinned. */
  followKey: string | number;
  typingActive: boolean;
}

/**
 * Pin-to-bottom tracking for a chat timeline: auto-follows new content only
 * while the user is near the bottom, and exposes a scroll-to-bottom action
 * for the floating button. Never yanks a user who scrolled up to read.
 */
export function useChatScrollBottom(options: UseChatScrollBottomOptions) {
  const { scrollRef, anchorRef, followKey, typingActive } = options;
  const [showButton, setShowButton] = useState(false);
  const pinnedRef = useRef(true);

  const syncPinned = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    pinnedRef.current = isNearBottom(element);
    setShowButton(!pinnedRef.current);
  }, [scrollRef]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    syncPinned();
    element.addEventListener("scroll", syncPinned, { passive: true });
    return () => element.removeEventListener("scroll", syncPinned);
  }, [scrollRef, syncPinned]);

  useEffect(() => {
    if (!pinnedRef.current) return;
    const timer = setTimeout(() => {
      scrollToEnd(scrollRef.current, anchorRef.current);
    }, 100);
    return () => clearTimeout(timer);
  }, [followKey, typingActive, scrollRef, anchorRef]);

  const scrollToBottom = useCallback(() => {
    pinnedRef.current = true;
    setShowButton(false);
    scrollToEnd(scrollRef.current, anchorRef.current);
  }, [scrollRef, anchorRef]);

  return { showButton, scrollToBottom };
}
