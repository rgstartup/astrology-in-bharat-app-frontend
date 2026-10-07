"use client";

import { useRouter } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import type { SomeoneElseData } from "@/actions/chat";
import { useTranslations } from "next-intl";
import { Wallet, AlertCircle, ShieldCheck } from "lucide-react";
import ExpertHeader from "./components/expert-header";
import ConsultingFor from "./components/consulting-for";

type Props = {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: (val: SomeoneElseData) => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
  balance?: number | null;
  showLowBalance?: boolean;
  minBalanceRequired?: number;
  isAuthenticated?: boolean;
  /** When provided, low-balance CTA enters an embedded recharge step instead of redirecting. */
  onRecharge?: () => void;
};

const ExpertPreview = ({
  expert,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance = null,
  showLowBalance = false,
  minBalanceRequired = 0,
  isAuthenticated = false,
  onRecharge,
}: Props) => {
  const router = useRouter();
  const tx = useTranslations("Chat.expertPreview");

  const isExpertAvailable = Boolean(
    expert?.isAvailableForConsultation ??
      (expert?.status === "online" || Boolean(expert?.is_available)),
  );

  return (
    <div className="p-5 space-y-4">
      <ExpertHeader expert={expert} isAvailable={isExpertAvailable} />

      {isAuthenticated && balance !== null && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Wallet className="w-4 h-4 text-emerald-600" />
            {tx("yourBalance")}
          </span>
          <span className="text-base font-black text-slate-900">
            ₹{balance.toFixed(2)}
          </span>
        </div>
      )}

      <ConsultingFor
        askSomeoneElse={askSomeoneElse}
        setAskSomeoneElse={setAskSomeoneElse}
        someoneElseData={someoneElseData}
        setSomeoneElseData={setSomeoneElseData}
      />

      {showLowBalance ? (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                {tx("lowBalance")}
              </h4>
              <p className="text-xs text-red-600">
                {tx("lowBalanceDesc", { price: minBalanceRequired || 0 })}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onRecharge ? onRecharge() : router.push("/client/profile?tab=wallet")
            }
            className="w-full py-3 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer"
          >
            {tx("rechargeNow")}
          </button>
        </div>
      ) : (
        <button
          onClick={handleStartConsultation}
          disabled={actionLoading}
          className="w-full py-3.5 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {actionLoading ? tx("connecting") : tx("startConsultation")}
        </button>
      )}

      <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        {tx("verifiedExpert")}
      </p>
    </div>
  );
};

export default ExpertPreview;
