"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Unseen-message count. `active` should be true while the user is engaged
 * (pinned to bottom / window focused): counts reset then. While inactive,
 * the count tracks arrivals since the last engaged moment.
 */
export function useChatUnreadCount(total: number, active: boolean) {
  const [unread, setUnread] = useState(0);
  const seenRef = useRef(total);
  const totalRef = useRef(total);
  totalRef.current = total;

  useEffect(() => {
    if (active) {
      seenRef.current = total;
      setUnread(0);
      return;
    }
    setUnread(Math.max(0, total - seenRef.current));
  }, [total, active]);

  const markRead = useCallback(() => {
    seenRef.current = totalRef.current;
    setUnread(0);
  }, []);

  return { unread, markRead };
}
