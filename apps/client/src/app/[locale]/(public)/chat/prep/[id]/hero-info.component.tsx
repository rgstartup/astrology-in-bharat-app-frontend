"use client";

import React from "react";
import { MessageSquare, User, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  expertName?: string;
};

const HeroInfo = ({ expertName }: Props) => {
  const t = useTranslations("Chat.heroInfo");

  const checklistItems = [
    t("checklistItems.0"),
    t("checklistItems.1"),
    t("checklistItems.2"),
    t("checklistItems.3"),
  ];

  return (
    <div className="order-2 lg:order-1 lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {t("talkTo")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FF5500]">
            {expertName}
          </span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-white border-2 border-orange-500/20 hover:border-orange-500 shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
            <MessageSquare className="w-6 h-6 text-[#FF5500]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t("liveChat")}</h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {t("liveChatDesc")}
          </p>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-white border-2 border-orange-500/20 hover:border-orange-500 shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
            <Calendar className="w-6 h-6 text-[#FF5500]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t("instantAccess")}</h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {t("instantAccessDesc")}
          </p>
        </div>
      </div>

      {/* Consultation Checklist */}
      <div className="p-8 rounded-[3rem] bg-white text-gray-900 border-2 border-gray-100 overflow-hidden relative group shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-[0.03] blur-[80px] -mr-32 -mt-32"></div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#FF5500]" />
          </div>
          {t("sessionChecklist")}
        </h3>
        <ul className="space-y-4">
          {checklistItems.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-orange-500/10 text-[#FF5500] border border-orange-500/20 flex items-center justify-center text-[10px] font-bold">
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
