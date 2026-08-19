import React from 'react';
import Image from 'next/image';
import { useLanguageStore } from "@repo/store";

interface HeaderProfileProps {
  signData: {
    title: string;
    date: string;
    image: string;
  };
  formattedDate: string;
  luckyStats?: any;
}

export default function ZodiacHeaderProfile({ signData, formattedDate, luckyStats }: HeaderProfileProps) {
  const { lang } = useLanguageStore();

  const tx = {
    en: { today: "Today's Horoscope", number: "Lucky Number", color: "Lucky Color", time: "Lucky Time" },
    hi: { today: "आज का राशिफल", number: "शुभ अंक", color: "शुभ रंग", time: "शुभ समय" }
  }[lang] || { today: "Today's Horoscope", number: "Lucky Number", color: "Lucky Color", time: "Lucky Time" };

  const ZODIAC_HI_MAP: Record<string, { title: string, date: string }> = {
    "Aries": { title: "मेष", date: "21 मार्च - 19 अप्रैल" },
    "Taurus": { title: "वृषभ", date: "20 अप्रैल - 20 मई" },
    "Gemini": { title: "मिथुन", date: "21 मई - 20 जून" },
    "Cancer": { title: "कर्क", date: "21 जून - 22 जुलाई" },
    "Leo": { title: "सिंह", date: "23 जुलाई - 22 अगस्त" },
    "Virgo": { title: "कन्या", date: "23 अगस्त - 22 सितंबर" },
    "Libra": { title: "तुला", date: "23 सितंबर - 22 अक्टूबर" },
    "Scorpio": { title: "वृश्चिक", date: "23 अक्टूबर - 21 नवंबर" },
    "Sagittarius": { title: "धनु", date: "22 नवंबर - 21 दिसंबर" },
    "Capricorn": { title: "मकर", date: "22 दिसंबर - 19 जनवरी" },
    "Aquarius": { title: "कुंभ", date: "20 जनवरी - 18 फरवरी" },
    "Pisces": { title: "मीन", date: "19 फरवरी - 20 मार्च" }
  };

  const displayTitle = lang === 'hi' && ZODIAC_HI_MAP[signData.title] ? ZODIAC_HI_MAP[signData.title].title : signData.title;
  const displayDate = lang === 'hi' && ZODIAC_HI_MAP[signData.title] ? ZODIAC_HI_MAP[signData.title].date : signData.date;
  const getVibrantColor = (name: string, originalHex: string) => {
    if (!name) return originalHex;
    const vibrantColors: Record<string, string> = {
      'pink': '#EC4899', 
      'light blue': '#38BDF8', 
      'white': '#F8FAFC', 
      'yellow': '#EAB308', 
      'green': '#22C55E', 
      'red': '#EF4444', 
      'orange': '#F97316', 
      'blue': '#3B82F6', 
      'purple': '#A855F7', 
      'black': '#0F172A', 
      'brown': '#78350F', 
      'grey': '#64748B', 
      'cyan': '#06B6D4', 
      'maroon': '#831843', 
      'lavender': '#C084FC', 
    };
    return vibrantColors[name.toLowerCase()] || originalHex;
  };

  return (
    <div 
      className="rounded-[2rem] p-6 md:p-8 lg:p-10 border border-[#F0E6DD] shadow-sm relative overflow-hidden flex flex-col xl:flex-row items-center xl:items-center justify-between gap-8 mt-6"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      
      {/* Left Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8 z-10 text-center md:text-left">
        {/* Zodiac Icon Circular Background */}
        <div className="w-28 h-28 md:w-36 md:h-36 bg-[#FFF8F0] rounded-full flex items-center justify-center shrink-0 border border-[#FDEFE6] relative">
          <Image 
            src={signData.image} 
            alt={signData.title}
            width={80}
            height={80}
            className="object-contain w-20 h-20 md:w-24 md:h-24"
            unoptimized
          />
          {/* Decorative faint rings */}
          <div className="absolute inset-[-15px] rounded-full border border-[#FFF8F0] pointer-events-none"></div>
          <div className="absolute inset-[-30px] rounded-full border border-[#FFF8F0]/50 pointer-events-none hidden md:block"></div>
        </div>

        {/* Zodiac Details */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D1A0B] mb-2 capitalize">
            {displayTitle}
          </h1>
          <p className="text-slate-500 font-medium mb-4 text-sm md:text-base">
            {displayDate}
          </p>
          <div className="inline-flex justify-center md:justify-start">
            <span className="bg-[#FFF1E8] text-[#F26500] px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide">
              {tx.today}
            </span>
          </div>
          <p className="text-slate-600 mt-4 font-medium text-sm">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right Lucky Stats Section */}
      {luckyStats && (
        <div className="flex items-center w-full xl:w-auto z-10 overflow-x-auto hide-scrollbar pb-2 xl:pb-0">
          <div className="bg-[#FFFDF9] rounded-2xl p-4 md:p-6 shadow-sm border border-[#F26500] flex flex-row items-center gap-6 md:gap-8 divide-x divide-[#F26500] min-w-max xl:min-w-0">
            
            {/* Lucky Number */}
            <div className="flex items-center gap-4 pr-2 md:pr-4">
              <div className="w-12 h-12 rounded-full border border-[#F26500]/20 flex items-center justify-center text-xl shrink-0 text-[#F26500]">
                <i className="fa-solid fa-dice-five"></i>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 font-bold mb-0.5">{tx.number}</p>
                <p className="text-base font-black text-[#3D1A0B]">{luckyStats.lucky_number}</p>
              </div>
            </div>

            {/* Lucky Color */}
            <div className="flex items-center gap-4 px-4 md:px-8">
              <div className="w-12 h-12 rounded-full border border-[#F26500]/20 flex items-center justify-center text-xl shrink-0">
                <div className="w-6 h-6 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: getVibrantColor(luckyStats.lucky_color.name, luckyStats.lucky_color.hex) }}></div>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 font-bold mb-0.5">{tx.color}</p>
                <p className="text-base font-black text-[#3D1A0B]">{luckyStats.lucky_color.name}</p>
              </div>
            </div>

            {/* Lucky Time */}
            <div className="flex items-center gap-4 pl-4 md:pl-8 pr-2">
              <div className="w-12 h-12 rounded-full border border-[#F26500]/20 flex items-center justify-center text-xl shrink-0 text-[#F26500]">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 font-bold mb-0.5">{tx.time}</p>
                <p className="text-base font-black text-[#3D1A0B]">{luckyStats.lucky_time}</p>
              </div>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}
