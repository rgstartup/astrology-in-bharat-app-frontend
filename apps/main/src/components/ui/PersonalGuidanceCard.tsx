import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";

interface PersonalGuidanceCardProps {
  className?: string;
  showExtraContent?: boolean;
}

const PersonalGuidanceCard: React.FC<PersonalGuidanceCardProps> = ({ className = "", showExtraContent = false }) => {
  const { lang } = useLanguageStore();
  const tHome = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const t = tHome.guidanceCard;

  return (
    <div className={`bg-[#FFF8F3] border-2 border-[#F26500] rounded-[2rem] p-6 pb-8 relative overflow-hidden flex flex-col ${className}`}>
      {/* Text Content */}
      <div className="relative z-10 mb-2">
        <h3 className="text-[19px] min-[400px]:text-[20px] lg:text-[22px] font-black text-[#301118] mb-3 leading-tight tracking-tight">
          {t.title}
        </h3>
        <p className="text-[#555] text-sm leading-relaxed mb-8">
          {t.desc}
        </p>

        <ul className="space-y-5">
          <li className="flex items-center gap-3 text-sm font-bold text-[#301118]">
            <div className="w-5 flex justify-center">
              <i className="fa-solid fa-shield-halved text-[#2E8B19]" />
            </div>
            {t.features.confidential}
          </li>
          <li className="flex items-center gap-3 text-sm font-bold text-[#301118]">
            <div className="w-5 flex justify-center">
              <i className="fa-solid fa-bolt text-[#F26500]" />
            </div>
            {t.features.instant}
          </li>
          <li className="flex items-center gap-3 text-sm font-bold text-[#301118]">
            <div className="w-5 flex justify-center">
              <i className="fa-solid fa-star text-[#F5B041]" />
            </div>
            {t.features.rating}
          </li>
          <li className="flex items-center gap-3 text-sm font-bold text-[#301118]">
            <div className="w-5 flex justify-center">
              <i className="fa-solid fa-users text-[#E74C3C]" />
            </div>
            {t.features.clients}
          </li>
        </ul>
        
        {showExtraContent && (
          <div className="mt-8 bg-white/60 border border-[#F5E0CC] rounded-xl p-4">
            <h4 className="text-sm font-bold text-[#301118] mb-3 flex items-center gap-2">
              <i className="fa-regular fa-comment-dots text-[#F26500]" /> {t.topQuestions}
            </h4>
            <div className="flex flex-col gap-2">
              <div className="bg-white rounded-lg p-2.5 text-[13px] text-[#222] font-medium shadow-sm border border-[#D0BBA0]">
                {t.questions[0]}
              </div>
              <div className="bg-white rounded-lg p-2.5 text-[13px] text-[#222] font-medium shadow-sm border border-[#D0BBA0]">
                {t.questions[1]}
              </div>
              <div className="bg-white rounded-lg p-2.5 text-[13px] text-[#222] font-medium shadow-sm border border-[#D0BBA0]">
                {t.questions[2]}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image & Button Area */}
      <div className="relative mt-auto pt-4 flex flex-col items-center">
        {/* Background Kundli Watermark */}
        <div className="absolute inset-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Image 
            src="/images/horoscope-round2.png" 
            alt="Kundli background" 
            width={250} 
            height={250} 
            className="object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full relative z-20 flex flex-col gap-2">
          <Link 
            href="/our-experts"
            className="w-full bg-[#F26500] hover:bg-[#D95A00] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-[15px] shadow-lg"
          >
            <i className="fa-regular fa-comments" /> {t.btn}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonalGuidanceCard;
