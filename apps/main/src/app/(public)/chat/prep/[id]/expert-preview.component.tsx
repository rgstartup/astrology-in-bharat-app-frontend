"use client";

import React from "react";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";
import { Expert } from "@/lib/types";
import { useLanguageStore } from "@repo/store";

const epT = {
  en: {
    expertise: "Expertise",
    experience: "Experience",
    years: "+ Years",
    verifiedExpert: "Verified Astro Expert • Bharat",
    consultingFor: "Consulting for",
    myself: "Myself",
    someoneElse: "Someone Else",
    change: "Change",
    fullName: "Full Name",
    enterName: "Enter Name",
    gender: "Gender",
    select: "Select",
    male: "Male",
    female: "Female",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    birthPlace: "Birth Place",
    cityCountry: "City, Country",
    yourBalance: "Your Balance",
    lowBalance: "Low Balance",
    lowBalanceDesc: "You need at least ₹{price} for 5 mins.",
    rechargeNow: "RECHARGE NOW",
    connecting: "CONNECTING...",
    startConsultation: "START CONSULTATION",
    availableNow: "Available Now",
    offline: "Offline",
  },
  hi: {
    expertise: "विशेषज्ञता",
    experience: "अनुभव",
    years: "+ वर्ष",
    verifiedExpert: "सत्यापित ज्योतिषी • भारत",
    consultingFor: "किसके लिए परामर्श",
    myself: "स्वयं के लिए",
    someoneElse: "किसी और के लिए",
    change: "बदलें",
    fullName: "पूरा नाम",
    enterName: "नाम दर्ज करें",
    gender: "लिंग",
    select: "चुनें",
    male: "पुरुष",
    female: "महिला",
    birthDate: "जन्म तिथि",
    birthTime: "जन्म समय",
    birthPlace: "जन्म स्थान",
    cityCountry: "शहर, देश",
    yourBalance: "आपका बैलेंस",
    lowBalance: "कम बैलेंस",
    lowBalanceDesc: "5 मिनट के लिए कम से कम ₹{price} चाहिए।",
    rechargeNow: "अभी रिचार्ज करें",
    connecting: "कनेक्ट हो रहा है...",
    startConsultation: "परामर्श शुरू करें",
    availableNow: "अभी उपलब्ध",
    offline: "ऑफलाइन",
  },
};

const Image = NextImage as any;
const { MessageSquare, MapPin, Sparkles, ArrowRight } = LucideIcons as any;

type Props = {
  expert: Expert | null;
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: any;
  setSomeoneElseData: (val: any) => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
  eligibility?: {
    isEligibleForFree: boolean;
    freeMinutes: number;
    hasBalance: boolean;
    minBalanceRequired: number;
    currentBalance: number;
  } | null;
  isAuthenticated?: boolean;
};

