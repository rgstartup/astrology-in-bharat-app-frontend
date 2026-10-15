"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { api } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { useAuthStore } from "@repo/store";
import { type IExpert } from "@repo/lib";
import { useTranslations } from "next-intl";
import { getChatPrepExpertAction, initiateChatAction, type SomeoneElseData } from "@/actions/chat";
import { useChatPrepStore } from "@/store/chatPrepStore";
import { useConsultationTrackerStore } from "@/store/consultationTrackerStore";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
import { requestConsultation, cancelConsultation, CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import { realtimeSocket } from "@/realtime/socket";

import { CHAT_STATUS } from "@/realtime/types/chat";

import type { ChatVerdict, WaitOutcome } from "../types";

const EMPTY_SOMEONE_ELSE: SomeoneElseData = {
  name: "",
  gender: "",
  dob: "",
  tob: "",
  pob: "",
};

/**
 * Headroom so the server-owned expiry (cron sweep, up to ~10s granularity)
 * wins the verdict race. The local timer is a silent fallback only.
 */
const SERVER_LAG_GRACE_SEC = 15;

export function useChatPrep(expertId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Chat.page");

  const [expert, setExpert] = useState<Partial<IExpert> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isWaitingForExpert, setIsWaitingForExpert] = useState(false);
  const [waitOutcome, setWaitOutcome] = useState<WaitOutcome>(null);
  const waitResolveRef = useRef<((v: ChatVerdict) => void) | null>(null);
  const waitConsultationRef = useRef<number | null>(null);
  const [askSomeoneElse, setAskSomeoneElse] = useState(true);
  const [someoneElseData, setSomeoneElseData] = useState<SomeoneElseData>(EMPTY_SOMEONE_ELSE);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [needsRecharge, setNeedsRecharge] = useState(false);
  const [existingChatDetails, setExistingChatDetails] = useState<{
    consultationId: number;
    expertId: string;
  } | null>(null);
  const { isAuthenticated, refreshBalance } = useAuthStore();

  const { isAvailableForConsultation } = useExpertPresence(Number(expertId), {
    initialStatus: toExpertStatus(
      expert?.isAvailableForConsultation ?? expert?.status ?? expert?.is_available,
    ),
    autoSubscribe: true,
  });

  const isExpertAvailable = expert ? isAvailableForConsultation : false;

  useEffect(() => {
    if (isAuthenticated) {
      refreshBalance(api);
    }
  }, [isAuthenticated, refreshBalance]);

  useEffect(() => {
    if (!expertId) return;
    const fetchExpert = async () => {
      setLoading(true);
      const res = await getChatPrepExpertAction(expertId);
      setLoading(false);

      if (!res.ok) {
        toast.error(res.error.message || "Failed to fetch expert");
        return;
      }
      setExpert(res.data);
    };
    fetchExpert();
  }, [expertId]);

  const goToRoom = useCallback(
    (targetExpertId: string | number, sessionId: number, consultationId: number) => {
      toast.success(t("toastConnecting"));
      // ChatPrepHost lives in the root layout and survives navigation —
      // close it here or the prep modal stays open over the chat room.
      useChatPrepStore.getState().closeChatPrep();
      // Seed the global tracker so the floating card appears if the
      // client walks out of the room mid-consultation.
      useConsultationTrackerStore.getState().setSession({
        consultationId,
        sessionId,
        expertId: String(targetExpertId),
        expertName: expert?.name ?? `Expert ${targetExpertId}`,
        expertAvatar: expert?.avatar ?? null,
        startedAt: new Date().toISOString(),
        paused: false,
      });
      router.push(
        `/consultation/${consultationId}?sessionId=${sessionId}&expertId=${targetExpertId}`,
      );
      // The request-window key served its purpose: the expert accepted.
      // Remove it so a later hard refresh never replays a stale expiry
      // redirect while the room re-joins (bug-072).
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(`chat:pending:${consultationId}`);
      }
    },
    [router, t, expert],
  );

  /** One-shot wait for the expert verdict. Delivery ack is NOT the verdict. */
  const waitForVerdict = useCallback(
    (consultationId: number, timeoutSec: number) =>
      new Promise<ChatVerdict>((resolve) => {
        const socket = realtimeSocket();
        const match = (p: { consultationId: number | string }) =>
          Number(p?.consultationId) === consultationId;
        const cleanup = () => {
          clearTimeout(timer);
          socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
          socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
          waitResolveRef.current = null;
          waitConsultationRef.current = null;
        };

        const timer = setTimeout(
          () => {
            cleanup();
            resolve("expired");
          },
          Math.max(timeoutSec, 10) * 1000,
        );
        const onAccepted = (p: { consultationId: number | string }) => {
          if (match(p)) {
            cleanup();
            resolve("accepted");
          }
        };
        const onRejected = (p: { consultationId: number | string; reason?: string }) => {
          if (match(p)) {
            cleanup();
            // Cron expiry arrives as a system reject — surface it as a
            // timeout so the UI can say "no response" instead of "declined".
            resolve(p?.reason === "request_timeout" ? "timeout" : "rejected");
          }
        };
        waitResolveRef.current = (v) => {
          cleanup();
          resolve(v);
        };
        waitConsultationRef.current = consultationId;
        socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
        socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
      }),
    [],
  );

  const cancelWaiting = useCallback(() => {
    const consultationId = waitConsultationRef.current;
    waitResolveRef.current?.("cancelled");
    // Tell the server only if the verdict is still pending — otherwise the
    // request already settled (accepted/rejected/expired) and must not flip.
    if (consultationId != null) {
      cancelConsultation(consultationId).catch(() => undefined);
    }
  }, []);

  const clearWaiting = useCallback(() => {
    setWaitOutcome(null);
    setIsWaitingForExpert(false);
  }, []);

  /** Send the socket request, then wait for the expert verdict before entering the room. */
  const sendChatRequest = async (
    consultationId: number,
    sessionId: number,
    expiresInSec: number,
    maxMinutes?: number,
  ) => {
    try {
      const ack = await requestConsultation(consultationId, Number(expertId));
      if (ack.status !== "requested" && ack.status !== CHAT_STATUS.REQUESTED) {
        toast.error("Expert did not receive your chat request. Please try again.");
        return;
      }
    } catch {
      toast.error("Could not reach the expert. Please check your connection and try again.");
      return;
    }
    if (typeof window !== "undefined") {
      if (typeof maxMinutes === "number" && maxMinutes > 0) {
        window.sessionStorage.setItem(`chat:budget:${consultationId}`, String(maxMinutes));
      }
      window.sessionStorage.setItem(
        `chat:pending:${consultationId}`,
        new Date(Date.now() + expiresInSec * 1000).toISOString(),
      );
    }
    setIsWaitingForExpert(true);
    try {
      // Server owns the timeout (cron sweep lags the window by up to ~10s),
      // so the local timer is a silent fallback with grace — it must never
      // win the race and strand an accept that lands just after expiry.
      const verdict = await waitForVerdict(
        consultationId,
        expiresInSec + SERVER_LAG_GRACE_SEC,
      );
      if (verdict === "accepted") {
        goToRoom(expertId, sessionId, consultationId);
      } else if (verdict === "rejected") {
        setWaitOutcome("rejected");
        return;
      } else if (verdict === "timeout" || verdict === "expired") {
        setWaitOutcome("timeout");
      }
    } finally {
      setIsWaitingForExpert(false);
    }
  };

  const proceedToChat = async () => {
    if (!isAuthenticated) {
      const id = toast.warning(t("toastLogin"), {
        action: {
          label: t("loginNow"),
          onClick: () => {
            toast.dismiss(id);
            router.push(withCallbackUrl(PATHS.LOGIN, pathname));
          },
        },
      });
      return;
    }
    if (expert && !isExpertAvailable) {
      setShowOfflinePopup(true);
      return;
    }
    setActionLoading(true);
    setNeedsRecharge(false);

    const metadata = !askSomeoneElse ? someoneElseData : null;

    try {
      const res = await initiateChatAction(expertId, metadata);

      if (!res.ok) {
        const errCode = res.code;
        const errorBody = res.body;

        if (errCode === "ACTIVE_CONSULTATION_EXISTS" && errorBody?.existingConsultationId != null) {
          setExistingChatDetails({
            consultationId: errorBody.existingConsultationId,
            expertId: String(errorBody.existingExpertId ?? expertId),
          });
          const retry = await initiateChatAction(
            expertId,
            metadata,
            errorBody.existingConsultationId,
          );
          if (!retry.ok) {
            if (retry.code === "CHAT_INSUFFICIENT_BALANCE") {
              setNeedsRecharge(true);
              return;
            }
            toast.error(retry.message);
            return;
          }

          await sendChatRequest(
            retry.data.consultationId,
            retry.data.sessionId,
            retry.data.requestExpiresInSec,
            retry.data.maxMinutes,
          );
          return;
        }

        if (errCode === "EXPERT_BUSY_IN_CONSULTATION") {
          toast.error("Expert is busy in a consultation. Please try again later.");
          return;
        }

        if (errCode === "CHAT_INSUFFICIENT_BALANCE") {
          setNeedsRecharge(true);
          return;
        }

        toast.error(res.message || "Failed to start chat. Please try again.");
        return;
      }

      await sendChatRequest(
        res.data.consultationId,
        res.data.sessionId,
        res.data.requestExpiresInSec,
        res.data.maxMinutes,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartConsultation = () => {
    void proceedToChat();
  };

  return {
    t,
    router,
    expert,
    loading,
    actionLoading,
    isWaitingForExpert,
    cancelWaiting,
    waitOutcome,
    clearWaiting,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    showOfflinePopup,
    setShowOfflinePopup,
    existingChatDetails,
    setExistingChatDetails,
    needsRecharge,
    setNeedsRecharge,
    isAuthenticated,
    isExpertAvailable,
    handleStartConsultation,
    proceedToChat,
  };
}
