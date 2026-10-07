"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Lock,
  Link2Off,
  CreditCard,
  EyeOff,
  PhoneOff,
  Ban,
  Flag,
  BadgeCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

type Props = {
  showSecurityModal: boolean;
  setShowSecurityModal: (val: boolean) => void;
  proceedToChat: () => void;
};

const TIP_ICONS: LucideIcon[] = [
  Lock,
  Link2Off,
  CreditCard,
  EyeOff,
  PhoneOff,
  Ban,
  Flag,
  BadgeCheck,
];

const SecurityTipsModal = ({
  showSecurityModal,
  setShowSecurityModal,
  proceedToChat,
}: Props) => {
  const tx = useTranslations("Chat.securityModal");
  const [agreed, setAgreed] = useState(false);

  if (!showSecurityModal) return null;

  const tipCount = 8;

  const confirm = () => {
    if (!agreed) {
      toast.warning(tx("toastWarning"));
      return;
    }
    proceedToChat();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
      <div
        className="bg-white w-full max-w-lg max-h-[85vh] md:max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col relative shrink-0"
        data-lenis-prevent="true"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {tx("title")}
            </h2>
            <p className="text-xs text-slate-500">{tx("subtitle")}</p>
          </div>
        </div>

        <div
          className="px-5 py-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar touch-pan-y overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ul className="divide-y divide-slate-100">
            {Array.from({ length: tipCount }, (_, i) => {
              const Icon = TIP_ICONS[i] ?? ShieldCheck;
              return (
                <li key={i} className="flex gap-3 py-3">
                  <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-[13px]">
                      {tx(`tips.${i}.title`)}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tx(`tips.${i}.desc`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex gap-3">
            <TriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">{tx("disclaimerTitle")}: </span>
              {tx("disclaimerText")} {tx("disclaimerBold")} {tx("disclaimerEnd")}
            </p>
          </div>

          <label className="mt-3 flex items-start gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer has-checked:border-[#FF5500] has-checked:bg-orange-50/50 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[#FF5500] cursor-pointer shrink-0"
            />
            <span className="text-xs font-medium text-slate-700 leading-relaxed">
              {tx("agreeText")}
            </span>
          </label>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSecurityModal(false)}
            className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            {tx("cancel")}
          </button>
          <button
            onClick={confirm}
            disabled={!agreed}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:shadow-none"
          >
            {tx("agreeBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTipsModal;
