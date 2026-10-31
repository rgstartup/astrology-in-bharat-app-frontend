"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { useChat } from "@/realtime/hooks/use-chat-session";
import {
  CONSULTATION_EVENTS,
  cancelConsultation,
  endConsultation,
  getConsultationStatus,
  pauseConsultation,
  resumeConsultation,
  resumeConsultationChat,
  resumeConsultationVoice,
  resumeConsultationVideo,
  startConsultation,
} from "@/realtime/topics/consultation";
import type {
  ConsultationDecisionPayload,
} from "@/realtime/types/chat";
import type {
  ConsultationEndedPayload,
  ConsultationMode,
  ConsultationStatePayload,
  ConsultationStatePausedPayload,
} from "@/realtime/types/consultation";

/**
 * Decision lifecycle mirrors the backend `ConsultationLifecycleState`
 * decision subset: waiting → accepted/rejected/cancelled.
 */
export type ConsultationDecision =
  "waiting" | "accepted" | "rejected" | "cancelled";

/**
 * Root consultation orchestrator hook for client app.
 * Manages socket subscriptions, state events, and commands across chat, voice, and video.
 * Re-joins rooms and re-pulls status on every (re)connect — server-side room
 * membership is lost across reconnects, so a mount-only join would leave the
 * room deaf to broadcasts after a backend restart.
 * Terminal latch: ENDED is final until the backend confirms a new acceptance
 * or resume. Late pause/budget events cannot revive an ended consultation;
 * an explicit RESUMED event starts a fresh active lifecycle for every room
 * mode consuming this hook.
 */
