"use client";

import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ChatMessage } from "@/lib/types";

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
  startedAt?: string;
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

export type SessionMeta = {
  sessionId: string;
  mode?: string | null;
  startedAt?: string | null;
};

const dayKey = (iso?: string): string => {
  if (!iso) return "unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const dateLabel = (iso?: string): string => {
  if (!iso) return "Earlier";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Earlier";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return "Yesterday";
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

const MODE_LABEL: Record<string, string> = {
  CHAT: "Connection resumed",
  AUDIO_CALL: "Switched to audio call",
  VIDEO_CALL: "Switched to video call",
};

export const sessionLabel = (
  current: SessionMeta,
  previous: SessionMeta | null,
): string => {
  if (!previous) return "";
  const cur = (current.mode ?? "CHAT").toUpperCase();
  const prev = (previous.mode ?? "CHAT").toUpperCase();
  if (cur !== prev) return MODE_LABEL[cur] ?? "Connection resumed";
  return "Connection resumed";
};

/**
 * Build a render timeline from session buckets + a flat message list.
 * Sessions arrive oldest-first; messages carry `sessionId` from the seed
 * (live messages without one attach to the trailing session).
 * Emits one `date` marker per day and one `session` divider between sessions
 * that actually contain messages.
 */
export function toTimeline(
  sessions: ChatHistorySessionDto[] | SessionMeta[],
  messages: ChatMessage[],
): TimelineItem[] {
  const byId = new Map<string, ChatMessage[]>();
  const untagged: ChatMessage[] = [];
  for (const m of messages) {
    const sid = m.sessionId != null ? String(m.sessionId) : null;
    if (sid && sessions.some((s) => String(s.sessionId) === sid)) {
      const bucket = byId.get(sid);
      if (bucket) bucket.push(m);
      else byId.set(sid, [m]);
    } else {
      untagged.push(m);
    }
  }

  const ordered = sessions.filter(
    (s) => (byId.get(String(s.sessionId)) ?? []).length > 0,
  );
  const trailingUntagged = untagged.length > 0;
  const items: TimelineItem[] = [];
  let lastDay = "";
  let prevMeta: SessionMeta | null = null;

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

  for (const s of ordered) {
    const sid = String(s.sessionId);
    const meta: SessionMeta = {
      sessionId: sid,
      mode: (s as SessionMeta).mode ?? null,
      startedAt: (s as SessionMeta).startedAt ?? null,
    };
    const bucket = byId.get(sid) ?? [];
    if (prevMeta) {
      items.push({
        kind: "session",
        key: `session-${sid}`,
        sessionId: sid,
        label: sessionLabel(meta, prevMeta),
        ...(meta.startedAt ? { startedAt: meta.startedAt } : {}),
      });
    }
    for (const m of bucket) pushMessage(m);
    prevMeta = meta;
  }

  if (trailingUntagged) {
    const explicitSid = untagged[0]?.sessionId
      ? String(untagged[0]?.sessionId)
      : null;
    if (
      prevMeta &&
      ordered.length > 0 &&
      explicitSid &&
      explicitSid !== String(ordered[ordered.length - 1]?.sessionId)
    ) {
      items.push({
        kind: "session",
        key: `session-${explicitSid}`,
        sessionId: explicitSid,
        label: "Connection resumed",
      });
    }
    for (const m of untagged) pushMessage(m);
  }

  if (items.length > 0 && items[0]?.kind !== "date") {
    const firstMsg = items.find((i) => i.kind === "message");
    if (firstMsg && firstMsg.kind === "message") {
      items.unshift({
        kind: "date",
        key: `date-first-${dayKey(firstMsg.message.createdAt)}`,
        label: dateLabel(firstMsg.message.createdAt),
      });
    }
  }

  return items;
}