const ExpertPreview = ({
  expert,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  eligibility = null,
  isAuthenticated = false,
}: Props) => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const tx = epT[lang] || epT.en;
  // Show low balance warning only when backend says user has no balance AND is not free eligible
  const showLowBalance = isAuthenticated && eligibility !== null && !eligibility.isEligibleForFree && !eligibility.hasBalance;

  return (
    <div className="order-1 lg:order-2 lg:col-span-5 relative">
      <div className="sticky top-28">
        <div className="p-2 bg-white border border-[#F0E0D0] rounded-[3.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Expert Image Section */}
          <div className="relative h-[380px] rounded-[3rem] overflow-hidden group">
            <Image
              src={expert?.image || "/images/dummy-expert.jpg"}
              alt={expert?.name || "Expert"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Availability Badge */}
            <div
              className={`absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-full border shadow-sm flex items-center gap-2 ${
                expert?.is_available
                  ? "bg-orange border-white/20"
                  : "bg-[#1A1A1A] border-gray-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  expert?.is_available
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                    : "bg-gray-400"
                }`}
              ></div>
              <span
                className={`${
                  expert?.is_available ? "text-white" : "text-gray-400"
                } text-[10px] font-black uppercase tracking-widest`}
              >
                {expert?.is_available ? tx.availableNow : tx.offline}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-orange rounded-full shadow-lg flex items-center gap-2">
              <span className="text-white text-xs font-black uppercase tracking-widest">
                ₹{expert?.chat_price || expert?.price || 0} / min
              </span>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-[2rem] p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">
                      {tx.expertise}
                    </span>
                    <span className="text-white font-bold text-sm line-clamp-1 truncate" title={expert?.expertise}>
                      {expert?.expertise || "Astrology, Vastu, Palmistry"}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-[#1A1A1A]/20 flex-shrink-0"></div>
                  <div className="flex flex-col flex-shrink-0">
                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1 text-right">
                      {tx.experience}
                    </span>
                    <span className="text-white font-bold text-right text-sm">
                      {expert?.experience}{tx.years}
                    </span>
                  </div>
                </div>
                
                <div className="h-[1px] w-full bg-[#1A1A1A]/10"></div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange" />
                  <span className="text-white/80 text-xs font-medium">
                    {tx.verifiedExpert}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Option to toggle who is asking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FFF8F3] rounded-2xl border border-[#F5E0CC]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-orange/80 uppercase tracking-widest">
                    {tx.consultingFor}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {askSomeoneElse ? tx.myself : tx.someoneElse}
                  </span>
                </div>
                <button
                  onClick={() => setAskSomeoneElse(!askSomeoneElse)}
                  className="px-4 py-2 text-[10px] font-black text-orange uppercase tracking-widest hover:bg-orange/10 rounded-xl transition-colors"
                >
                  {tx.change}
                </button>
              </div>

              {/* Someone Else Form */}
              {!askSomeoneElse && (
                <div className="p-6 rounded-[2rem] bg-white border-2 border-orange/20 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-orange/80 uppercase tracking-widest ml-1 mb-1.5 block">
                        {tx.fullName}
                      </label>
                      <input
                        type="text"
                        placeholder={tx.enterName}
                        value={someoneElseData.name}
                        onChange={(e) =>
                          setSomeoneElseData({
                            ...someoneElseData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange outline-none text-sm font-bold text-gray-900 shadow-sm transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-orange/80 uppercase tracking-widest ml-1 mb-1.5 block">
                          {tx.gender}
                        </label>
                        <select
                          value={someoneElseData.gender}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              gender: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange outline-none text-sm font-bold text-gray-900 shadow-sm appearance-none transition-colors"
                        >
                          <option value="">{tx.select}</option>
                          <option value="male">{tx.male}</option>
                          <option value="female">{tx.female}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-orange/80 uppercase tracking-widest ml-1 mb-1.5 block">
                          {tx.birthDate}
                        </label>
                        <input
                          type="date"
                          value={someoneElseData.dob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              dob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange outline-none text-sm font-bold text-gray-900 shadow-sm transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-orange/80 uppercase tracking-widest ml-1 mb-1.5 block">
                          {tx.birthTime}
                        </label>
                        <input
                          type="time"
                          value={someoneElseData.tob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              tob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange outline-none text-sm font-bold text-gray-900 shadow-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-orange/80 uppercase tracking-widest ml-1 mb-1.5 block">
                          {tx.birthPlace}
                        </label>
                        <input
                          type="text"
                          placeholder={tx.cityCountry}
                          value={someoneElseData.pob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              pob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange outline-none text-sm font-bold text-gray-900 shadow-sm transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Big CTA and Balance Check */}
            <div className="pt-6 space-y-4">
              {isAuthenticated && eligibility !== null && (
                  <div className="flex items-center justify-between px-6 py-4 bg-[#FFF8F3] rounded-2xl border border-[#F5E0CC]">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                              <LucideIcons.Wallet className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-bold text-gray-600">{tx.yourBalance}</span>
                      </div>
                      <span className="text-xl font-black text-gray-900">₹{eligibility.currentBalance.toFixed(2)}</span>
                  </div>
              )}

              {showLowBalance ? (
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                      <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <LucideIcons.AlertCircle className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                              <h4 className="font-bold text-red-900 leading-none mb-1">{tx.lowBalance}</h4>
                              <p className="text-xs text-red-600 font-medium">{tx.lowBalanceDesc.replace('{price}', String(eligibility!.minBalanceRequired))}</p>
                          </div>
                      </div>
                      <button
                          onClick={() => router.push("/client/profile?tab=wallet")}
                          className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                      >
                          <LucideIcons.CreditCard className="w-5 h-5" />
                          <span>{tx.rechargeNow}</span>
                      </button>
                  </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange to-orange/80 rounded-[45px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

                  <button
                    onClick={handleStartConsultation}
                    disabled={actionLoading}
                    className={`group relative w-full py-4 md:py-5 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-[2rem] md:rounded-[2.5rem] font-extrabold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(255,85,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,85,0,0.4)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.98] transition-all duration-300 border-b-[5px] border-[#CC4400] overflow-hidden cursor-pointer ${
                      actionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {/* 3D Depth overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    {/* Hover shine effect */}
                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] group-hover:animate-[none] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
                    
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 relative z-10 group-hover:scale-125 transition-transform duration-300" fill="currentColor" />
                    <span className="tracking-wide relative z-10">
                      {actionLoading ? tx.connecting : tx.startConsultation}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white/70 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpertPreview;
