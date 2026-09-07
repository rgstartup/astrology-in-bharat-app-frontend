import React from 'react';
import { format, isAfter, isToday, startOfDay } from 'date-fns';
import { FestivalItem } from '@/libs/api-calendar';
import Link from 'next/link';

interface Props {
  lang: string;
  festivals?: FestivalItem[];
}

export default function UpcomingFestivalsWidget({ lang, festivals = [] }: Props) {
  
  // Filter festivals that are upcoming (today or future)
  const today = startOfDay(new Date());
  
  const upcomingList = festivals
    .filter(f => {
      const fDate = new Date(f.date);
      return isAfter(fDate, today) || isToday(fDate);
    })
    .slice(0, 4); // Take next 4

  // Helper to assign colors dynamically based on index
  const getStyle = (idx: number) => {
    const styles = [
      { icon: 'fa-om', color: 'text-orange-500', bg: 'bg-orange-100' },
      { icon: 'fa-hands-praying', color: 'text-blue-500', bg: 'bg-blue-100' },
      { icon: 'fa-fan', color: 'text-pink-500', bg: 'bg-pink-100' },
      { icon: 'fa-bell', color: 'text-purple-500', bg: 'bg-purple-100' },
      { icon: 'fa-fire-flame-curved', color: 'text-red-500', bg: 'bg-red-100' },
      { icon: 'fa-sun', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    ];
    return styles[idx % styles.length];
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <i className="fa-regular fa-calendar-days text-[#c85a17] text-xl"></i>
        <h3 className="text-xl font-bold text-[#5b2a26]">
          {lang === 'hi' ? 'आने वाले त्यौहार' : 'Upcoming Festivals'}
        </h3>
      </div>

      <div className="flex-1 relative overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-orange-100"></div>
        
        <div className="flex flex-col gap-6 relative z-10 pb-4">
          {festivals.length === 0 ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skel-up-${idx}`} className="flex gap-4 items-start animate-pulse">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0"></div>
                <div className="pt-1 flex-1">
                  <div className="w-3/4 h-4 bg-orange-100 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))
          ) : upcomingList.length === 0 ? (
            <div className="text-gray-500 text-sm ml-12">No upcoming festivals found.</div>
          ) : (
            upcomingList.map((fest, idx) => {
              const style = getStyle(idx);
              const formattedDate = format(new Date(fest.date), 'dd MMMM yyyy, eeee');
              const slug = fest.name.split('(')[0].trim().replace(/\s+/g, '-').toLowerCase();

              return (
                <Link 
                  href={`/hindu-calendar/festivals/${slug}`}
                  key={idx} 
                  className="flex gap-4 items-start group cursor-pointer block no-underline" 
                  title={fest.description}
                >
                  <div className={`w-10 h-10 rounded-full ${style.bg} ${style.color} flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${style.icon}`}></i>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[#5b2a26] font-bold text-sm leading-tight group-hover:text-[#c85a17] transition-colors">{fest.name}</h4>
                    <div className="text-gray-500 text-xs mt-1">{formattedDate}</div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