export const useConsultation = (
  consultationId?: number | string | null,
  sessionId?: number | string | null,
) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const sessionIdNum = sessionId != null ? Number(sessionId) : null;
  const isValidSessionId = sessionIdNum != null && !isNaN(sessionIdNum);

  const [state, setState] = useState<ConsultationStatePayload | null>(null);
  const [ended, setEnded] = useState<ConsultationEndedPayload | null>(null);
  const [paused, setPaused] = useState<ConsultationStatePausedPayload | null>(null);
  const [decision, setDecision] = useState<ConsultationDecision>("waiting");
  const [voiceToken, setVoiceToken] = useState<{
    token: string | null;
    tokenExpiresAt: string | null;
    channelName: string | null;
  }>({ token: null, tokenExpiresAt: null, channelName: null });
  /** Bumped on pause/resume/end so the room can re-seed session history. */
  const [sessionRevision, setSessionRevision] = useState(0);
  /** Bumped only for backend resume events so the room store can reset once per resume. */
  const [resumeRevision, setResumeRevision] = useState(0);
  // Terminal latch (see docblock): refs stay current inside socket handlers.
  const endedRef = useRef(false);

  // Delegates chat room membership + message/typing streaming to useChat.
  // useChat owns the socket connect/join/leave for chat events only.
  const chat = useChat(consultationId, sessionId);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    const handleState = (payload: ConsultationStatePayload) => {
      if (!payload || Number(payload.consultationId) !== id) return;

      // 'active' (STARTED / STATE active) always restarts the lifecycle —
      // even for a session we haven't synced to local state yet (local
      // sessionId lags behind until chat history refreshes).
      if (payload.state === "active") {
        endedRef.current = false;
        setEnded(null);
        setState(payload);
        return;
      }
      // Non-active state events belong to a specific session; ignore late
      // events from a previous session (same consultationId, new sessionId).
      if (
        isValidSessionId &&
        payload.sessionId != null &&
        Number(payload.sessionId) !== sessionIdNum
      ) {
        return;
      }
      if (endedRef.current) return;
      setState(payload);
      if (payload.state === "paused") {
        setPaused(payload);
        setSessionRevision((value) => value + 1);
      }
    };

    const handleResumed = (payload: ConsultationStatePayload) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      // RESUMED is a session-establishing event: always process so a
      // re-initiated session restarts even if local sessionId is stale.
      endedRef.current = false;
      setEnded(null);
      setDecision("accepted");
      setState({ ...payload, state: "active" });
      if (payload.token || payload.channelName) {
        setVoiceToken({
          token: payload.token ?? null,
          tokenExpiresAt: payload.tokenExpiresAt ?? null,
          channelName: payload.channelName ?? null,
        });
      }
      setSessionRevision((value) => value + 1);
      setResumeRevision((value) => value + 1);
    };

    const handleEnded = (payload: ConsultationEndedPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(
          isValidSessionId &&
          payload.sessionId != null &&
          Number(payload.sessionId) !== sessionIdNum
        )
      ) {
        endedRef.current = true;
        setEnded(payload);
        setState((prev) => (prev ? { ...prev, state: "completed" } : null));
        setSessionRevision((value) => value + 1);
      }
    };

    const matchDecision = (p: ConsultationDecisionPayload) =>
      Number(p.consultationId) === id;

    const onAccepted = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      // ACCEPTED is session-establishing: always process even if local
      // sessionId is stale (it lags behind until chat history refreshes).
      // Continue-consultation re-accept: clear the ENDED terminal latch so
      // subsequent state/budget events the new session emits still apply.
      endedRef.current = false;
      setEnded(null);
      setDecision("accepted");
      setVoiceToken({
        token: p.token ?? null,
        tokenExpiresAt: p.tokenExpiresAt ?? null,
        channelName: p.channelName ?? null,
      });
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "accepted",
        startedAt: p.startedAt ?? null,
        maxMinutes: p.maxMinutes ?? prev?.maxMinutes,
        timestamp: p.timestamp,
      }));
      setSessionRevision((value) => value + 1);
    };

    const onRejected = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (
        isValidSessionId &&
        p.sessionId != null &&
        Number(p.sessionId) !== sessionIdNum
      )
        return;
      setDecision("rejected");
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "rejected",
        timestamp: p.timestamp,
      }));
    };

    const onCancelled = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (
        isValidSessionId &&
        p.sessionId != null &&
        Number(p.sessionId) !== sessionIdNum
      )
        return;
      setDecision("cancelled");
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "cancelled",
        timestamp: p.timestamp,
      }));
    };

    const onDisconnected = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (
        isValidSessionId &&
        p.sessionId != null &&
        Number(p.sessionId) !== sessionIdNum
      )
        return;
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "reconnecting",
        timestamp: p.timestamp,
      }));
    };

    /** Refresh status on (re)connect; room join is delegated to useChat. */
    const handleConnect = () => {
      getConsultationStatus(id)
        .then((status) => {
          if (status) setState(status);
        })
        .catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CONSULTATION_EVENTS.EVENTS.STATE, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.STARTED, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
    socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
    socket.on(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
    socket.on(CONSULTATION_EVENTS.EVENTS.DISCONNECTED, onDisconnected);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.STATE, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.STARTED, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
      socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
      socket.off(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
      socket.off(CONSULTATION_EVENTS.EVENTS.DISCONNECTED, onDisconnected);
      socket.off("connect", handleConnect);
    };
  }, [id, isValidId, sessionId, sessionIdNum]);

  const cancel = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return cancelConsultation(id);
  }, [id, isValidId]);

  const start = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return startConsultation(id);
  }, [id, isValidId]);

  const pause = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return pauseConsultation(id);
  }, [id, isValidId]);

  const resume = useCallback(
    (mode?: ConsultationMode) => {
      if (!isValidId)
        return Promise.reject(new Error("Missing consultationId"));
      return resumeConsultation(id, mode);
    },
    [id, isValidId],
  );

  const resumeChat = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationChat(id);
  }, [id, isValidId]);

  const resumeVoice = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationVoice(id);
  }, [id, isValidId]);

  const resumeVideo = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationVideo(id);
  }, [id, isValidId]);

  const end = useCallback(
    (reason?: string) => {
      if (!isValidId)
        return Promise.reject(new Error("Missing consultationId"));
      return endConsultation(id, reason);
    },
    [id, isValidId],
  );

  return {
    state,
    consultationStatus: state?.state ?? null,
    decision,
    voiceToken,
    ended,
    paused,
    // Chat (delegated to useChat)
    messages: chat.messages,
    send: chat.send,
    typing: chat.typing,
    remoteTyping: chat.remoteTyping,
    sessionRevision,
    resumeRevision,
    cancel,
    start,
    pause,
    resume,
    resumeChat,
    resumeVoice,
    resumeVideo,
    end,
  };
};
