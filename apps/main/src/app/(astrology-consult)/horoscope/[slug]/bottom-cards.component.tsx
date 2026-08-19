import React from 'react';
import Image from 'next/image';
import { useLanguageStore } from "@repo/store";

export function LuckyAspects() {
  const { lang } = useLanguageStore();
  const tx = {
    en: { title: "Lucky Aspects", p1: "Wear something red to attract positive energy.", p2: "Meditate between 11:00 AM to 1:00 PM.", p3: "Number 9 can bring you good luck today." },
    hi: { title: "शुभ पहलू", p1: "सकारात्मक ऊर्जा आकर्षित करने के लिए कुछ लाल रंग का पहनें।", p2: "सुबह 11:00 बजे से दोपहर 1:00 बजे के बीच ध्यान करें।", p3: "आज अंक 9 आपके लिए सौभाग्य ला सकता है।" }
  }[lang] || { title: "Lucky Aspects", p1: "Wear something red to attract positive energy.", p2: "Meditate between 11:00 AM to 1:00 PM.", p3: "Number 9 can bring you good luck today." };
  
  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-wand-magic-sparkles text-[#F26500]"></i> 
        {tx.title}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p1}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p2}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p3}</p>
        </li>
      </ul>
    </div>
  );
}

export function RemedyForYou() {
  const { lang } = useLanguageStore();
  const tx = {
    en: { title: "Remedy for You", p1: "Offer red flowers to Lord Hanuman.", p2: "Chant \"Om Angarakaya Namaha\" 108 times.", p3: "Donate red lentils (Masoor Dal) to the needy." },
    hi: { title: "आपके लिए उपाय", p1: "भगवान हनुमान को लाल फूल चढ़ाएं।", p2: "108 बार \"ओम अंगारकाय नमः\" का जाप करें।", p3: "जरूरतमंदों को लाल मसूर दाल दान करें।" }
  }[lang] || { title: "Remedy for You", p1: "Offer red flowers to Lord Hanuman.", p2: "Chant \"Om Angarakaya Namaha\" 108 times.", p3: "Donate red lentils (Masoor Dal) to the needy." };
  
  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-hands-praying text-[#F26500]"></i> 
        {tx.title}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p1}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p2}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p3}</p>
        </li>
      </ul>
    </div>
  );
}

export function ThingsToAvoid() {
  const { lang } = useLanguageStore();
  const tx = {
    en: { title: "Things to Avoid", p1: "Avoid starting any major new projects today.", p2: "Do not engage in unnecessary arguments.", p3: "Avoid wearing dark colors like black or grey." },
    hi: { title: "इन चीजों से बचें", p1: "आज कोई बड़ी नई परियोजना शुरू करने से बचें।", p2: "अनावश्यक तर्कों में न पड़ें।", p3: "काले या भूरे जैसे गहरे रंग पहनने से बचें।" }
  }[lang] || { title: "Things to Avoid", p1: "Avoid starting any major new projects today.", p2: "Do not engage in unnecessary arguments.", p3: "Avoid wearing dark colors like black or grey." };

  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-triangle-exclamation text-[#F26500]"></i> 
        {tx.title}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p1}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p2}</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">{tx.p3}</p>
        </li>
      </ul>
    </div>
  );
}
