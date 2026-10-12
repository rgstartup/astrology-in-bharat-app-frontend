"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { WalletRechargeForm } from "@/features/dashboard";

type Props = {
  minBalanceRequired: number;
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const RechargeStep = ({ minBalanceRequired, onBack, onClose, onSuccess }: Props) => {
  const tm = useTranslations("Chat.modal");

  return (
    <div className="p-5">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 mb-2">
        <button
          onClick={onBack}
          aria-label={tm("back")}
          className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
            {tm("rechargeTitle")}
          </h2>
          <p className="text-[11px] text-slate-500">
            {tm("rechargeDesc", {
              price: minBalanceRequired || 0,
            })}
          </p>
        </div>
      </div>

      <WalletRechargeForm
        defaultAmount={minBalanceRequired || 500}
        onSuccess={onSuccess}
      />

      <div className="flex gap-3 pt-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {tm("back")}
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {tm("cancel")}
        </button>
      </div>
    </div>
  );
};

export default RechargeStep;
