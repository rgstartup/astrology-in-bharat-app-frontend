import React from 'react';
import Image from 'next/image';

export function LuckyAspects() {
  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-white"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-wand-magic-sparkles text-[#F26500]"></i> 
        Lucky Aspects
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Wear something red to attract positive energy.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Meditate between 11:00 AM to 1:00 PM.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Number 9 can bring you good luck today.</p>
        </li>
      </ul>
    </div>
  );
}

export function RemedyForYou() {
  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-white"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-hands-praying text-[#F26500]"></i> 
        Remedy for You
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Offer red flowers to Lord Hanuman.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Chant "Om Angarakaya Namaha" 108 times.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Donate red lentils (Masoor Dal) to the needy.</p>
        </li>
      </ul>
    </div>
  );
}

export function ThingsToAvoid() {
  return (
    <div 
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-white"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-triangle-exclamation text-[#F26500]"></i> 
        Things to Avoid
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Avoid starting any major new projects today.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Do not engage in unnecessary arguments.</p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">Avoid wearing dark colors like black or grey.</p>
        </li>
      </ul>
    </div>
  );
}
