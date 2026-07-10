import React from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { CalendarDay } from '@/libs/api-calendar';

interface CompactCalendarWidgetProps {
  currentMonthDate: Date;
  daysData: CalendarDay[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  lang: string;
}

export default function CompactCalendarWidget({ 
  currentMonthDate, 
  daysData, 
  selectedDate, 
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  lang 
}: CompactCalendarWidgetProps) {

  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const startDay = getDay(monthStart); 
  
  const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const getDayData = (date: Date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    return daysData.find((d) => d.date === dStr);
  };

  const isFestival = (date: Date) => {
    const data = getDayData(date);
    return data && data.festivals && data.festivals.length > 0;
  };

  // Mocking Ekadashi and Amavasya for visual demonstration
  const isEkadashi = (date: Date) => parseInt(format(date, 'd')) === 13 || parseInt(format(date, 'd')) === 27;
  const isAmavasya = (date: Date) => parseInt(format(date, 'd')) === 20;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400 transition-colors">
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <h3 className="text-lg font-bold text-[#5b2a26]">
          {format(currentMonthDate, 'MMMM yyyy')}
        </h3>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400 transition-colors">
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-7 gap-y-4 mb-2">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className={`text-center text-xs font-bold ${i === 0 ? 'text-[#ff6b00]' : 'text-gray-500'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10 mx-auto"></div>
          ))}
          {daysInMonth.map((date) => {
            const isSel = selectedDate && isSameDay(date, selectedDate);
            const isTod = isToday(date);
            const fest = isFestival(date);
            const eka = isEkadashi(date);
            const ama = isAmavasya(date);

            return (
              <div key={date.toString()} className="w-10 h-10 mx-auto relative flex items-center justify-center">
                <button
                  onClick={() => onSelectDate(date)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isSel ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30' : 
                    isTod ? 'bg-gray-100 text-[#5b2a26] border border-gray-200' : 
                    'text-[#5b2a26] hover:bg-[#fef5e7]'
                  }`}
                >
                  {format(date, 'd')}
                </button>
                
                {/* Dots indicator container */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {fest && !isSel && <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></div>}
                  {eka && !isSel && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                  {ama && !isSel && <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ff6b00]"></div> Festival</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ekadashi</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-800"></div> Amavasya</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-gray-200"></div> Today</div>
      </div>
    </div>
  );
}
