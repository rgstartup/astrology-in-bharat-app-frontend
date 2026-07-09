"use client";
import React, { useState } from 'react';

// Reusable 5-star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <i 
          key={star} 
          className={`fa-star text-sm ${star <= rating ? 'fa-solid text-[#F26500]' : 'fa-regular text-gray-300'}`}
        ></i>
      ))}
    </div>
  );
};

export default function PredictionList({ horoscope }: { horoscope: any }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!horoscope || !horoscope.predictions) return null;

  const getIconData = (type: string) => {
    switch(type.toLowerCase()) {
      case 'love': return { icon: 'fa-regular fa-heart', bg: 'bg-[#FDEFE6]', color: 'text-[#E63946]' };
      case 'career': return { icon: 'fa-solid fa-briefcase', bg: 'bg-[#FDF6E3]', color: 'text-[#8B5A2B]' };
      case 'money': return { icon: 'fa-solid fa-wallet', bg: 'bg-[#FDF6E3]', color: 'text-[#8B5A2B]' };
      case 'health': return { icon: 'fa-solid fa-heart-pulse', bg: 'bg-[#EAF5EC]', color: 'text-[#2D6A4F]' };
      case 'education': return { icon: 'fa-solid fa-book-open', bg: 'bg-[#FDEFE6]', color: 'text-[#D97706]' };
      default: return { icon: 'fa-regular fa-star', bg: 'bg-[#242424]', color: 'text-gray-500' };
    }
  };

  // Mocking ratings for the UI showcase
  const mockRatings: Record<string, number> = {
    'love': 4,
    'career': 4,
    'money': 3,
    'health': 4,
    'education': 4
  };

  const toggleRow = (idx: number) => {
    if (expandedRow === idx) {
      setExpandedRow(null);
    } else {
      setExpandedRow(idx);
    }
  };

  return (
    <div 
      className="rounded-[32px] px-6 pb-8 pt-7 md:px-10 md:pb-10 md:pt-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9] w-full"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[22px] md:text-2xl font-bold text-[#3D1A0B] flex items-center gap-3">
          <i className="fa-solid fa-sun text-[#F26500]"></i> 
          Today's Overview 
          <span className="text-[#E8D5C0] ml-2">←</span>
        </h3>
      </div>

      {/* Main Overview Paragraph */}
      <p className="text-slate-600 text-[15px] md:text-base leading-relaxed mb-8">
        The day brings a mix of opportunities and challenges. Your confidence will be your greatest asset. 
        Stay focused on your goals and avoid distractions. Positive changes are on the way.
      </p>

      {/* Cards List as continuous rows with dividers */}
      <div className="flex flex-col divide-y divide-[#F0E6DD] border-t border-[#F0E6DD]">
        {horoscope.predictions.map((p: any, idx: number) => {
          const iconData = getIconData(p.type);
          const rating = mockRatings[p.type.toLowerCase()] || 4;
          const isExpanded = expandedRow === idx;

          return (
            <div key={idx} className="py-5 md:py-6 flex flex-col gap-3 transition-all">
              
              {/* Row Header (Always visible) */}
              <div 
                className="flex items-center justify-between gap-4 cursor-pointer group"
                onClick={() => toggleRow(idx)}
              >
                <div className="flex items-center gap-5 flex-1">
                  {/* Left Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${iconData.bg} flex items-center justify-center shrink-0`}>
                    <i className={`${iconData.icon} ${iconData.color} text-xl md:text-2xl`}></i>
                  </div>
                  
                  {/* Middle Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-[#3D1A0B] text-base md:text-[17px] mb-1">{p.type}</h4>
                    {/* One line snippet if collapsed, hidden if expanded so it doesn't duplicate */}
                    {!isExpanded && (
                      <p className="text-slate-600 text-[14.5px] md:text-[15px] line-clamp-1 pr-4 leading-relaxed">
                        {p.prediction}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Rating & Dropdown */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden md:block">
                    <StarRating rating={rating} />
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 group-hover:text-[#F26500] transition-colors">
                    <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-sm md:text-base`}></i>
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="pt-3 pb-2 pl-0 md:pl-[76px]">
                  <div className="md:hidden mb-4 ml-1">
                    <StarRating rating={rating} />
                  </div>
                  <p className="text-slate-600 text-[15px] md:text-base leading-[1.8] bg-[#FAF8F5] p-5 md:p-6 rounded-2xl border border-[#F0E6DD]">
                    {p.prediction}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
