import React from "react";
import Image from "next/image";
import { ZodiacSignsData } from "@/components/features/services/zodiac";
import { useLanguageStore, horoscopeTranslations } from "@repo/store";

interface ZodiacGridProps {
  onSelectSign: (sign: any) => void;
  selectedSignId?: string | number;
  signPreviews?: Record<string, string>;
  activeTab?: string;
}

const ZodiacGrid: React.FC<ZodiacGridProps> = ({ onSelectSign, selectedSignId, signPreviews = {}, activeTab = "daily" }) => {
  const { lang } = useLanguageStore();
  const t = horoscopeTranslations[lang];

  // Helper to get translated tab name (default to 'daily' if not matching)
  const tabName = activeTab === "daily" ? t.tabs.daily :
                  activeTab === "weekly" ? t.tabs.weekly :
                  activeTab === "monthly" ? t.tabs.monthly :
                  activeTab === "yearly" ? t.tabs.yearly : t.tabs.daily;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-[18px] sm:text-[22px] font-serif font-bold text-[#3D1A0B] flex items-center gap-2 whitespace-nowrap">
          <i className="fa-solid fa-sun text-[#F26500] text-[20px] sm:text-[24px]"></i>
          {t.zodiacGrid.selectSign}
        </h2>
        <p className="text-[14px] text-gray-700 ml-8">
          {t.zodiacGrid.clickSign} {tabName}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ZodiacSignsData.map((sign) => {
          const isSelected = selectedSignId === sign.id;
          return (
            <div
              key={sign.id}
              onClick={() => onSelectSign(sign)}
              className={`group flex flex-col bg-white rounded-xl p-5 border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md border-[#F26500] hover:bg-[#F26500] ${
                isSelected ? 'shadow-sm' : ''
              }`}
            >
              {/* Top part: Icon + Name/Date */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-[50px] h-[50px] shrink-0 border border-[#E8D5C0] rounded-full p-2 flex items-center justify-center bg-[#FFF8F0]">
                  {/* We tint the image orange slightly using CSS or just rely on the original image */}
                  <Image src={sign.image} alt={sign.title} width={30} height={30} className="object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[#3D1A0B] group-hover:text-white transition-colors text-[16px]">
                    {t.zodiacNames[sign.title as keyof typeof t.zodiacNames] || sign.title}
                  </h3>
                  <p className="text-[12px] text-gray-700 group-hover:text-white/80 transition-colors">
                    {lang === "hi" ? sign.date.replace(/[A-Za-z]+/g, (match: string) => t.months[match as keyof typeof t.months] || match) : sign.date}
                  </p>
                </div>
              </div>

              {/* Preview text */}
              <p className="text-[13px] text-gray-800 group-hover:text-white/90 transition-colors leading-relaxed flex-1">
                {activeTab === "daily" 
                  ? (signPreviews[sign.title] || t.zodiacGrid.defaultPreview)
                  : `${t.zodiacGrid.previewPrefix} ${tabName}`
                }
              </p>

              {/* Link */}
              <div className="mt-4 flex justify-between items-center text-[#F26500] group-hover:text-white transition-colors font-bold text-[13px]">
                {t.zodiacGrid.viewHoroscope}
                <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZodiacGrid;
