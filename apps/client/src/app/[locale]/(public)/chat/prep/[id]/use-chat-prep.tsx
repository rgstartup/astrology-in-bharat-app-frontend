"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { api } from "@/actions";
import {
  getChatPrepExpertAction,
  getChatEligibilityAction,
  initiateChatAction,
  type ChatEligibility,
  type SomeoneElseData,
} from "@/actions/chat";
import { getClientProfile } from "@/libs/api-profile";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@repo/store";
import { getErrorMessage, type IExpert } from "@repo/lib";
import { useTranslations } from "next-intl";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";

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
  const [someoneElseData, setSomeoneElseData] =
    useState<SomeoneElseData>(EMPTY_SOMEONE_ELSE);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [existingChatDetails, setExistingChatDetails] = useState<{
    sessionId: string;
    expertId: string;
  } | null>(null);
  const [eligibility, setEligibility] = useState<ChatEligibility | null>(null);
  const { isAuthenticated, refreshBalance } = useAuthStore();

  const { isAvailableForConsultation } = useExpertPresence(Number(expertId), {
    initialStatus: toExpertStatus(
      expert?.isAvailableForConsultation ??
        expert?.status ??
        expert?.is_available,
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
    const fetchExpert = async () => {
      if (expertId?.startsWith("dummy-")) {
        setExpert({
          id: Number(expertId),
          name: "Expert",
          avatar: "/images/dummy-expert.jpg",
          specialization: "Vedic, Numerology",
          experience_in_years: 5,
          price: 50,
          chat_price: 50,
          call_price: 50,
          video_call_price: 100,
          languages: "Hindi, English",
          rating: 5,
        });
        setLoading(false);
        return;
      }
      const res = await getChatPrepExpertAction(expertId);
      if (res.error || !res.data) {
        console.error("Failed to fetch expert for prep:", res.error);
        setExpert(null);
      } else {
        setExpert(res.data);
      }
      setLoading(false);
    };
    const fetchProfile = async () => {
      if (isAuthenticated) {
        const [, err] = await getClientProfile();
        if (err) console.error("Failed to fetch client profile:", err);
      }
    };
    const fetchEligibility = async () => {
      if (isAuthenticated && expertId && !expertId.startsWith("dummy-")) {
        const res = await getChatEligibilityAction(expertId);
        if (!res.error && res.data) {
          setEligibility(res.data);
        }
      }
    };
    if (expertId) {
      fetchExpert();
      fetchProfile();
      fetchEligibility();
    }
  }, [expertId, isAuthenticated]);

  const refreshEligibility = useCallback(async () => {
    if (isAuthenticated && expertId && !expertId.startsWith("dummy-")) {
      const res = await getChatEligibilityAction(expertId);
      if (!res.error && res.data) {
        setEligibility(res.data);
      }
    }
  }, [expertId, isAuthenticated]);

  const handleStartConsultation = () => {
    if (!isAuthenticated) {
      toast.error(
        <span>
          {t("toastLogin")}{" "}
          <span className="underline font-black">{t("loginNow")}</span>
        </span>,
        {
          onClick: () => router.push(withCallbackUrl(PATHS.LOGIN, pathname)),
          style: { cursor: "pointer" },
        },
      );
      return;
    }
    if (expert && !isExpertAvailable) {
      setShowOfflinePopup(true);
      return;
    }
    setShowSecurityModal(true);
  };

  const proceedToChat = async () => {
    setShowSecurityModal(false);
    if (expert && !isExpertAvailable) {
      setShowOfflinePopup(true);
      return;
    }
    setActionLoading(true);
    const res = await initiateChatAction(
      expertId,
      !askSomeoneElse ? someoneElseData : null,
    );
    if (res.error) {
      toast.error(res.error || t("toastFailed"));
    } else if (res.existingSessionId && res.existingExpertId) {
      setExistingChatDetails({
        sessionId: res.existingSessionId,
        expertId: res.existingExpertId,
      });
    } else if (res.data?.id) {
      toast.success(t("toastConnecting"));
      router.push(`/chat/room/${expertId}?sessionId=${res.data.id}`);
    }
    setActionLoading(false);
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
    eligibility,
    refreshEligibility,
    isAuthenticated,
    isExpertAvailable,
    handleStartConsultation,
    proceedToChat,
  };
}
