"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { api } from "@/actions";
import {
  getChatPrepExpertAction,
  initiateChatAction,
  type SomeoneElseData,
} from "@/actions/chat";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@repo/store";
import { type IExpert } from "@repo/lib";
import { useTranslations } from "next-intl";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
import { requestChat } from "@/realtime/topics/chat";
import { totalmem } from "node:os";
import { Rss } from "lucide-react";
import { CHAT_STATUS, JoinChatAck } from "@/realtime/types/chat";

const EMPTY_SOMEONE_ELSE: SomeoneElseData = {
  name: "",
  gender: "",
  dob: "",
  tob: "",
  pob: "",
};

export function useChatPrep(expertId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Chat.page");

  const [expert, setExpert] = useState<Partial<IExpert> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [askSomeoneElse, setAskSomeoneElse] = useState(true);
  const [someoneElseData, setSomeoneElseData] = useState<SomeoneElseData>(EMPTY_SOMEONE_ELSE);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
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
    (targetExpertId: string | number, sessionId: number) => {
      toast.success(t("toastConnecting"));
      router.push(`/chat/room/${targetExpertId}?sessionId=${sessionId}`);
    },
    [router, t],
  );

  const handleStartConsultation = () => {
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
    setShowSecurityModal(true);
  };

  /** Send the socket request for an initiated consultation, then enter the room. */
  const sendChatRequest = async (consultationId: number, sessionId: number) => {
    try {
      const ack: JoinChatAck = await requestChat(consultationId, Number(expertId));
      if (ack.status !== CHAT_STATUS.REQUESTED) {
        toast.error("Expert did not receive your chat request. Please try again.");
        return;
      }
    } catch {
      toast.error("Could not reach the expert. Please check your connection and try again.");
      return;
    }
    goToRoom(expertId, sessionId);
  };

  const proceedToChat = async () => {
    setShowSecurityModal(false);
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
        const error = res.error;
        const errorBody = error.body;

        if (
          error.errorCode === "ACTIVE_CONSULTATION_EXISTS" &&
          errorBody?.existingConsultationId != null
        ) {
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
            toast.error(retry.error.message);
            return;
          }

          await sendChatRequest(retry.data.consultationId, retry.data.sessionId);
          return;
        }

        if (error.errorCode === "EXPERT_BUSY_IN_CONSULTATION") {
          toast.error("Expert is busy in a consultation. Please try again later.");
          return;
        }

        if (error.errorCode === "CHAT_INSUFFICIENT_BALANCE") {
          setNeedsRecharge(true);
          return;
        }

        toast.error(error.message || "Failed to start chat. Please try again.");
        return;
      }

      await sendChatRequest(res.data.consultationId, res.data.sessionId);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    t,
    router,
    expert,
    loading,
    actionLoading,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    showSecurityModal,
    setShowSecurityModal,
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
