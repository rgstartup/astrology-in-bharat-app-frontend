"use client";

import { useTranslations } from "next-intl";
import { Wallet, X } from "lucide-react";
import { WalletRechargeForm } from "@/features/dashboard";

export interface InsufficientFundsStepProps {
  currentBalance: number;
  requiredAmount: number;
  defaultAmount: number;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

/**
 * Step rendered when client wallet balance is insufficient for the 5-minute consultation hold.
 *
 * @param props - Component properties.
 * @returns Insufficient funds view element.
 */
const InsufficientFundsStep = ({
  currentBalance,
  requiredAmount,
  defaultAmount,
  onClose,
  onSuccess,
}: InsufficientFundsStepProps) => {
  const tm = useTranslations("Chat.modal");
  const shortfall = Math.max(requiredAmount - currentBalance, 0);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="relative p-5">
      <button
        type="button"
        onClick={onClose}
        aria-label={tm("cancel")}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-2.5 px-3 py-2.5 pr-10 bg-red-50 rounded-2xl border border-red-200 mb-2">
        <Wallet className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-red-700">
            {tm("insufficientTitle")}
          </p>
          <p className="text-xs text-red-700 leading-snug">
            {tm.rich("insufficientDesc", {
              shortfall: Math.ceil(shortfall).toLocaleString("en-IN"),
              b: (chunks) => (
                <span className="font-extrabold text-red-800">{chunks}</span>
              ),
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500">
            {tm("currentBalance")}
          </p>
          <p className="text-sm font-bold text-slate-900 font-outfit">
            {inr(currentBalance)}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500">
            {tm("requiredBalance")}
          </p>
          <p className="text-sm font-bold text-slate-900 font-outfit">
            {inr(requiredAmount)}
          </p>
        </div>
      </div>

      <WalletRechargeForm defaultAmount={defaultAmount} onSuccess={onSuccess} />
    </div>
  );
};

export default InsufficientFundsStep;
