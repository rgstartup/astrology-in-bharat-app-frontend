"use client";

import Image from "next/image";
import { X } from "lucide-react";
import ExpertPreview from "../expert-preview.component";
import type { PrepExpert, ConsultationPrepController } from "./types";
import type { SomeoneElseData } from "@/actions/chat";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import {
  ConsultationModeIcon,
  getConsultationModeLabel,
} from "../consultation-mode-icon";

export interface DetailsStepProps {
  expert: PrepExpert;
  mode?: ConsultationMode;
  isExpertAvailable: boolean;
  askSomeoneElse: ConsultationPrepController["askSomeoneElse"];
  setAskSomeoneElse: ConsultationPrepController["setAskSomeoneElse"];
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: ConsultationPrepController["setSomeoneElseData"];
  handleStartConsultation: ConsultationPrepController["handleStartConsultation"];
  actionLoading: boolean;
  balance: number | null;
  showLowBalance: boolean;
  deviceHint?: ConsultationPrepController["deviceHint"];
  onRetryDevices?: ConsultationPrepController["retryDeviceProbe"];
  minBalanceRequired: number;
  isAuthenticated: boolean;
  onClose: () => void;
  onRecharge: () => void;
}

/**
 * Status indicator badge for expert live availability.
 */
function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  if (isAvailable) {
    return (
      <span className="absolute top-3 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-white/95 text-emerald-700">
        Available now
      </span>
    );
  }

  return (
    <span className="absolute top-3 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-white/95 text-slate-500">
      Offline
    </span>
  );
}

/**
 * Details view inside ConsultationPrepModal showing avatar, mode icon, availability,
 * and embedding the expert preview.
 *
 * @param props - Component properties.
 * @returns Details step element.
 */
const DetailsStep = ({
  expert,
  mode = "chat",
  isExpertAvailable,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance,
  showLowBalance,
  deviceHint,
  onRetryDevices,
  minBalanceRequired,
  isAuthenticated,
  onClose,
  onRecharge,
}: DetailsStepProps) => {
  return (
    <div>
      {/* Header band — avatar and mode pill straddle the divider */}
      <div className="relative h-24 bg-slate-900">
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-t-3xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-14 left-1/3 w-48 h-48 rounded-full bg-white/5" />
        </div>

        <AvailabilityBadge isAvailable={isExpertAvailable} />

        {/* Mode indicator pill */}
        <div className="absolute top-3 right-12 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold tracking-wide uppercase">
          <ConsultationModeIcon mode={mode} className="w-3.5 h-3.5" />
          <span>{getConsultationModeLabel(mode)}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar with mode icon badge */}
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-slate-100">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={expert?.avatar || "/images/dummy-expert.jpg"}
              alt={expert?.name || "Expert"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center z-10">
            <ConsultationModeIcon mode={mode} className="w-3.5 h-3.5 text-orange-600" />
          </div>
        </div>
      </div>

      <ExpertPreview
        expert={expert ? { ...expert, is_available: isExpertAvailable } : null}
        mode={mode}
        isExpertAvailable={isExpertAvailable}
        askSomeoneElse={askSomeoneElse}
        setAskSomeoneElse={setAskSomeoneElse}
        someoneElseData={someoneElseData}
        setSomeoneElseData={setSomeoneElseData}
        handleStartConsultation={handleStartConsultation}
        actionLoading={actionLoading}
        balance={balance}
        showLowBalance={showLowBalance}
        deviceHint={deviceHint}
        onRetryDevices={onRetryDevices}
        minBalanceRequired={minBalanceRequired}
        isAuthenticated={isAuthenticated}
        onRecharge={onRecharge}
      />
    </div>
  );
};

export default DetailsStep;
