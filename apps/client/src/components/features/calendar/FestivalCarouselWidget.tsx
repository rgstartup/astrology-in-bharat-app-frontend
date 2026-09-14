import React, { useRef } from 'react';
import { format } from 'date-fns';
import { FestivalItem } from '@/libs/api-calendar';
import Link from 'next/link';

interface Props {
  lang: string;
  festivals?: FestivalItem[];
}

export default function FestivalCarouselWidget({ lang, festivals = [] }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      if (direction === 'left') {
        current.scrollBy({ left: -300, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  };

  const getStyle = (idx: number) => {
    const styles = [
      { icon: 'fa-om', color: 'text-orange-500' },
      { icon: 'fa-hands-praying', color: 'text-blue-500' },
      { icon: 'fa-staff-snake', color: 'text-green-600' },
      { icon: 'fa-ribbon', color: 'text-pink-500' },
      { icon: 'fa-child-reaching', color: 'text-purple-500' },
      { icon: 'fa-bell', color: 'text-red-500' },
    ];
    return styles[idx % styles.length];
  };

  // Filter out minor observances to keep the carousel clean
  const displayFestivals = festivals
    .filter(f => {
      const name = f.name.toLowerCase();
      // Exclude common fasting days and parana times unless you want them
      return !name.includes('parana') && 
             !name.includes('pradosh') &&
             !name.includes('sankashti') &&
             !name.includes('vinayaka chaturthi');
    })
    .slice(0, 30); // Limit to a reasonable number if still too many

  return (
    <div className="w-full mt-8 mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold text-[#5b2a26] flex items-center gap-2">
          <i className="fa-solid fa-dharmachakra text-[#c85a17]"></i>
          {lang === 'hi' ? 'त्यौहार' : 'Festivals'}
        </h3>
        <button className="text-[#c85a17] text-sm font-semibold hover:underline">
          {lang === 'hi' ? 'सभी देखें' : 'View All'} <i className="fa-solid fa-arrow-right ml-1"></i>
        </button>
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
          className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {festivals.length === 0 ? (
            // Skeleton Loading State
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={`skel-${idx}`} className="min-w-[160px] md:min-w-[180px] flex-shrink-0 bg-[#fffaf5] rounded-xl border-2 border-orange-100 p-4 shadow-sm flex flex-col items-center justify-center animate-pulse">
                <div className="w-12 h-12 bg-orange-200 rounded-full mb-3"></div>
                <div className="w-24 h-4 bg-orange-200 rounded mb-4"></div>
                <div className="w-16 h-3 bg-gray-200 rounded mb-4"></div>
                <div className="w-20 h-3 bg-orange-100 rounded"></div>
              </div>
            ))
          ) : (
            displayFestivals.map((fest, idx) => {
              const style = getStyle(idx);
            const formattedDate = format(new Date(fest.date), 'dd MMM');
            // Remove brackets and extra spaces for URL slug
            const slug = fest.name.split('(')[0].trim().replace(/\s+/g, '-').toLowerCase();
            
            return (
              <Link
                key={idx} 
                href={`/hindu-calendar/festivals/${slug}`}
                className="group min-w-[160px] md:min-w-[180px] flex-shrink-0 bg-[#fffaf5] rounded-xl border-2 border-[#ff6b00] p-4 shadow-sm snap-start flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 hover:shadow-[#ff6b00]/20 transition-all duration-300 cursor-pointer block no-underline" 
                title={fest.description}
              >
                <div className={`text-4xl mb-3 drop-shadow-sm ${style.color}`}>
                  <i className={`fa-solid ${style.icon}`}></i>
                </div>
                <h4 className="text-[#5b2a26] font-bold text-sm mb-1 leading-tight h-10 flex items-center justify-center">{fest.name}</h4>
                <div className="text-xs text-gray-500 font-semibold mb-3 flex items-center gap-1">
                  <i className="fa-regular fa-calendar"></i> {formattedDate}
                </div>
                <div className="text-[#c85a17] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Details <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </div>
              </Link>
            );
          })
        )}
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
