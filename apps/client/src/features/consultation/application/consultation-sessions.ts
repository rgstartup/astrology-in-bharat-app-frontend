import type { ChatHistorySessionDto } from "@/actions/chat";

/**
 * Computes the active session ID from the session list.
 * Prefers an active session, falls back to the latest session.
 */
export function computeSessionId({
  sessions,
  initialSessions,
}: {
  sessions: ChatHistorySessionDto[];
  initialSessions?: ChatHistorySessionDto[];
}): string | null {
  const source = sessions.length > 0 ? sessions : initialSessions ?? [];
  const active = source.find((s) => s.status === "active");
  const latest = active ?? source[source.length - 1];
  return latest ? String(latest.sessionId) : null;
}
