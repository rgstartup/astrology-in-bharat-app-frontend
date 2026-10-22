"use client";

import { useEffect, useState } from "react";

interface UseChatMessagesOptions<TLive, TMsg> {
  /** Seeded history; replaced wholesale only by the returned setter. */
  initial: TMsg[];
  /** Live socket payloads merged in arrival order. */
  live: TLive[];
  /** Dedup key for a live payload. */
  liveKey: (message: TLive) => string;
  /** All known keys for a base message (ids + wire keys — covers echo races). */
  baseKeys: (message: TMsg) => string[];
  /** Normalize a fresh live payload into a base message. */
  toMessage: (message: TLive) => TMsg;
}

/**
 * Owns the room message list: seeded history plus live traffic merged with
 * key-based dedup. Pass a `live` array that grows (never shrinks); each new
 * payload is normalized once and appended unless already known.
 */
export function useChatMessages<TLive, TMsg>(options: UseChatMessagesOptions<TLive, TMsg>) {
  const { initial, live, liveKey, baseKeys, toMessage } = options;
  const [messages, setMessages] = useState<TMsg[]>(initial);

  useEffect(() => {
    if (live.length === 0) return;
    setMessages((prev) => {
      const known = new Set<string>();
      for (const message of prev) {
        for (const key of baseKeys(message)) known.add(key);
      }
      const fresh = live.filter((message) => !known.has(liveKey(message))).map(toMessage);
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, [live, liveKey, baseKeys, toMessage]);

  return { messages, setMessages };
}
