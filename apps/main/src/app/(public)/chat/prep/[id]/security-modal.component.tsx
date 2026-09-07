"use client";

import React from "react";
import { toast } from "react-toastify";
import { useLanguageStore } from "@repo/store";

const smT = {
  en: {
    title: "Important Safety Guidelines",
    subtitle: "Please read carefully before starting",
    tips: [
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
    ],
    disclaimerTitle: "Important Disclaimer",
    disclaimerText: "By proceeding, you acknowledge that any communication or transaction outside the Astrology in Bharat platform is strictly at your own risk.",
    disclaimerBold: "We will NOT be held responsible or liable for any issues, fraud, or losses",
    disclaimerEnd: "arising from direct contact with experts outside our official platform.",
    agreeText: "I have read and understood all the safety guidelines and disclaimer. I agree to follow these precautions during my consultation and will not share any contact details.",
    cancel: "Cancel",
    agreeBtn: "I Agree & Continue",
    toastWarning: "⚠️ Please agree to the safety guidelines to continue",
  },
  hi: {
    title: "महत्वपूर्ण सुरक्षा दिशानिर्देश",
    subtitle: "शुरू करने से पहले कृपया ध्यान से पढ़ें",
    tips: [
      {
        icon: "🔒",
        title: "OTP या पासवर्ड कभी साझा न करें",
        desc: "हमारे विशेषज्ञ कभी भी OTP, पासवर्ड, बैंक PIN, या CVV नंबर नहीं मांगेंगे। अगर कोई मांगे, तो तुरंत रिपोर्ट करें।",
      },
      {
        icon: "🚫",
        title: "बाहरी लिंक से सावधान रहें",
        desc: "चैट के दौरान साझा किए गए किसी भी संदिग्ध लिंक पर क्लिक न करें। सभी भुगतान केवल हमारे प्लेटफॉर्म पर सुरक्षित रूप से होते हैं।",
      },
      {
        icon: "💳",
        title: "भुगतान सुरक्षा",
        desc: "हमारे आधिकारिक प्लेटफॉर्म के बाहर कभी भुगतान न करें। सभी लेनदेन एन्क्रिप्टेड और सुरक्षित हैं।",
      },
      {
        icon: "📱",
        title: "व्यक्तिगत जानकारी",
        desc: "आधार, PAN, या क्रेडिट कार्ड नंबर जैसी संवेदनशील जानकारी साझा करने से बचें। केवल ज्योतिष संबंधी जानकारी साझा करें।",
      },
      {
        icon: "📵",
        title: "संपर्क विवरण साझा न करें",
        desc: "विशेषज्ञ के साथ अपना मोबाइल नंबर, ईमेल, WhatsApp, या कोई भी सोशल मीडिया हैंडल कभी साझा न करें।",
      },
      {
        icon: "⛔",
        title: "प्लेटफॉर्म के बाहर सीधा संपर्क नहीं",
        desc: "इस प्लेटफॉर्म के बाहर सीधे विशेषज्ञों से संपर्क न करें। ऐसा करने पर किसी भी समस्या के लिए Astrology in Bharat जिम्मेदार नहीं होगा।",
      },
      {
        icon: "⚠️",
        title: "संदिग्ध गतिविधि की रिपोर्ट करें",
        desc: "यदि आपको कोई असामान्य व्यवहार या अनुरोध दिखे, तो तुरंत सत्र समाप्त करें और हमारी सहायता टीम से संपर्क करें।",
      },
      {
        icon: "✅",
        title: "केवल सत्यापित विशेषज्ञ",
        desc: "हमारे सभी विशेषज्ञ सत्यापित पेशेवर हैं। फिर भी, परामर्श के दौरान अपना विवेक उपयोग करें और सतर्क रहें।",
      },
    ],
    disclaimerTitle: "महत्वपूर्ण अस्वीकरण",
    disclaimerText: "आगे बढ़कर, आप स्वीकार करते हैं कि Astrology in Bharat प्लेटफॉर्म के बाहर कोई भी संचार या लेनदेन पूरी तरह से आपके अपने जोखिम पर है।",
    disclaimerBold: "किसी भी समस्या, धोखाधड़ी, या नुकसान के लिए हम जिम्मेदार नहीं होंगे",
    disclaimerEnd: "जो प्लेटफॉर्म के बाहर विशेषज्ञों से सीधे संपर्क के कारण हो।",
    agreeText: "मैंने सभी सुरक्षा दिशानिर्देश और अस्वीकरण पढ़ और समझ लिए हैं। मैं परामर्श के दौरान इन सावधानियों का पालन करने और कोई संपर्क विवरण साझा न करने से सहमत हूं।",
    cancel: "रद्द करें",
    agreeBtn: "मैं सहमत हूं और जारी रखें",
    toastWarning: "⚠️ जारी रखने के लिए कृपया सुरक्षा दिशानिर्देशों से सहमत हों",
  },
};

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
  const { lang } = useLanguageStore();
  const tx = smT[lang] || smT.en;

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
                {tx.title}
              </h2>
              <p className="text-white/80 text-[10px] md:text-[11px] font-medium leading-tight">
                {tx.subtitle}
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
              {tx.tips.map((tip, index) => (
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
                    {tx.disclaimerTitle}
                  </h3>
                  <p className="text-xs text-red-600 leading-relaxed font-semibold">
                    {tx.disclaimerText}
                    <span className="font-black">
                      {" "}{tx.disclaimerBold}
                    </span>{" "}
                    {tx.disclaimerEnd}
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
                  {tx.agreeText}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSecurityModal(false)}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs md:text-sm hover:bg-gray-50 transition-colors"
          >
            {tx.cancel}
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById("agreeTerms") as HTMLInputElement;
              if (!checkbox?.checked) {
                toast.warning(tx.toastWarning);
                const checkboxContainer = checkbox?.parentElement;
                if (checkboxContainer) {
                  checkboxContainer.classList.add("animate-shake");
                  setTimeout(() => checkboxContainer.classList.remove("animate-shake"), 500);
                }
                return;
              }
              proceedToChat();
            }}
            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs md:text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {tx.agreeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTipsModal;
