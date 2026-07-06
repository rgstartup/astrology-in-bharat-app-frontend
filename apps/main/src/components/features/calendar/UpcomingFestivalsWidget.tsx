import React from 'react';

const upcomingFestivals = [
  { name: 'Raksha Bandhan', date: '09 August 2025, Saturday', icon: 'fa-ribbon', color: 'text-pink-500', bg: 'bg-pink-100' },
  { name: 'Janmashtami', date: '16 August 2025, Saturday', icon: 'fa-child-reaching', color: 'text-purple-500', bg: 'bg-purple-100' },
  { name: 'Ganesh Chaturthi', date: '27 August 2025, Wednesday', icon: 'fa-elephant', color: 'text-orange-600', bg: 'bg-orange-100' },
  { name: 'Navratri Starts', date: '22 September 2025, Monday', icon: 'fa-om', color: 'text-red-500', bg: 'bg-red-100' },
];

export default function UpcomingFestivalsWidget({ lang }: { lang: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
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
          {upcomingFestivals.map((fest, idx) => (
            <div key={idx} className="flex gap-4 items-start group cursor-pointer">
              <div className={`w-10 h-10 rounded-full ${fest.bg} ${fest.color} flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${fest.icon}`}></i>
              </div>
              <div className="pt-1">
                <h4 className="text-[#5b2a26] font-bold text-sm leading-tight group-hover:text-[#c85a17] transition-colors">{fest.name}</h4>
                <div className="text-gray-500 text-xs mt-1">{fest.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-6 text-center w-full text-[#c85a17] text-sm font-bold hover:underline py-2 flex-shrink-0">
        {lang === 'hi' ? 'पूरा कैलेंडर देखें' : 'View Full Calendar'} <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
      </button>
    </div>
  );
}
