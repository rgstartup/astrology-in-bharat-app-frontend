"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { getChatHistoryAction, type ChatHistorySessionDto } from "@/actions/chat";

interface UseRoomSessionsParams {
  roomConsultationId: number | null;
  initialSessions?: ChatHistorySessionDto[];
  sessionRevision: number;
}

interface UseRoomSessionsReturn {
  sessions: ChatHistorySessionDto[];
  sessionId: string | null;
  refreshSessions: () => Promise<void>;
}

/**
 * Manages room session list and active session ID with auto-refresh on session revisions.
 *
 * @param params - Consultation ID, initial sessions, and revision counter
 * @returns Sessions array, active session ID, and refresh trigger
 */
export function useRoomSessions({
  roomConsultationId,
  initialSessions = [],
  sessionRevision,
}: UseRoomSessionsParams): UseRoomSessionsReturn {
  const [sessions, setSessions] = useState<ChatHistorySessionDto[]>(initialSessions);

  const sessionId = useMemo<string | null>(() => {
    const source = sessions.length > 0 ? sessions : initialSessions;
    const active = source.find((s) => s.status === "active");
    const latest = active ?? source[source.length - 1];
    return latest ? String(latest.sessionId) : null;
  }, [sessions, initialSessions]);

  const refreshSessions = useCallback(async () => {
    if (!roomConsultationId) return;
    const history = await getChatHistoryAction(roomConsultationId);
    if (history.ok && history.data) {
      setSessions(history.data.sessions ?? []);
    }
  }, [roomConsultationId]);

  useEffect(() => {
    if (sessionRevision === 0) return;
    void refreshSessions();
  }, [sessionRevision, refreshSessions]);

  return {
    sessions,
    sessionId,
    refreshSessions,
  };
}
