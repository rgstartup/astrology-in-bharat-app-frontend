"use client";

import Image from "next/image";
import { X } from "lucide-react";
import ExpertPreview from "../expert-preview.component";
import type { PrepExpert, ChatPrepController } from "./types";
import type { SomeoneElseData } from "@/actions/chat";

type Props = {
  expert: PrepExpert;
  isExpertAvailable: boolean;
  askSomeoneElse: ChatPrepController["askSomeoneElse"];
  setAskSomeoneElse: ChatPrepController["setAskSomeoneElse"];
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: ChatPrepController["setSomeoneElseData"];
  handleStartConsultation: ChatPrepController["handleStartConsultation"];
  actionLoading: boolean;
  balance: number | null;
  showLowBalance: boolean;
  minBalanceRequired: number;
  isAuthenticated: boolean;
  onClose: () => void;
  onRecharge: () => void;
};

const DetailsStep = ({
  expert,
  isExpertAvailable,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance,
  showLowBalance,
  minBalanceRequired,
  isAuthenticated,
  onClose,
  onRecharge,
}: Props) => {
  return (
    <div>
      {/* Slim header band — avatar box straddles the divider */}
      <div className="relative h-24 bg-slate-900">
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-t-3xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-14 left-1/3 w-48 h-48 rounded-full bg-white/5" />
        </div>
        <span
          className={`absolute top-3 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
            isExpertAvailable
              ? "bg-white/95 text-emerald-700"
              : "bg-white/95 text-slate-500"
          }`}
        >
          {isExpertAvailable ? "Available now" : "Offline"}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
          <Image
            src={expert?.avatar || "/images/dummy-expert.jpg"}
            alt={expert?.name || "Expert"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <ExpertPreview
        expert={expert ? { ...expert, is_available: isExpertAvailable } : null}
        askSomeoneElse={askSomeoneElse}
        setAskSomeoneElse={setAskSomeoneElse}
        someoneElseData={someoneElseData}
        setSomeoneElseData={setSomeoneElseData}
        handleStartConsultation={handleStartConsultation}
        actionLoading={actionLoading}
        balance={balance}
        showLowBalance={showLowBalance}
        minBalanceRequired={minBalanceRequired}
        isAuthenticated={isAuthenticated}
        onRecharge={onRecharge}
      />
    </div>
  );
};

export default DetailsStep;
