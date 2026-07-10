import React, { useRef } from 'react';
import Link from 'next/link';

interface ZodiacHoroscopeWidgetProps {
  horoscope: any[];
  lang: string;
}

// Fallback static data if api doesn't provide
const fallbackHoroscope = [
  { sign: 'Aries', color: 'Red', number: 8, icon: 'fa-star-of-david text-red-500' },
  { sign: 'Taurus', color: 'Green', number: 6, icon: 'fa-bullseye text-green-500' },
  { sign: 'Gemini', color: 'Yellow', number: 5, icon: 'fa-user-group text-yellow-500' },
  { sign: 'Cancer', color: 'White', number: 2, icon: 'fa-moon text-gray-400' },
  { sign: 'Leo', color: 'Orange', number: 1, icon: 'fa-sun text-orange-500' },
  { sign: 'Virgo', color: 'Blue', number: 7, icon: 'fa-leaf text-blue-500' },
  { sign: 'Libra', color: 'Pink', number: 6, icon: 'fa-scale-balanced text-pink-500' },
  { sign: 'Scorpio', color: 'Black', number: 9, icon: 'fa-bug text-gray-800' },
  { sign: 'Sagittarius', color: 'Purple', number: 3, icon: 'fa-bow-arrow text-purple-500' },
  { sign: 'Capricorn', color: 'Brown', number: 8, icon: 'fa-mountain text-amber-800' },
  { sign: 'Aquarius', color: 'Cyan', number: 4, icon: 'fa-water text-cyan-500' },
  { sign: 'Pisces', color: 'Sea Green', number: 7, icon: 'fa-fish text-teal-500' },
];

export default function ZodiacHoroscopeWidget({ horoscope, lang }: ZodiacHoroscopeWidgetProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const data = (horoscope && horoscope.length > 0) ? horoscope : fallbackHoroscope;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      if (direction === 'left') {
        current.scrollBy({ left: -200, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full mt-8 mb-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold text-[#5b2a26] flex items-center gap-2">
          <i className="fa-solid fa-sparkles text-[#c85a17]"></i>
          {lang === 'hi' ? 'आज का राशिफल' : 'Today\'s Horoscope by Zodiac'}
        </h3>
        <Link href="/horoscope" className="text-[#c85a17] text-sm font-semibold hover:underline">
          {lang === 'hi' ? 'सभी देखें' : 'View All'} <i className="fa-solid fa-arrow-right ml-1"></i>
        </Link>
      </div>

      <div className="relative group">
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#c85a17] opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div 
          ref={scrollRef} 
          className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.map((item, idx) => {
            const staticMatch = fallbackHoroscope.find(f => f.sign === item.sign) || fallbackHoroscope[0];
            return (
              <Link 
                href={`/horoscope/${item.sign.toLowerCase()}`}
                key={idx} 
                className="min-w-[190px] bg-white rounded-xl border-2 border-[#ff6b00] p-4 shadow-sm snap-start flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-[#ff6b00]/20 hover:bg-[#fffaf5] hover:-translate-y-1 transition-all duration-300 cursor-pointer group/card"
              >
                <div className={`text-3xl mb-3 ${staticMatch.icon}`}>
                  <i className={`fa-solid ${staticMatch.icon.split(' ')[0]}`}></i>
                </div>
                <h4 className="text-[#5b2a26] font-bold text-sm mb-3">{item.sign}</h4>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Lucky Color</div>
                <div className={`text-xs font-bold mb-2`} style={{ color: item.color.toLowerCase() === 'white' ? '#666' : item.color.toLowerCase() }}>
                  {item.color}
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Lucky Number</div>
                <div className="text-sm font-black text-slate-800 mb-3">{item.number}</div>
                
                <div className="text-[#c85a17] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-opacity mt-2">
                  Read <i className="fa-solid fa-arrow-right"></i>
                </div>
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#c85a17] opacity-0 group-hover:opacity-100 transition-opacity -mr-4"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
