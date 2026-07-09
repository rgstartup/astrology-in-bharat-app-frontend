"use client";

import React from "react";
import { toast } from "react-toastify";

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
  if (!showSecurityModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
    >
      <div
        className="bg-[#1A1A1A] w-full max-w-lg max-h-[85vh] md:max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col relative shrink-0"
        data-lenis-prevent="true"
      >
        {/* Header */}
        <div className="p-3 md:p-4 bg-gradient-to-br from-red-500 to-orange-500 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A1A1A]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A1A1A]/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black leading-tight">
                Important Safety Guidelines
              </h2>
              <p className="text-white/80 text-[10px] md:text-[11px] font-medium leading-tight">
                Please read carefully before starting
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 md:p-6 w-full relative overflow-y-auto flex-1 min-h-0 custom-scrollbar touch-pan-y overscroll-contain"
          style={{ 
            WebkitOverflowScrolling: 'touch',
          }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="space-y-4 w-full">
            <div className="space-y-3">
              {[
                {
                  icon: "🔒",
                  title: "Never Share OTPs or Passwords",
                  desc: "Our experts will NEVER ask for OTPs, passwords, bank PINs, or CVV numbers. If anyone asks, report immediately.",
                },
                {
                  icon: "🚫",
                  title: "Beware of External Links",
                  desc: "Do not click on any suspicious links shared during the chat. All payments are processed securely within our platform only.",
                },
                {
                  icon: "💳",
                  title: "Payment Security",
                  desc: "Never make payments outside our official platform. All transactions are encrypted and protected by our secure payment gateway.",
                },
                {
                  icon: "📱",
                  title: "Personal Information",
                  desc: "Avoid sharing sensitive personal details like Aadhaar, PAN, or credit card numbers. Only share astrological information.",
                },
                {
                  icon: "📵",
                  title: "Do Not Share Contact Details",
                  desc: "NEVER share your mobile number, email, WhatsApp, or any social media handles with the expert. All communication must happen only on our platform.",
                },
                {
                  icon: "⛔",
                  title: "No Direct Contact Outside Platform",
                  desc: "Do NOT contact experts directly outside this platform. If you do so and face any issues, Astrology in Bharat will NOT be responsible or liable.",
                },
                {
                  icon: "⚠️",
                  title: "Report Suspicious Activity",
                  desc: "If you notice any unusual behavior or requests, immediately end the session and contact our support team.",
                },
                {
                  icon: "✅",
                  title: "Verified Experts Only",
                  desc: "All our experts are verified professionals. However, use your judgment and stay alert during consultations.",
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-[#242424] rounded-2xl border border-[#333333] hover:border-orange-200 transition-colors"
                >
                  <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-100 mb-1 text-sm">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
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
                    Important Disclaimer
                  </h3>
                  <p className="text-xs text-red-600 leading-relaxed font-semibold">
                    By proceeding, you acknowledge that any communication or
                    transaction outside the Astrology in Bharat platform is
                    strictly at your own risk.
                    <span className="font-black">
                      {" "}
                      We will NOT be held responsible or liable for any issues,
                      fraud, or losses
                    </span>{" "}
                    arising from direct contact with experts outside our
                    official platform.
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
                <span className="text-xs md:text-sm font-bold text-gray-200 transition-colors leading-relaxed">
                  I have read and understood all the safety guidelines and
                  disclaimer. I agree to follow these precautions during my
                  consultation and will not share any contact details.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 bg-[#242424] border-t border-[#333333] flex gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSecurityModal(false)}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-800 text-gray-400 font-bold text-xs md:text-sm hover:bg-[#2A2A2A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById(
                "agreeTerms",
              ) as HTMLInputElement;
              if (!checkbox?.checked) {
                toast.warning(
                  "⚠️ Please agree to the safety guidelines to continue",
                );
                const checkboxContainer = checkbox?.parentElement;
                if (checkboxContainer) {
                  checkboxContainer.classList.add("animate-shake");
                  setTimeout(
                    () => checkboxContainer.classList.remove("animate-shake"),
                    500,
                  );
                }
                return;
              }
              proceedToChat();
            }}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs md:text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTipsModal;
