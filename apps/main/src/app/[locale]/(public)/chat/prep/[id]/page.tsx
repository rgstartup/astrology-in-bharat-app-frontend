"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { api } from "@/actions";
import { getClientProfile } from "@/libs/api-profile";
import { toast } from "react-toastify";
import { useAuthStore } from "@repo/store";
import { getErrorMessage } from "@repo/lib";
import { VerificationPopup } from "@repo/ui";
import { UserX, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Expert } from "@repo/lib";
import HeroInfo from "./hero-info.component";
import ExpertPreview from "./expert-preview.component";
import SecurityTipsModal from "./security-modal.component";
import ChatPrepSeoContent from "./chat-prep-seo.component";

export default function ConsultationPrep() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.id as string;
  const t = useTranslations("Chat.page");

  const [expert, setExpert] = useState<Partial<Expert> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [askSomeoneElse, setAskSomeoneElse] = useState(true);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [existingChatDetails, setExistingChatDetails] = useState<{
    sessionId: string;
    expertId: string;
  } | null>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [eligibility, setEligibility] = useState<{
    isEligibleForFree: boolean;
    freeMinutes: number;
    hasBalance: boolean;
    minBalanceRequired: number;
    currentBalance: number;
  } | null>(null);
  const [someoneElseData, setSomeoneElseData] = useState({
    name: "",
    gender: "",
    dob: "",
    tob: "",
    pob: "",
  });
  const { isAuthenticated, refreshBalance } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      refreshBalance(api);
    }
  }, [isAuthenticated, refreshBalance]);

  useEffect(() => {
    const preventDefault = (e: any) => {
      if (showSecurityModal) {
        let target = e.target;
        let isInsideScrollable = false;

        while (target && target !== document.body) {
          if (target.classList?.contains("modal-scroll-area")) {
            isInsideScrollable = true;
            break;
          }
          target = target.parentElement;
        }

        if (!isInsideScrollable) {
          e.preventDefault();
        }
      }
    };

    if (showSecurityModal) {
      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
      document.documentElement.classList.add("no-scroll");
    } else {
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      document.documentElement.classList.remove("no-scroll");
    };
  }, [showSecurityModal]);

  useEffect(() => {
    const fetchAstro = async () => {
      if (id?.startsWith("dummy-")) {
        setExpert({
          id: id,
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
        return;
      }

      const [res, fetchError] = await api.get<any>(`/expert/details/${id}`);

      if (fetchError) {
        console.error("Failed to fetch expert for prep:", fetchError);
        setExpert(null);
      } else if (res) {
        const data = res?.data || res;
        setExpert({
          id: data.id,
          name: data.user?.name || "Expert",
          avatar: data.user?.avatar || "/images/dummy-expert.jpg",
          specialization: data.specialization || "",
          experience_in_years: data.experience_in_years || 0,
          price: data.price,
          chat_price: data.chat_price,
          call_price: data.call_price,
          video_call_price: data.video_call_price,
          languages: data.languages?.join(", ") || "",
          rating: data.ratings || 5,
          is_available: data.is_available,
        });
      } else {
        setExpert(null);
      }
      setLoading(false);
    };
    if (id) fetchAstro();
    const fetchProfile = async () => {
      if (isAuthenticated) {
        const [profile, err] = await getClientProfile();
        if (err) {
          console.error("Failed to fetch client profile:", err);
        } else {
          setClientProfile(profile);
        }
      }
    };
    fetchProfile();

    // Fetch eligibility from backend (business logic stays in backend)
    const fetchEligibility = async () => {
      if (isAuthenticated && id && !id.startsWith("dummy-")) {
        const [res, err] = await api.get<any>(
          `/chat/eligibility?expert_id=${id}`,
        );
        if (!err && res) {
          setEligibility(res);
        }
      }
    };
    fetchEligibility();
  }, [id, isAuthenticated]);

  const handleStartConsultation = async () => {
    if (!isAuthenticated) {
      toast.error(
        <span>
          {t("toastLogin")}{" "}
          <span className="underline font-black">{t("loginNow")}</span>
        </span>,
        {
          onClick: () =>
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`),
          style: { cursor: "pointer" },
        },
      );
      return;
    }

    if (expert && !expert.is_available) {
      setShowOfflinePopup(true);
      return;
    }

    setShowSecurityModal(true);
  };

  const proceedToChat = async () => {
    setShowSecurityModal(false);
    if (expert && !expert.is_available) {
      setShowOfflinePopup(true);
      return;
    }
    setActionLoading(true);

    const [response, error] = await api.post<any>("/chat/initiate", {
      expert_id: id,
      metadata: !askSomeoneElse ? someoneElseData : null,
    });

    if (error) {
      console.error("Initiation error:", error);
      const existingSessionId = (error as any).data?.existingSessionId;
      const existingExpertId = (error as any).data?.existingExpertId;

      if (existingSessionId && existingExpertId) {
        setExistingChatDetails({
          sessionId: existingSessionId,
          expertId: existingExpertId,
        });
      } else {
        toast.error(getErrorMessage(error) || t("toastFailed"));
      }
    } else if (response && response.id) {
      toast.success(t("toastConnecting"));
      router.push(`/chat/room/${id}?sessionId=${response.id}`);
    }
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#242424]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5500]"></div>
      </div>
    );

  if (!expert)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#242424] text-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <UserX className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          {t("notFoundTitle")}
        </h2>
        <p className="text-gray-500 max-w-sm mb-8">{t("notFoundDesc")}</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-[#FF5500] text-white rounded-full font-bold shadow-lg hover:bg-[#E64D00] transition-all cursor-pointer"
        >
          {t("goHome")}
        </button>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/images/white-background.png')" }}
    >
      <style>
        {`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1.05); }
                    50% { transform: translateY(-10px) scale(1.08); }
                }
                .astro-card-glow {
                    background: radial-gradient(circle at 50% 50%, rgba(255,107,0,0.15), transparent 70%);
                }
                .no-scroll {
                    overflow: hidden !important;
                    height: 100vh !important;
                    width: 100vw !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                }
                `}
      </style>

      <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <HeroInfo expertName={expert?.name} />

          <ExpertPreview
            expert={expert}
            askSomeoneElse={askSomeoneElse}
            setAskSomeoneElse={setAskSomeoneElse}
            someoneElseData={someoneElseData}
            setSomeoneElseData={setSomeoneElseData}
            handleStartConsultation={handleStartConsultation}
            actionLoading={actionLoading}
            eligibility={eligibility}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* --- SEO Section --- */}
        <ChatPrepSeoContent />
      </main>

      <SecurityTipsModal
        showSecurityModal={showSecurityModal}
        setShowSecurityModal={setShowSecurityModal}
        proceedToChat={proceedToChat}
      />

      <VerificationPopup
        isOpen={showOfflinePopup}
        onClose={() => setShowOfflinePopup(false)}
        title={t("expertOfflineTitle")}
        buttonText={t("understandBtn")}
        icon={<UserX className="w-10 h-10 text-orange-500" />}
        description={
          <>{t("expertOfflineDesc", { name: expert?.name || "Expert" })}</>
        }
      />

      <VerificationPopup
        isOpen={!!existingChatDetails}
        onClose={() => setExistingChatDetails(null)}
        title={t("activeChatTitle")}
        buttonText={t("goToChatBtn")}
        onConfirm={() => {
          if (existingChatDetails) {
            router.push(
              `/chat/room/${existingChatDetails.expertId}?sessionId=${existingChatDetails.sessionId}`,
            );
          }
        }}
        icon={<MessageCircle className="w-10 h-10 text-[#FF5500]" />}
        description={<>{t("activeChatDesc")}</>}
      />
    </div>
  );
}
