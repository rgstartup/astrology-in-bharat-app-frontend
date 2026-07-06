import React, { useRef } from 'react';

// Using mock data based on the design for visual completeness
const mockFestivals = [
  { name: 'Guru Purnima', date: '10 July', icon: 'fa-om', color: 'text-orange-500' },
  { name: 'Sawan Somvar', date: '14 July', icon: 'fa-hands-praying', color: 'text-blue-500' },
  { name: 'Nag Panchami', date: '25 July', icon: 'fa-staff-snake', color: 'text-green-600' },
  { name: 'Raksha Bandhan', date: '09 Aug', icon: 'fa-ribbon', color: 'text-pink-500' },
  { name: 'Janmashtami', date: '16 Aug', icon: 'fa-child-reaching', color: 'text-purple-500' },
  { name: 'Ganesh Chaturthi', date: '27 Aug', icon: 'fa-elephant', color: 'text-orange-600' },
];

export default function FestivalCarouselWidget({ lang }: { lang: string }) {
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
          {mockFestivals.map((fest, idx) => (
            <div key={idx} className="group min-w-[180px] lg:min-w-0 lg:flex-1 bg-[#fffaf5] rounded-xl border border-[#f3d3a3] p-4 shadow-sm snap-start flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 hover:border-[#e2b075] transition-all duration-300 cursor-pointer">
              <div className={`text-4xl mb-3 drop-shadow-sm ${fest.color}`}>
                <i className={`fa-solid ${fest.icon}`}></i>
              </div>
              <h4 className="text-[#5b2a26] font-bold text-sm mb-1 leading-tight h-10 flex items-center justify-center">{fest.name}</h4>
              <div className="text-xs text-gray-500 font-semibold mb-3 flex items-center gap-1">
                <i className="fa-regular fa-calendar"></i> {fest.date}
              </div>
              <div className="text-[#c85a17] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </div>
            </div>
          ))}
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
