"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { api as http } from "@/lib/api";
import { getClientProfile } from "@/libs/api-profile";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { VerificationPopup } from "@repo/ui";
import { UserX } from "lucide-react";

import { Astrologer } from "@/lib/types";
import HeroInfo from "./hero-info.component";
import ExpertPreview from "./expert-preview.component";
import SecurityTipsModal from "./security-modal.component";

const { ChevronLeft } = LucideIcons as any;

export default function ConsultationPrep() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [askSomeoneElse, setAskSomeoneElse] = useState(true);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [someoneElseData, setSomeoneElseData] = useState({
    name: "",
    gender: "",
    dob: "",
    tob: "",
    pob: "",
  });
  const { isClientAuthenticated } = useAuthStore();

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
      const [res, fetchError] = await http.get<any>(
        `/expert/details/${id}`,
      );

      if (fetchError) {
        console.error("Failed to fetch astrologer for prep:", fetchError);
        setAstrologer(null);
      } else if (res) {
        const data = res?.data || res;
        setAstrologer({
          id: data.id,
          userId: data.user?.id,
          name: data.user?.name || "Astrologer",
          image: data.user?.avatar || "/images/dummy-astrologer.jpg",
          expertise: data.specialization || "",
          experience: data.experience_in_years || 0,
          price: data.price || 0,
          chat_price: data.chat_price,
          call_price: data.call_price,
          video_call_price: data.video_call_price,
          language: data.languages?.join(", ") || "",
          ratings: data.rating || 5,
          is_available: data.isAvailable ?? data.is_available ?? false,
        });
      } else {
        setAstrologer(null);
      }
      setLoading(false);
    };
    if (id) fetchAstro();

    const fetchProfile = async () => {
      if (isClientAuthenticated) {
        const [profile, err] = await getClientProfile();
        if (err) {
          console.error("Failed to fetch client profile:", err);
        } else {
          setClientProfile(profile);
        }
      }
    };
    fetchProfile();
  }, [id, isClientAuthenticated]);

  const handleStartConsultation = async () => {
    if (!isClientAuthenticated) {
      toast.error("Please login to start consultation");
      return;
    }

    if (astrologer && !astrologer.is_available) {
      setShowOfflinePopup(true);
      return;
    }

    setShowSecurityModal(true);
  };

  const proceedToChat = async () => {
    setShowSecurityModal(false);
    if (astrologer && !astrologer.is_available) {
      setShowOfflinePopup(true);
      return;
    }
    setActionLoading(true);

    const [response, error] = await http.post<any>("/chat/initiate", {
      expertId: parseInt(id),
    });

    if (error) {
      console.error("Initiation error:", error);
      toast.error(error.message || "Failed to start consultation");
    } else if (response && response.id) {
      localStorage.setItem(
        "activeChatSession",
        JSON.stringify({
          id: response.id,
          expertId: id,
          status: "pending",
          timestamp: Date.now(),
        }),
      );

      if (askSomeoneElse) {
        if (clientProfile) {
          const profileData = clientProfile?.data || clientProfile;
          const introData = {
            name: profileData.full_name || profileData.user?.name || "User",
            dob: profileData.date_of_birth || "",
            tob: profileData.time_of_birth || "",
            pob: profileData.place_of_birth || "",
            gender: profileData.gender || "",
          };
          localStorage.setItem("pendingIntroCard", JSON.stringify(introData));
        }
      } else {
        if (!someoneElseData.name || !someoneElseData.dob) {
          toast.error("Please fill Name and DOB for the consultation");
          setActionLoading(false);
          return;
        }
        localStorage.setItem(
          "pendingIntroCard",
          JSON.stringify(someoneElseData),
        );
      }

      toast.success("Connecting to expert...");
      router.push(`/chat/room/${id}?sessionId=${response.id}`);
    }
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
      </div>
    );

  if (!astrologer)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <UserX className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Expert Not Found
        </h2>
        <p className="text-gray-500 max-w-sm mb-8">
          The astrologer you are looking for might be unavailable or does not
          exist.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-orange text-white rounded-full font-bold shadow-lg hover:bg-orange-hover transition-all"
        >
          Go to Home
        </button>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed pb-20 relative"
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

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-4 py-4 md:px-10 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 group text-gray-400 hover:text-orange transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs uppercase tracking-widest">
            Back
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Astro-Secure Link
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <HeroInfo astrologerName={astrologer?.name} />

          <ExpertPreview
            astrologer={astrologer}
            askSomeoneElse={askSomeoneElse}
            setAskSomeoneElse={setAskSomeoneElse}
            someoneElseData={someoneElseData}
            setSomeoneElseData={setSomeoneElseData}
            handleStartConsultation={handleStartConsultation}
            actionLoading={actionLoading}
          />
        </div>
      </main>

      <SecurityTipsModal
        showSecurityModal={showSecurityModal}
        setShowSecurityModal={setShowSecurityModal}
        proceedToChat={proceedToChat}
      />

      <VerificationPopup
        isOpen={showOfflinePopup}
        onClose={() => setShowOfflinePopup(false)}
        title="Astrologer is Offline"
        buttonText="I Understand"
        icon={<UserX className="w-10 h-10 text-orange-500" />}
        description={
          <>
            Right now{" "}
            <span className="font-bold text-gray-900">{astrologer?.name}</span>{" "}
            is offline. <br />
            Please try again later when the astrologer is available.
          </>
        }
      />
    </div>
  );
}
