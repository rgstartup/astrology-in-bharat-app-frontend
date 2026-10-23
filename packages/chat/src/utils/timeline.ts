import type { ChatMessage, SessionMeta, TimelineItem, TimelineSessionEventItem } from "../types";

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

const CALL_MODES = new Set(["AUDIO_CALL", "VIDEO_CALL"]);

/** True for voice/video sessions (they render as system event cards). */
export const isCallMode = (mode?: string | null): boolean =>
  CALL_MODES.has((mode ?? "").toUpperCase());

export const sessionLabel = (current: SessionMeta, previous: SessionMeta | null): string => {
  if (!previous) return "";
  const cur = (current.mode ?? "CHAT").toUpperCase();
  const prev = (previous.mode ?? "CHAT").toUpperCase();
  if (cur !== prev) return MODE_LABEL[cur] ?? "Connection resumed";
  return "Connection resumed";
};

const modeOf = (mode?: string | null): string => (mode ?? "CHAT").toUpperCase();

/** True when a session was closed by a pause instead of a normal end. */
const isPausedEnd = (session: SessionMeta): boolean =>
  (session.endedReason ?? "").toLowerCase() === "paused";

function sessionEventItem(
  event: SessionMeta,
  status: "paused" | "resumed",
  keyPrefix: string,
): TimelineSessionEventItem {
  return {
    kind: "session_event",
    key: `${keyPrefix}-${String(event.sessionId)}`,
    event: { ...event, status },
  };
}

function sidOf(message: ChatMessage): string | null {
  return message.sessionId != null ? String(message.sessionId) : null;
}

/**
 * Build a render timeline from a flat message list, optionally bucketed by
 * explicit session metas. Without sessions, messages group by `sessionId`
 * in insertion order and untagged live traffic joins the trailing group;
 * with sessions, chat sessions render only when they contain messages while
 * voice/video sessions always render as a `session_event` card (even with
 * zero messages), and untagged traffic trails after them. Emits one `date`
 * marker per day and one `session` divider between chat groups.
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

  const ordered = sessions.filter((s, index) => {
    const bucket = byId.get(String(s.sessionId)) ?? [];
    const previous = index > 0 ? (sessions[index - 1] ?? null) : null;
    // A resumed session must show its boundary even before new messages.
    const resumesPrevious = previous !== null && isPausedEnd(previous);
    return bucket.length > 0 || isCallMode(s.mode) || isPausedEnd(s) || resumesPrevious;
  });
  const items: TimelineItem[] = [];
  const lastDay = { value: "" };
  let prevEmitted: SessionMeta | null = null;

  const ensureDate = (iso?: string | null) => {
    const day = dayKey(iso ?? undefined);
    if (day !== lastDay.value) {
      lastDay.value = day;
      items.push({
        kind: "date",
        key: `date-${day}-${items.length}`,
        label: dateLabel(iso ?? undefined),
      });
    }
  };

  ordered.forEach((session, index) => {
    const sid = String(session.sessionId);
    const meta: SessionMeta = {
      sessionId: sid,
      mode: session.mode ?? null,
      status: session.status ?? null,
      startedAt: session.startedAt ?? null,
      endedAt: session.endedAt ?? null,
      endedReason: session.endedReason ?? null,
      previousMode: prevEmitted?.mode ?? null,
      nextMode: ordered[index + 1]?.mode ?? null,
    };
    const bucket = byId.get(sid) ?? [];
    const resumed =
      prevEmitted !== null &&
      isPausedEnd(prevEmitted) &&
      modeOf(prevEmitted.mode) === modeOf(meta.mode);
    const switchedAfterPause = prevEmitted !== null && isPausedEnd(prevEmitted) && !resumed;

    // A voice/video session card (or any session boundary) can be the first
    // thing rendered for a day; emit the date marker up front so it never
    // lands after the card and splits same-day traffic. Fall back to the
    // session's first message (or the previous anchor) when startedAt is
    // missing so we never emit a spurious "Earlier" marker.
    const anchorIso =
      meta.startedAt ?? bucket[0]?.createdAt ?? (prevEmitted as SessionMeta | null)?.startedAt ?? null;
    ensureDate(anchorIso);

    if (resumed) {
      items.push(sessionEventItem(meta, "resumed", "session-event-resumed"));
    } else if (isCallMode(meta.mode)) {
      // Mode switch (chat -> voice/video) is a small badge, distinct from the
      // consultation card that follows it.
      if (prevEmitted && !isCallMode(prevEmitted.mode)) {
        items.push({
          kind: "session",
          key: `session-switch-${sid}`,
          sessionId: sid,
          label:
            MODE_LABEL[(meta.mode ?? "").toUpperCase()] ?? "Switched to audio call",
          startedAt: meta.startedAt ?? undefined,
        });
      }
      if (!isPausedEnd(meta)) {
        items.push({ kind: "session_event", key: `session-event-${sid}`, event: meta });
      }
    } else if (switchedAfterPause) {
      const entry: TimelineItem = {
        kind: "session",
        key: `session-${sid}`,
        sessionId: sid,
        label: "Switched to chat",
      };
      if (meta.startedAt) entry.startedAt = meta.startedAt;
      items.push(entry);
    } else if (prevEmitted && isCallMode(prevEmitted.mode) && !isCallMode(meta.mode)) {
      // Mode switch (voice/video -> chat) is a small badge; the consultation
      // card above already recorded the call itself.
      const entry: TimelineItem = {
        kind: "session",
        key: `session-switch-${sid}`,
        sessionId: sid,
        label: "Switched to chat",
      };
      if (meta.startedAt) entry.startedAt = meta.startedAt;
      items.push(entry);
    } else if (prevEmitted && !isCallMode(prevEmitted.mode)) {
      // A call card already names the mode switch; no second divider after it.
      const entry: TimelineItem = {
        kind: "session",
        key: `session-${sid}`,
        sessionId: sid,
        label: sessionLabel(meta, prevEmitted),
      };
      if (meta.startedAt) entry.startedAt = meta.startedAt;
      items.push(entry);
    }
    for (const message of bucket) pushInto(items, lastDay, message);
    // The pause closes this session; render it after its messages so the
    // boundary lands where the clock actually stopped.
    if (isPausedEnd(meta)) {
      items.push(sessionEventItem(meta, "paused", "session-event-paused"));
    }
    prevEmitted = meta;
  });

  if (untagged.length > 0) {
    const first = untagged[0];
    const explicitSid = first?.sessionId ? String(first.sessionId) : null;
    const lastOrdered = ordered[ordered.length - 1];
    if (prevEmitted && ordered.length > 0 && explicitSid && lastOrdered && explicitSid !== String(lastOrdered.sessionId)) {
      const prevStarted =
        prevEmitted !== null
          ? (prevEmitted as SessionMeta).startedAt
          : null;
      ensureDate(first?.createdAt ?? prevStarted);
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
