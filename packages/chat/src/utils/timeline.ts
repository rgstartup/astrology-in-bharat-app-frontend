import type { ChatMessage, SessionMeta, TimelineItem } from "../types";

const dayKey = (iso?: string): string => {
  if (!iso) return "unknown";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const dateLabel = (iso?: string): string => {
  if (!iso) return "Earlier";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Earlier";
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

const MODE_LABEL: Record<string, string> = {
  CHAT: "Connection resumed",
  AUDIO_CALL: "Switched to audio call",
  VIDEO_CALL: "Switched to video call",
};

export const sessionLabel = (current: SessionMeta, previous: SessionMeta | null): string => {
  if (!previous) return "";
  const cur = (current.mode ?? "CHAT").toUpperCase();
  const prev = (previous.mode ?? "CHAT").toUpperCase();
  if (cur !== prev) return MODE_LABEL[cur] ?? "Connection resumed";
  return "Connection resumed";
};

function sidOf(message: ChatMessage): string | null {
  return message.sessionId != null ? String(message.sessionId) : null;
}

/**
 * Build a render timeline from a flat message list, optionally bucketed by
 * explicit session metas. Without sessions, messages group by `sessionId`
 * in insertion order and untagged live traffic joins the trailing group;
 * with sessions, only sessions that contain messages render, and untagged
 * traffic trails after them. Emits one `date` marker per day and one
 * `session` divider between non-empty groups.
 */
export function toTimeline(messages: ChatMessage[], sessions?: SessionMeta[]): TimelineItem[] {
  if (sessions) return toTimelineWithSessions(messages, sessions);
  return toTimelineGrouped(messages);
}

function pushInto(
  items: TimelineItem[],
  lastDay: { value: string },
  message: ChatMessage,
): void {
  const day = dayKey(message.createdAt);
  if (day !== lastDay.value) {
    lastDay.value = day;
    items.push({
      kind: "date",
      key: `date-${day}-${items.length}`,
      label: dateLabel(message.createdAt),
    });
  }
  items.push({ kind: "message", key: `msg-${message.id}`, message });
}

function toTimelineGrouped(messages: ChatMessage[]): TimelineItem[] {
  const groups = new Map<string, ChatMessage[]>();
  const order: string[] = [];
  const untagged: ChatMessage[] = [];

  for (const message of messages) {
    const sid = sidOf(message);
    if (!sid) {
      untagged.push(message);
      continue;
    }
    const bucket = groups.get(sid);
    if (bucket) bucket.push(message);
    else {
      groups.set(sid, [message]);
      order.push(sid);
    }
  }

  if (untagged.length > 0) {
    if (order.length === 0) {
      groups.set("__seed__", untagged);
      order.push("__seed__");
    } else {
      const lastSid = order[order.length - 1];
      if (lastSid !== undefined) {
        const last = groups.get(lastSid);
        if (last) last.push(...untagged);
      }
    }
  }

  const items: TimelineItem[] = [];
  const lastDay = { value: "" };
  let seenGroup = false;

  for (const sid of order) {
    const bucket = groups.get(sid) ?? [];
    if (bucket.length === 0) continue;
    if (seenGroup) {
      items.push({ kind: "session", key: `session-${sid}`, sessionId: sid, label: "Connection resumed" });
    }
    for (const message of bucket) pushInto(items, lastDay, message);
    seenGroup = true;
  }

  return items;
}

function toTimelineWithSessions(messages: ChatMessage[], sessions: SessionMeta[]): TimelineItem[] {
  const byId = new Map<string, ChatMessage[]>();
  const untagged: ChatMessage[] = [];

  for (const message of messages) {
    const sid = sidOf(message);
    if (sid && sessions.some((s) => String(s.sessionId) === sid)) {
      const bucket = byId.get(sid);
      if (bucket) bucket.push(message);
      else byId.set(sid, [message]);
    } else {
      untagged.push(message);
    }
  }

  const ordered = sessions.filter((s) => (byId.get(String(s.sessionId)) ?? []).length > 0);
  const items: TimelineItem[] = [];
  const lastDay = { value: "" };
  let prevMeta: SessionMeta | null = null;

  for (const session of ordered) {
    const sid = String(session.sessionId);
    const meta: SessionMeta = {
      sessionId: sid,
      mode: session.mode ?? null,
      startedAt: session.startedAt ?? null,
    };
    if (prevMeta) {
      const entry: TimelineItem = {
        kind: "session",
        key: `session-${sid}`,
        sessionId: sid,
        label: sessionLabel(meta, prevMeta),
      };
      if (meta.startedAt) entry.startedAt = meta.startedAt;
      items.push(entry);
    }
    for (const message of byId.get(sid) ?? []) pushInto(items, lastDay, message);
    prevMeta = meta;
  }

  if (untagged.length > 0) {
    const first = untagged[0];
    const explicitSid = first?.sessionId ? String(first.sessionId) : null;
    const lastOrdered = ordered[ordered.length - 1];
    if (prevMeta && ordered.length > 0 && explicitSid && lastOrdered && explicitSid !== String(lastOrdered.sessionId)) {
      items.push({
        kind: "session",
        key: `session-${explicitSid}`,
        sessionId: explicitSid,
        label: "Connection resumed",
      });
    }
    for (const message of untagged) pushInto(items, lastDay, message);
  }

  return items;
}
