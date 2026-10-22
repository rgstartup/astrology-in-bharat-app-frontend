"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/actions/api";
import { chatSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useChat } from "@/realtime/hooks/use-chat";
import type { ConsultationMode } from "@/realtime/types/consultation";
import { liveMessageKey, useChatMessages, useChatTypingDisplay } from "@repo/chat";
import type { ChatMessagePayload } from "@/realtime/types/chat";
import type { ChatMessage, ChatSessionStatus, ChatSessionData, TypingStatus } from "../types";

const liveKey = (m: ChatMessagePayload): string =>
  m.id != null ? String(m.id) : liveMessageKey(m);

const baseKeys = (m: ChatMessage): string[] => [liveMessageKey(m), String(m.id)];

const attachmentMimeToType = (
  mimeType?: string | null,
): "image" | "document" | undefined => {
  if (!mimeType) return undefined;
  if (mimeType.toLowerCase().startsWith("image/")) return "image";
  return "document";
};

const toChatMessage = (
  m: ChatMessagePayload,
  fallbackSessionId?: string | number | null,
): ChatMessage => {
  // HTTP attachment sends arrive as `attachments: [{ url, mimeType }]` with
  // no flat `attachmentUrl` — unwrap first-attachment-wins (same rule as
  // history seeding), falling back to the legacy flat socket fields.
  const first = m.attachments?.[0];
  const attachmentUrl = first?.url || m.attachmentUrl;
  const attachmentType =
    attachmentMimeToType(first?.mimeType) ??
    (m.attachmentType as "image" | "document" | undefined);
  return {
    // Prefer the persisted id when the server sent one (socket echo of an
    // HTTP attachment send) so the echo dedupes against the reconciled
    // HTTP response instead of appearing twice.
    id: m.id != null ? String(m.id) : liveMessageKey(m),
    senderId: String(m.senderId),
    senderType: m.senderType === "expert" ? "expert" : "user",
    content: m.content,
    ...(fallbackSessionId != null
      ? { sessionId: String(fallbackSessionId) }
      : {}),
    ...(attachmentUrl ? { attachmentUrl } : {}),
    ...(attachmentType ? { attachmentType } : {}),
    createdAt: m.timestamp,
  };
};

