"use client";

import React from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

type Props = {
  showSecurityModal: boolean;
  setShowSecurityModal: (val: boolean) => void;
  proceedToChat: () => void;
};

const SecurityTipsModal = ({
  showSecurityModal,
  setShowSecurityModal,
  proceedToChat,
}: Props) => {
  const tx = useTranslations("Chat.securityModal");

  const tips = [
    { icon: "🔒", title: tx("tips.0.title"), desc: tx("tips.0.desc") },
    { icon: "🚫", title: tx("tips.1.title"), desc: tx("tips.1.desc") },
    { icon: "💳", title: tx("tips.2.title"), desc: tx("tips.2.desc") },
    { icon: "📱", title: tx("tips.3.title"), desc: tx("tips.3.desc") },
    { icon: "📵", title: tx("tips.4.title"), desc: tx("tips.4.desc") },
    { icon: "⛔", title: tx("tips.5.title"), desc: tx("tips.5.desc") },
    { icon: "⚠️", title: tx("tips.6.title"), desc: tx("tips.6.desc") },
    { icon: "✅", title: tx("tips.7.title"), desc: tx("tips.7.desc") },
  ];

  if (!showSecurityModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
    >
      <div
        className="bg-white w-full max-w-lg max-h-[85vh] md:max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col relative shrink-0"
        data-lenis-prevent="true"
      >
        {/* Header */}
        <div className="p-3 md:p-4 bg-gradient-to-br from-red-500 to-orange-500 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black leading-tight">
                {tx("title")}
              </h2>
              <p className="text-white/80 text-[10px] md:text-[11px] font-medium leading-tight">
                {tx("subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 md:p-6 w-full relative overflow-y-auto flex-1 min-h-0 custom-scrollbar touch-pan-y overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="space-y-4 w-full">
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-[#FFFDF9] rounded-2xl border border-[#F0E0D0] hover:border-orange-200 transition-colors"
                >
                  <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer Box */}
            <div className="p-5 bg-red-50 rounded-2xl border-2 border-red-200">
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">⚖️</div>
                <div>
                  <h3 className="font-black text-red-700 mb-2 text-sm">
                    {tx("disclaimerTitle")}
                  </h3>
                  <p className="text-xs text-red-600 leading-relaxed font-semibold">
                    {tx("disclaimerText")}{" "}
                    <span className="font-black">
                      {tx("disclaimerBold")}
                    </span>{" "}
                    {tx("disclaimerEnd")}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox Agreement */}
            <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
              <label className="flex items-start gap-5 cursor-pointer group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className="m-2 w-5 h-5 rounded border-2 border-orange-400 text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-xs md:text-sm font-bold text-gray-800 transition-colors leading-relaxed">
                  {tx("agreeText")}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSecurityModal(false)}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs md:text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {tx("cancel")}
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById("agreeTerms") as HTMLInputElement;
              if (!checkbox?.checked) {
                toast.warning(tx("toastWarning"));
                const checkboxContainer = checkbox?.parentElement;
                if (checkboxContainer) {
                  checkboxContainer.classList.add("animate-shake");
                  setTimeout(() => checkboxContainer.classList.remove("animate-shake"), 500);
                }
                return;
              }
              proceedToChat();
            }}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs md:text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {tx("agreeBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTipsModal;
