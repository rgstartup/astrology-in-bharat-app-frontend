"use client";

import { useState, useCallback, useEffect } from "react";
import { getChatHistoryAction, type ChatHistorySessionDto } from "@/actions/chat";
import { computeSessionId } from "../application/consultation-sessions";

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

  const sessionId = useCallback(
    () => computeSessionId({ sessions, initialSessions }),
    [sessions, initialSessions],
  )();

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
