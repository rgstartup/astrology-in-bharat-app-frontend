"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useLanguageStore } from "@repo/store";

const { MessageSquare, User, Calendar } = LucideIcons as any;

const t = {
  en: {
    preparingConnection: "Preparing Connection",
    talkTo: "Talk to",
    subtitle: "Get deep cosmic insights about your career, marriage, and future. Your session is 100% private.",
    liveChat: "Live Chat",
    liveChatDesc: "Real-time answers from verified experts.",
    instantAccess: "Instant Access",
    instantAccessDesc: "No appointments needed. Connect now.",
    sessionChecklist: "Session Checklist",
    checklistItems: [
      "Keep your Birth Date & Time ready",
      "Ask specific questions for clearer answers",
      "Your session is 256-bit encrypted",
      "Expert is live and awaiting your message",
    ],
  },
  hi: {
    preparingConnection: "कनेक्शन तैयार हो रहा है",
    talkTo: "बात करें",
    subtitle: "अपने करियर, विवाह और भविष्य के बारे में गहरी ज्योतिषीय जानकारी पाएं। आपका सत्र 100% निजी है।",
    liveChat: "लाइव चैट",
    liveChatDesc: "सत्यापित विशेषज्ञों से वास्तविक समय के उत्तर।",
    instantAccess: "तत्काल पहुंच",
    instantAccessDesc: "कोई अपॉइंटमेंट नहीं चाहिए। अभी जुड़ें।",
    sessionChecklist: "सत्र चेकलिस्ट",
    checklistItems: [
      "अपनी जन्मतिथि और समय तैयार रखें",
      "स्पष्ट उत्तरों के लिए विशिष्ट प्रश्न पूछें",
      "आपका सत्र 256-बिट एन्क्रिप्टेड है",
      "विशेषज्ञ लाइव है और आपके संदेश की प्रतीक्षा कर रहा है",
    ],
  },
};

type Props = {
  expertName?: string;
};

const HeroInfo = ({ expertName }: Props) => {
  const { lang } = useLanguageStore();
  const text = t[lang] || t.en;

  return (
    <div className="order-2 lg:order-1 lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
      <div className="space-y-4">
        <span className="px-4 py-1.5 bg-orange/10 text-orange text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-orange/20 inline-block">
          {text.preparingConnection}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {text.talkTo}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange">
            {expertName}
          </span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
          {text.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-white border-2 border-orange/20 hover:border-orange shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center mb-4 group-hover:bg-orange/20 transition-colors">
            <MessageSquare className="w-6 h-6 text-orange" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{text.liveChat}</h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {text.liveChatDesc}
          </p>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-white border-2 border-orange/20 hover:border-orange shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center mb-4 group-hover:bg-orange/20 transition-colors">
            <Calendar className="w-6 h-6 text-orange" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{text.instantAccess}</h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {text.instantAccessDesc}
          </p>
        </div>
      </div>

      {/* Consultation Checklist */}
      <div className="p-8 rounded-[3rem] bg-white text-gray-900 border-2 border-gray-100 overflow-hidden relative group shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange opacity-[0.03] blur-[80px] -mr-32 -mt-32"></div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <User className="w-5 h-5 text-orange" />
          </div>
          {text.sessionChecklist}
        </h3>
        <ul className="space-y-4">
          {text.checklistItems.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-orange/10 text-orange border border-orange/20 flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </div>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeroInfo;
