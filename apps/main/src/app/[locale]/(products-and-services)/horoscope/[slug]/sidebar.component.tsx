"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from "@repo/store";

// We mock trending articles data
const TRENDING_ARTICLES = [
  { 
    title: 'What is Your Moon Sign and Why It Matters?', 
    image: '/images/ser1.jpg', 
    content: 'Your Moon sign represents your inner self, emotions, and subconscious. It reveals how you process feelings and what you need to feel secure in life.' 
  },
  { 
    title: 'How Planetary Transits Affect Your Life?', 
    image: '/images/ser2.jpg', 
    content: 'Planetary transits influence your daily life, mood, and opportunities. Understanding them helps you navigate challenges and seize the right moments.' 
  },
  { 
    title: 'Top 5 Remedies for a Better Life', 
    image: '/images/ser3.jpg', 
    content: 'Discover simple astrological remedies like chanting mantras, wearing gemstones, and donating to charity to attract positivity and reduce obstacles.' 
  }
];

export default function ZodiacDetailsSidebar({ signData }: { signData: any }) {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const { lang } = useLanguageStore();

  const tx = {
    en: {
      zodiacDetails: "Zodiac Details", rulingPlanet: "Ruling Planet", mars: "Mars",
      element: "Element", fire: "Fire", quality: "Quality", cardinal: "Cardinal",
      symbol: "Symbol", ram: "The Ram", traits: "Traits", strengths: "Strengths",
      strengthsDesc: "Brave, Determined, Honest, Passionate", weaknesses: "Weaknesses",
      weaknessesDesc: "Impatient, Impulsive, Short-tempered", trendingArticles: "Trending Articles",
      traitsList: ['Confident', 'Energetic', 'Courageous', 'Enthusiastic', 'Leader', 'Independent']
    },
    hi: {
      zodiacDetails: "राशि विवरण", rulingPlanet: "स्वामी ग्रह", mars: "मंगल",
      element: "तत्व", fire: "अग्नि", quality: "गुण", cardinal: "चर (Cardinal)",
      symbol: "प्रतीक", ram: "मेढ़ा (The Ram)", traits: "विशेषताएं", strengths: "ताकत",
      strengthsDesc: "बहादुर, दृढ़, ईमानदार, भावुक", weaknesses: "कमजोरियां",
      weaknessesDesc: "अधीर, आवेगी, क्रोधी", trendingArticles: "लोकप्रिय लेख",
      traitsList: ['आत्मविश्वासी', 'ऊर्जावान', 'साहसी', 'उत्साही', 'नेता', 'स्वतंत्र']
    }
  }[lang] || {
      zodiacDetails: "Zodiac Details", rulingPlanet: "Ruling Planet", mars: "Mars",
      element: "Element", fire: "Fire", quality: "Quality", cardinal: "Cardinal",
      symbol: "Symbol", ram: "The Ram", traits: "Traits", strengths: "Strengths",
      strengthsDesc: "Brave, Determined, Honest, Passionate", weaknesses: "Weaknesses",
      weaknessesDesc: "Impatient, Impulsive, Short-tempered", trendingArticles: "Trending Articles",
      traitsList: ['Confident', 'Energetic', 'Courageous', 'Enthusiastic', 'Leader', 'Independent']
  };

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

  const getTranslatedArticle = (article: any) => {
    if (lang !== 'hi') return article;
    if (article.title === 'What is Your Moon Sign and Why It Matters?') {
      return { ...article, title: 'आपकी चंद्र राशि क्या है और यह क्यों मायने रखती है?', content: 'आपकी चंद्र राशि आपके आंतरिक स्वरूप, भावनाओं और अवचेतन का प्रतिनिधित्व करती है। यह बताती है कि आप भावनाओं को कैसे संसाधित करते हैं और जीवन में सुरक्षित महसूस करने के लिए आपको क्या चाहिए।' };
    }
    if (article.title === 'How Planetary Transits Affect Your Life?') {
      return { ...article, title: 'ग्रह गोचर आपके जीवन को कैसे प्रभावित करते हैं?', content: 'ग्रह गोचर आपके दैनिक जीवन, मनोदशा और अवसरों को प्रभावित करते हैं। उन्हें समझने से आपको चुनौतियों का सामना करने और सही क्षणों का लाभ उठाने में मदद मिलती है।' };
    }
    if (article.title === 'Top 5 Remedies for a Better Life') {
      return { ...article, title: 'बेहतर जीवन के लिए शीर्ष 5 उपाय', content: 'सकारात्मकता को आकर्षित करने और बाधाओं को कम करने के लिए मंत्र जाप, रत्न पहनने और दान करने जैसे सरल ज्योतिषीय उपायों की खोज करें।' };
    }
    return article;
  };

  const toggleArticle = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedArticle(expandedArticle === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      
      {/* Zodiac Details Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-star-of-life text-[#F26500]"></i> 
          {tx.zodiacDetails}
        </h3>
        
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-globe text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">{tx.rulingPlanet}</p>
              <p className="text-sm font-bold text-[#3D1A0B]">{tx.mars}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-fire text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">{tx.element}</p>
              <p className="text-sm font-bold text-[#3D1A0B]">{tx.fire}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-circle-notch text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">{tx.quality}</p>
              <p className="text-sm font-bold text-[#3D1A0B]">{tx.cardinal}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <Image src={signData.image} alt={signData.title} width={20} height={20} className="object-contain" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">{tx.symbol}</p>
              <p className="text-sm font-bold text-[#3D1A0B]">{tx.ram}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Traits Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6">
          {displayTitle} {tx.traits}
        </h3>
        
        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tx.traitsList.map(trait => (
            <span key={trait} className="bg-[#FFFDF9] border border-[#E8D5C0] text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold">
              {trait}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">{tx.strengths}</p>
          <p className="text-sm text-slate-600">{tx.strengthsDesc}</p>
        </div>

        <div>
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">{tx.weaknesses}</p>
          <p className="text-sm text-slate-600">{tx.weaknessesDesc}</p>
        </div>
      </div>

      {/* Trending Articles Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-fire text-[#F26500]"></i> 
          {tx.trendingArticles}
        </h3>
        
        <div className="space-y-4">
          {TRENDING_ARTICLES.map((baseArticle, idx) => {
            const article = getTranslatedArticle(baseArticle);
            const isExpanded = expandedArticle === idx;
            return (
            <div key={idx} className="flex flex-col gap-3">
              <div 
                className="flex gap-4 items-center group cursor-pointer no-underline"
                onClick={(e) => toggleArticle(idx, e)}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                  <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#3D1A0B] group-hover:text-[#F26500] transition-colors leading-snug m-0">
                    {article.title}
                  </p>
                  <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-xs text-slate-400 group-hover:text-[#F26500] transition-colors`}></i>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#F0E6DD] text-xs text-slate-600 leading-relaxed">
                  {article.content}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
