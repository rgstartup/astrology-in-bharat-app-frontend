import { useMemo } from "react";
import { toTimeline } from "../utils/timeline";
import type { ChatMessage, SessionMeta, TimelineItem } from "../types";

/**
 * Memoized render timeline. Pass session metas when the backend provides
 * explicit session buckets (mode-aware dividers); omit to group purely by
 * each message's `sessionId`.
 */
export function useChatTimeline(messages: ChatMessage[], sessions?: SessionMeta[]): TimelineItem[] {
  return useMemo(() => toTimeline(messages, sessions), [messages, sessions]);
}
