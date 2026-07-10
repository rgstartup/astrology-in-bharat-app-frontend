import React from 'react';

interface MoonPhaseWidgetProps {
  panchang: any;
  lang: string;
}

export default function MoonPhaseWidget({ panchang, lang }: MoonPhaseWidgetProps) {
  // Use backend data if available, otherwise use fallback mock data
  const moonPhase = panchang?.moonPhase || {
    illumination: 85,
    current: 'Waxing Moon',
    nextFullMoon: '11 June 2025'
  };

  // Calculate SVG stroke-dasharray for circular progress (circumference of circle r=58 is ~364.4)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (moonPhase.illumination / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow h-full flex flex-col justify-between items-center text-center">
      <h3 className="text-xl md:text-2xl font-bold text-[#2d110f] mb-6 font-display tracking-wide">
        {lang === 'hi' ? 'चंद्र कला' : 'Moon Phase'}
      </h3>

      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        {/* SVG Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
          <circle 
            cx="64" cy="64" r={radius} 
            fill="none" 
            stroke="#f0e6d2" 
            strokeWidth="4" 
          />
          <circle 
            cx="64" cy="64" r={radius} 
            fill="none" 
            stroke="#ff8c00" 
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Real moon image from local path */}
        <div className="w-[112px] h-[112px] rounded-full overflow-hidden relative shadow-inner">
          <img 
            src="/images/images (13).jpg" 
            alt="Moon Phase" 
            className="w-full h-full object-cover"
          />
          {/* Shadow overlay to simulate waxing/waning dynamically if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent rounded-full" 
            style={{
              opacity: (100 - moonPhase.illumination) / 100 + 0.3 // baseline shadow
            }}>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-2 mb-6">
        <div className="font-extrabold text-lg text-[#2d110f] text-left">
          {moonPhase.current}
        </div>
        <div className="h-8 w-px bg-gray-200 mx-4"></div>
        <div className="text-right flex flex-col">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Illumination</span>
          <span className="font-black text-xl text-[#2d110f] leading-none">{moonPhase.illumination}%</span>
        </div>
      </div>

      <div className="bg-[#fff8f0] rounded-xl p-4 w-full flex flex-col items-center justify-center">
        <div className="text-sm font-bold text-[#2d110f] mb-1.5">
          {lang === 'hi' ? 'अगली पूर्णिमा' : 'Next Full Moon'}
        </div>
        <div className="text-[#c85a17] font-bold text-sm flex items-center justify-center gap-2">
          <i className="fa-regular fa-calendar text-[#c85a17]"></i> {moonPhase.nextFullMoon}
        </div>
      </div>
    </div>
  );
}