export function useChatRoomSession(sessionId: string, newFlowId: number | null, mode: ConsultationMode = "chat") {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
    messages: liveMessages,
    send: sendLiveMessage,
    typing: sendLiveTyping,
    remoteTyping: liveRemoteTyping,
    clientName: liveClientName,
    ended: endedVerdict,
    end: endLiveChat,
    consultationStatus: joinedStatus,
    budget: liveBudget,
    paused: pausedState,
    voiceToken,
  } = useChat(newFlowId, mode);

  const [sessionStatus, setSessionStatus] = useState<ChatSessionStatus>("pending");
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<unknown>(null);
  const [clientName, setClientName] = useState("Client");
  const [clientAvatar, setClientAvatar] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<TypingStatus | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New-stack (consultation room) budget wins over the legacy REST seed.
  const newStackBudget = newFlowId != null ? liveBudget : null;

  const toRoomMessage = useCallback(
    (m: ChatMessagePayload) =>
      toChatMessage(m, newFlowId != null ? String(newFlowId) : sessionId),
    [newFlowId, sessionId],
  );

  // Seeded history + live traffic merged with key-based dedup (shared hook;
  // key strategy preserved: id match first, wire-key fallback for echoes).
  const { messages, setMessages } = useChatMessages({
    initial: [],
    live: liveMessages,
    liveKey,
    baseKeys,
    toMessage: toRoomMessage,
  });

  // New-stack typing relay → typing indicator (legacy `typing_status` never
  // fires on the consultation-room stack). Legacy flow keeps the state below.
  const liveTyping = useChatTypingDisplay(liveRemoteTyping, liveClientName ?? "Client");

  // New-stack join-ack client name wins over the legacy REST seed (which is
  // empty for consultation-room sessions).
  useEffect(() => {
    if (newFlowId == null || !liveClientName) return;
    setClientName(liveClientName);
  }, [newFlowId, liveClientName]);

  useEffect(() => {
    if (!newStackBudget?.startedAt) return;
    setStartedAt(newStackBudget.startedAt);
  }, [newStackBudget?.startedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch session info and message history via Result API.
  // Legacy stack only: new-flow rooms (newFlowId != null) are driven by the
  // /realtime join-ack + live socket traffic, so legacy REST (`/chat/session`,
  // `/chat/history`) and the legacy `chatSocket` room must stay untouched —
  // the ids live in different tables and the calls 500.
  useEffect(() => {
    if (newFlowId != null) return;
    if (!sessionId || !isAuthenticated || !user) return;

    const fetchSessionInfo = async () => {
      const sessionRes = await api.get<ChatSessionData>(`/chat/session/${sessionId}?_t=${Date.now()}`);
      if (sessionRes.ok && sessionRes.data) {
        const d = sessionRes.data;
        // New-stack status is authoritative from the join-ack (parent
        // consultation row); the legacy session row may be stale, and applying
        // it here could revive a live timer on a revisit after end.
        if (newFlowId == null) setSessionStatus(d.status);
        const name = d.client?.user?.name || d.user?.name;
        if (name) setClientName(name);

        const avatar = d.client?.profile_picture || d.client?.user?.avatar || d.user?.profile_picture || d.user?.avatar;
        if (avatar) setClientAvatar(avatar);

        if (d.startedAt) setStartedAt(d.startedAt);
        if (d.expiresAt) setExpiresAt(d.expiresAt);
        if (d.remainingSeconds !== undefined) setTimeLeft(d.remainingSeconds);
        if (d.elapsedSeconds !== undefined) setElapsedTime(d.elapsedSeconds);
      }

      const historyRes = await api.get<ChatMessage[]>(`/chat/history/${sessionId}`);
      if (historyRes.ok && historyRes.data) {
        setMessages(
          historyRes.data.map((m) => ({
            ...m,
            id: String(m.id),
            ...(m.sessionId != null
              ? { sessionId: String(m.sessionId) }
              : { sessionId: String(sessionId) }),
          })),
        );
      }
    };

    fetchSessionInfo();

    const joinRoom = () => {
      chatSocket.emit("join_room", { sessionId });
    };

    if (chatSocket.connected) {
      joinRoom();
    }
    chatSocket.on("connect", joinRoom);
    chatSocket.connect();

    chatSocket.on("new_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      setTypingStatus(null);
    });

    chatSocket.on("typing_status", (data: TypingStatus) => {
      setTypingStatus(data);
    });

    chatSocket.on("session_activated", (session: Partial<ChatSessionData>) => {
      setSessionStatus("active");
      if (session.startedAt) setStartedAt(session.startedAt);
      if (session.expiresAt) setExpiresAt(session.expiresAt);
      if (session.remainingSeconds !== undefined) setTimeLeft(session.remainingSeconds);
      if (session.elapsedSeconds !== undefined) setElapsedTime(session.elapsedSeconds);
      toast.success("Consultation started!", { toastId: `session_activated_${sessionId}` });
    });

    chatSocket.on("session_ended", (data: { terminatedBy?: string; interventionMessage?: string; split?: unknown }) => {
      setSessionStatus("completed");
      if (data?.terminatedBy === "admin") {
        toast.error(`SESSION TERMINATED BY ADMIN: ${data.interventionMessage || "Administrative action"}`);
      }
      if (data?.split) {
        setSummaryData(data);
        setShowSummary(true);
      } else {
        toast.info("Session has ended. Redirecting...", { autoClose: 2000 });
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    });

    return () => {
      chatSocket.off("connect", joinRoom);
      chatSocket.off("new_message");
      chatSocket.off("typing_status");
      chatSocket.off("session_activated");
      chatSocket.off("session_ended");
    };
  }, [sessionId, newFlowId, isAuthenticated, user, router]);

  // New-stack verdict: the join-ack carries the authoritative parent
  // consultation status, covering (re)joins after the end event already fired.
  // Terminal states always win so a revisit after end can never revive the
  // live timer on a stale startedAt anchor.
  useEffect(() => {
    if (newFlowId == null) return;
    if (!joinedStatus) {
      // Ack not yet received (or an older server without consultationStatus):
      // assume live so the timer runs; corrected when the ack lands.
      // A completed state (e.g. from a live end verdict) is never cleared.
      setSessionStatus((prev) => (prev === "completed" ? prev : "active"));
      return;
    }
    if (joinedStatus === "accepted" || joinedStatus === "active") {
      setSessionStatus((prev) => (prev === "completed" ? prev : "active"));
      return;
    }
    if (joinedStatus === "completed") {
      setSessionStatus("completed");
      return;
    }
    if (["rejected", "cancelled", "expired", "missed"].includes(joinedStatus)) {
      router.push("/dashboard");
    }
  }, [newFlowId, joinedStatus, router]);

  useEffect(() => {
    if (!endedVerdict) return;
    setSessionStatus("completed");
    toast.info("Session has ended. Redirecting...", { autoClose: 2000 });
    setTimeout(() => router.push("/dashboard"), 2000);
  }, [endedVerdict, router]);

  useEffect(() => {
    if (pausedState) {
      toast.warn("Client balance exhausted — chat paused. Waiting for recharge.", {
        toastId: `chat_paused_${newFlowId ?? sessionId}`,
      });
    }
  }, [pausedState, newFlowId, sessionId]);

  // 5-minute wait window while the client recharges (new stack only).
  const pauseWaitSeconds = pausedState
    ? (() => {
        const expiresSec =
          typeof pausedState.pauseExpiresInSec === "number" && !isNaN(pausedState.pauseExpiresInSec)
            ? pausedState.pauseExpiresInSec
            : 300;
        const baseTime = pausedState.timestamp ? new Date(pausedState.timestamp).getTime() : now;
        const validBaseTime = isNaN(baseTime) ? now : baseTime;
        const remaining = Math.floor((validBaseTime + expiresSec * 1000 - now) / 1000);
        return isNaN(remaining) || remaining < 0 ? 0 : remaining;
      })()
    : null;

  // Active session timer
  useEffect(() => {
    if (sessionStatus !== "active") return;
    const timer = setInterval(() => {
      const nowMs = Date.now();
      setNow(nowMs);
      const budgetMinutes = newStackBudget?.maxMinutes;
      const budgetAnchor = newStackBudget?.startedAt;
      if (
        typeof budgetMinutes === "number" &&
        typeof budgetAnchor === "string"
      ) {
        const s = new Date(budgetAnchor).getTime();
        const elapsed = isNaN(s) ? 0 : Math.max(0, Math.floor((nowMs - s) / 1000));
        setElapsedTime(elapsed);
        setTimeLeft(Math.max(0, budgetMinutes * 60 - elapsed));
        return;
      }
      if (startedAt) {
        const s = new Date(startedAt).getTime();
        if (!isNaN(s)) {
          const elapsed = Math.floor((nowMs - s) / 1000);
          setElapsedTime(elapsed > 0 ? elapsed : 0);
        }
      } else {
        setElapsedTime((prev) => prev + 1);
      }

      if (expiresAt) {
        const e = new Date(expiresAt).getTime();
        if (!isNaN(e)) {
          const left = Math.floor((e - nowMs) / 1000);
          setTimeLeft(left > 0 ? left : 0);
        }
      } else {
        setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStatus, startedAt, expiresAt, newStackBudget?.maxMinutes, newStackBudget?.startedAt]);

  // Auto scroll to bottom, unless the expert has scrolled up to read history.
  useEffect(() => {
    const timer = setTimeout(() => {
      const anchor = messagesEndRef.current;
      if (!anchor) return;
      const container = anchor.closest("[data-chat-scroll]");
      if (container) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceFromBottom > 120) return;
      }
      anchor.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, typingStatus]);

  /**
   * Legacy-only session activation (`POST /chat/activate/:sessionId`).
   * New-flow rooms (newFlowId != null) start via `consultation:accept` +
   * expert `consultation:join`, so this is a no-op there.
   */
  const handleActivate = async () => {
    if (newFlowId != null) return;
    setIsActivating(true);
    const res = await api.post(`/chat/activate/${sessionId}`);
    if (!res.ok) {
      const msg = res.error?.message || "Failed to activate session";
      if (msg.includes("active")) {
        setSessionStatus("active");
      } else {
        toast.error(msg);
      }
    }
    setIsActivating(false);
  };

  const handleEndChat = async (force = false) => {
    if (!force && !confirm("Are you sure you want to end this consultation?")) return;
    if (newFlowId != null) {
      try {
        const ack = await endLiveChat();
        const status = (ack as { status?: string } | undefined)?.status;
        if (status && status !== "ended" && status !== "ignored") {
          toast.error("Failed to end chat. Please try again.");
          return;
        }
        setSessionStatus("completed");
      } catch {
        toast.error("Failed to end chat. Please try again.");
        return;
      }
    }
    // Legacy socket teardown only: new-flow rooms end via `endLiveChat`
    // above (`consultation:end`), so legacy `chatSocket` emits stay untouched.
    if (newFlowId != null) return;
    if (user && sessionId) {
      chatSocket.emit("send_message", {
        sessionId,
        senderId: user.id,
        senderType: "admin",
        content: "Expert has ended the consultation.",
      });
    }
    chatSocket.emit("end_chat", { sessionId });
  };

  return {
    messages,
    setMessages,
    sessionStatus,
    timeLeft,
    elapsedTime,
    clientName,
    clientAvatar,
    // New-stack typing is derived from the live relay; legacy flow keeps
    // driving the socket-fed state below.
    typingStatus: newFlowId != null ? liveTyping : typingStatus,
    isActivating,
    showSummary,
    summaryData,
    messagesEndRef,
    sendLiveMessage,
    sendLiveTyping,
    handleActivate,
    handleEndChat,
    paused: pausedState,
    pauseWaitSeconds,
    voiceToken,
  };
}
