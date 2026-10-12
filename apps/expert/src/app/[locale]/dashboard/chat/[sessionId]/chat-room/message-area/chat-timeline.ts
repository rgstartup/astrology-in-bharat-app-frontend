import type { ChatMessage } from "../types";

export type TimelineDateItem = {
  kind: "date";
  key: string;
  label: string;
};

export type TimelineSessionItem = {
  kind: "session";
  key: string;
  sessionId: string;
  label: string;
};

export type TimelineMessageItem = {
  kind: "message";
  key: string;
  message: ChatMessage;
};

export type TimelineItem =
  | TimelineDateItem
  | TimelineSessionItem
  | TimelineMessageItem;

const dayKey = (iso?: string): string => {
  if (!iso) return "unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const dateLabel = (iso?: string): string => {
  if (!iso) return "Today";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Today";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return "Today";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
};

/**
 * Group flat messages by `sessionId` (insertion order = chronological).
 * Messages without a session id attach to the trailing group so live
 * traffic never splits the timeline. One `session` divider is emitted
 * between non-empty groups.
 */
export function toTimeline(messages: ChatMessage[]): TimelineItem[] {
  const groups = new Map<string, ChatMessage[]>();
  const order: string[] = [];
  const untagged: ChatMessage[] = [];

  for (const m of messages) {
    const sid = m.sessionId != null ? String(m.sessionId) : null;
    if (!sid) {
      untagged.push(m);
      continue;
    }
    const bucket = groups.get(sid);
    if (bucket) bucket.push(m);
    else {
      groups.set(sid, [m]);
      order.push(sid);
    }
  }

  if (untagged.length > 0) {
    if (order.length === 0) {
      groups.set("__seed__", untagged);
      order.push("__seed__");
    } else {
      const last = groups.get(order[order.length - 1] as string);
      if (last) last.push(...untagged);
    }
  }

  const items: TimelineItem[] = [];
  let lastDay = "";
  let seenGroup = false;

  const pushMessage = (m: ChatMessage) => {
    const day = dayKey(m.createdAt);
    if (day !== lastDay) {
      lastDay = day;
      items.push({
        kind: "date",
        key: `date-${day}-${items.length}`,
        label: dateLabel(m.createdAt),
      });
    }
    items.push({ kind: "message", key: `msg-${m.id}`, message: m });
  };

  for (const sid of order) {
    const bucket = groups.get(sid) ?? [];
    if (bucket.length === 0) continue;
    if (seenGroup) {
      items.push({
        kind: "session",
        key: `session-${sid}`,
        sessionId: sid,
        label: "Connection resumed",
      });
    }
    for (const m of bucket) pushMessage(m);
    seenGroup = true;
  }

  return items;
}
