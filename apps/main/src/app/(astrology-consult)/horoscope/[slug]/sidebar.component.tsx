"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

  const toggleArticle = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedArticle(expandedArticle === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      
      {/* Zodiac Details Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-white"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-star-of-life text-[#F26500]"></i> 
          Zodiac Details
        </h3>
        
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-globe text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Ruling Planet</p>
              <p className="text-sm font-bold text-[#3D1A0B]">Mars</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-fire text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Element</p>
              <p className="text-sm font-bold text-[#3D1A0B]">Fire</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-circle-notch text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Quality</p>
              <p className="text-sm font-bold text-[#3D1A0B]">Cardinal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <Image src={signData.image} alt={signData.title} width={20} height={20} className="object-contain" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Symbol</p>
              <p className="text-sm font-bold text-[#3D1A0B]">The Ram</p>
            </div>
          </div>
        </div>
      </div>

      {/* Traits Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-white"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6">
          {signData.title} Traits
        </h3>
        
        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Confident', 'Energetic', 'Courageous', 'Enthusiastic', 'Leader', 'Independent'].map(trait => (
            <span key={trait} className="bg-white border border-[#E8D5C0] text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold">
              {trait}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">Strengths</p>
          <p className="text-sm text-slate-600">Brave, Determined, Honest, Passionate</p>
        </div>

        <div>
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">Weaknesses</p>
          <p className="text-sm text-slate-600">Impatient, Impulsive, Short-tempered</p>
        </div>
      </div>

      {/* Trending Articles Card */}
      <div 
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-white"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-fire text-[#F26500]"></i> 
          Trending Articles
        </h3>
        
        <div className="space-y-4">
          {TRENDING_ARTICLES.map((article, idx) => {
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
