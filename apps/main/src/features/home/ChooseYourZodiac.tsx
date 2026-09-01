import React from "react";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";
import Link from "next/link";
import {
  TbZodiacAries,
  TbZodiacTaurus,
  TbZodiacGemini,
  TbZodiacCancer,
  TbZodiacLeo,
  TbZodiacVirgo,
  TbZodiacLibra,
  TbZodiacScorpio,
  TbZodiacSagittarius,
  TbZodiacCapricorn,
  TbZodiacAquarius,
  TbZodiacPisces,
} from "react-icons/tb";
import { getTranslations } from "next-intl/server";

const ZODIAC_HI_MAP: Record<string, { title: string; date: string }> = {
  Aries: { title: "मेष", date: "21 मार्च - 19 अप्रैल" },
  Taurus: { title: "वृषभ", date: "20 अप्रैल - 20 मई" },
  Gemini: { title: "मिथुन", date: "21 मई - 20 जून" },
  Cancer: { title: "कर्क", date: "21 जून - 22 जुलाई" },
  Leo: { title: "सिंह", date: "23 जुलाई - 22 अगस्त" },
  Virgo: { title: "कन्या", date: "23 अगस्त - 22 सितंबर" },
  Libra: { title: "तुला", date: "23 सितंबर - 22 अक्टूबर" },
  Scorpio: { title: "वृश्चिक", date: "23 अक्टूबर - 21 नवंबर" },
  Sagittarius: { title: "धनु", date: "22 नवंबर - 21 दिसंबर" },
  Capricorn: { title: "मकर", date: "22 दिसंबर - 19 जनवरी" },
  Aquarius: { title: "कुंभ", date: "20 जनवरी - 18 फरवरी" },
  Pisces: { title: "मीन", date: "19 फरवरी - 20 मार्च" },
};

interface ChooseYourZodiacProps {
  selectedSignId?: number;
  selectedSignIds?: number[];
  onSelectSign?: (sign: any) => void;
  isDark?: boolean;
}

const ZodiacIcon = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  switch (title.toLowerCase()) {
    case "aries":
      return <TbZodiacAries className={className} strokeWidth={1.5} />;
    case "taurus":
      return <TbZodiacTaurus className={className} strokeWidth={1.5} />;
    case "gemini":
      return <TbZodiacGemini className={className} strokeWidth={1.5} />;
    case "cancer":
      return <TbZodiacCancer className={className} strokeWidth={1.5} />;
    case "leo":
      return <TbZodiacLeo className={className} strokeWidth={1.5} />;
    case "virgo":
      return <TbZodiacVirgo className={className} strokeWidth={1.5} />;
    case "libra":
      return <TbZodiacLibra className={className} strokeWidth={1.5} />;
    case "scorpio":
      return <TbZodiacScorpio className={className} strokeWidth={1.5} />;
    case "sagittarius":
      return <TbZodiacSagittarius className={className} strokeWidth={1.5} />;
    case "capricorn":
      return <TbZodiacCapricorn className={className} strokeWidth={1.5} />;
    case "aquarius":
      return <TbZodiacAquarius className={className} strokeWidth={1.5} />;
    case "pisces":
      return <TbZodiacPisces className={className} strokeWidth={1.5} />;
    default:
      return <TbZodiacAries className={className} strokeWidth={1.5} />;
  }
};

const ChooseYourZodiac: React.FC<ChooseYourZodiacProps> = async ({
  selectedSignId,
  selectedSignIds,
  onSelectSign,
  isDark = false,
}) => {
  const t = await getTranslations("Home");
  const authT = await getTranslations("Auth");

  return (
    <section
      className={`pt-6 md:pt-10 pb-10 md:pb-16 relative ${isDark ? "bg-fixed bg-cover bg-center text-white" : "bg-[#FAF8F5] text-[#2D1B15]"}`}
      style={
        isDark
          ? {
              backgroundImage: "url('/images/cosmic/media__1782217293850.jpg')",
            }
          : {}
      }
    >
      {isDark && (
        <div className="absolute inset-0 bg-[#3B1C0A]/85 backdrop-blur-[2px] z-0"></div>
      )}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div
          className="mb-12"
          style={
            isDark
              ? ({ "--heading-border-color": "rgba(255,255,255,0.2)" } as any)
              : {}
          }
        >
          <h2 className="section-heading-premium">
            <span>{t("chooseYourZodiacSign")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
          {ZodiacSignsData.map((sign) => {
            const isSelected =
              selectedSignId === sign.id ||
              (selectedSignIds && selectedSignIds.includes(sign.id as number));
            const hiData = ZODIAC_HI_MAP[sign.title];
            const displayTitle = hiData ? hiData.title : authT("signIn.title");
            const displayDate = hiData ? hiData.title : sign.date;

            const cardContent = (
              <div
                className={`flex flex-col items-center justify-center pt-6 pb-5 px-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#F26500] border-2 border-[#F26500] shadow-lg scale-[1.02]"
                    : "border-2 border-[#F26500] bg-white hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <div
                  className={`w-16 h-16 mb-4 relative flex items-center justify-center rounded-full border transition-colors ${isSelected ? "border-white" : "border-[#F26500]"}`}
                >
                  <div
                    className={`absolute top-1 right-2 w-1 h-1 rounded-full z-10 ${isSelected ? "bg-white" : "bg-[#F26500]"}`}
                  ></div>
                  <div
                    className={`absolute bottom-1 left-2 w-1 h-1 rounded-full z-10 ${isSelected ? "bg-white" : "bg-[#F26500]"}`}
                  ></div>
                  <div
                    className={`absolute top-4 left-0 w-[2px] h-[2px] rounded-full z-10 ${isSelected ? "bg-white" : "bg-[#F26500]"}`}
                  ></div>

                  <ZodiacIcon
                    title={sign.title}
                    className={`w-10 h-10 transition-colors ${isSelected ? "text-white" : "text-[#F26500]"}`}
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <h3
                    className={`text-[14px] font-bold transition-colors ${isSelected ? "text-white" : "text-black"}`}
                  >
                    {displayTitle}
                  </h3>
                  <p
                    className={`text-[12px] transition-colors ${isSelected ? "text-white/90" : "text-black"}`}
                  >
                    ({sign.title})
                  </p>
                </div>
                <p
                  className={`text-[10px] font-medium mt-2 text-center transition-colors ${isSelected ? "text-white/80" : "text-black"}`}
                >
                  {displayDate}
                </p>
              </div>
            );

            if (onSelectSign) {
              return (
                <div key={sign.id} onClick={() => onSelectSign(sign)}>
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                href={`/horoscope/${sign.title.toLowerCase()}`}
                key={sign.id}
                className="block no-underline"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChooseYourZodiac;
