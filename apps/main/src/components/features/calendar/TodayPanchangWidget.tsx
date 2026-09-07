import React from 'react';
import { format } from 'date-fns';
import { Loading } from '@repo/ui';

interface TodayPanchangWidgetProps {
  selectedDate: Date | null;
  panchang: any; // We'll type this properly based on our enriched backend API
  isLoading: boolean;
  lang: string;
}

export default function TodayPanchangWidget({ selectedDate, panchang, isLoading, lang }: TodayPanchangWidgetProps) {
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-[#fefaf6] rounded-2xl border-2 border-[#ff6b00] shadow-sm">
        <Loading size="md" text="Calculating Panchang..." />
      </div>
    );
  }

  if (!panchang) {
    return <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-500">No data available</div>;
  }

  const dateStr = selectedDate ? format(selectedDate, 'dd MMMM yyyy, EEEE') : '';

  const panchangItems = [
    { label: 'Tithi', icon: 'fa-moon', value1: panchang.tithi?.name, value2: panchang.tithi?.start ? `${panchang.tithi.start} - ${panchang.tithi.end}` : '' },
    { label: 'Nakshatra', icon: 'fa-star', value1: panchang.nakshatra?.name, value2: '' },
    { label: 'Yoga', icon: 'fa-om', value1: panchang.yoga?.name, value2: '' },
    { label: 'Karana', icon: 'fa-fire', value1: panchang.karana?.name, value2: '' },
    { label: 'Sunrise', icon: 'fa-sun', value1: panchang.sunrise || '05:33 AM', value2: '' },
    { label: 'Sunset', icon: 'fa-sun text-[#c85a17]', value1: panchang.sunset || '07:18 PM', value2: '' },
    { label: 'Moonrise', icon: 'fa-moon', value1: panchang.moonrise || '11:17 PM', value2: '' },
    { label: 'Moonset', icon: 'fa-moon text-[#c85a17]', value1: panchang.moonset || '10:45 AM', value2: '' },
    { label: 'Day Length', icon: 'fa-clock', value1: panchang.dayLength || '13 Hrs 45 Mins', value2: '' },
  ];

  return (
    <div className="bg-[#fefaf6] rounded-2xl p-6 border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow relative h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-[#f3d3a3] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <i className="fa-regular fa-calendar-check text-[#c85a17] text-2xl"></i>
            <h3 className="text-xl font-bold text-[#5b2a26]">Today's Panchang</h3>
          </div>
          <div className="text-sm font-semibold text-[#c85a17] bg-[#fbc890]/20 px-3 py-1 rounded-full">
            {dateStr}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {panchangItems.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="text-[#c85a17] mt-1"><i className={`fa-solid ${item.icon}`}></i></div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</div>
                <div className="text-sm font-bold text-[#5b2a26] leading-tight">{item.value1 || 'N/A'}</div>
                {item.value2 && <div className="text-xs text-gray-500">{item.value2}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {panchang.moonPhase && (
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Current Moon Phase</div>
            <div className="text-base font-bold text-[#5b2a26]">{panchang.moonPhase.current}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
              {/* Placeholder for moon image */}
              <div className={`w-full h-full bg-slate-800 ${panchang.moonPhase.illumination > 50 ? 'rounded-full' : 'rounded-l-full w-1/2 ml-auto'}`}></div>
            </div>
            <div className="text-xs font-semibold text-gray-500">
              Illumination: {panchang.moonPhase.illumination}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
