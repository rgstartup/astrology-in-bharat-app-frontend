"use client";

import React from "react";
import { format, isSameMonth, isSameDay, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { CalendarDay } from "@/libs/api-calendar";

interface CalendarGridProps {
  currentMonthDate: Date;
  daysData: CalendarDay[];
  selectedDate: Date | null;
  onSelectDate: (date: Date, dayData?: CalendarDay) => void;
  isLoading: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  currentMonthDate,
  daysData,
  selectedDate,
  onSelectDate,
  isLoading
}: CalendarGridProps) {
  
  // Create a skeleton map for days
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);
  const startOffset = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  
  // Real calendar grid logic
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create blank cells before the 1st of the month
  const blanks = Array.from({ length: startOffset }).map((_, i) => (
    <div key={`blank-${i}`} className="h-28 border border-white/5 opacity-0 pointer-events-none"></div>
  ));

  if (isLoading) {
    return (
      <div className="w-full bg-[#3a1520]/80 backdrop-blur-md rounded-2xl border border-[#daa23e]/30 shadow-2xl p-6">
        <div className="grid grid-cols-7 gap-1">
           {WEEKDAYS.map(day => (
             <div key={day} className="text-center font-bold text-orange py-2 text-sm">{day}</div>
           ))}
           {Array.from({length: 35}).map((_, i) => (
             <div key={i} className="h-28 bg-white/5 animate-pulse rounded-lg border border-white/10 m-1"></div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#3a1520]/80 backdrop-blur-xl rounded-2xl border border-[#daa23e]/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-4 md:p-6">
      
      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center font-extrabold text-[#ff6b00] py-2 text-sm uppercase tracking-wider bg-black/20 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {blanks}
        
        {daysInMonth.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          // Find matching data from API response
          const apiDay = daysData.find(d => d.date === dateStr);
          const hasFestival = apiDay && apiDay.festivals && apiDay.festivals.length > 0;
          
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(date, apiDay)}
              className={`
                relative h-24 md:h-28 w-full flex flex-col items-start justify-start p-2 rounded-xl border transition-all duration-300 overflow-hidden group
                ${isSelected 
                  ? "bg-gradient-to-br from-[#ff6b00] to-[#d65900] border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.5)] scale-[1.02] text-white z-10" 
                  : hasFestival 
                    ? "bg-gradient-to-b from-[#ff6b00]/20 to-[#daa23e]/10 border-[#daa23e]/50 text-white hover:bg-[#ff6b00]/30 hover:border-[#ff6b00] shadow-inner"
                    : "bg-black/30 border-white/10 text-gray-200 hover:bg-black/50 hover:border-[#ff6b00]/50"
                }
              `}
            >
              <div className="flex w-full justify-between items-start mb-1">
                <span className={`
                  text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday && !isSelected ? "bg-white text-black" : ""}
                  ${isSelected ? "text-white" : "text-gray-300"}
                `}>
                  {format(date, "d")}
                </span>
                
                {hasFestival && (
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse"></span>
                )}
              </div>
              
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden text-left hide-scrollbars mt-1 space-y-1">
                 {apiDay?.festivals?.map((fest, idx) => (
                   <div 
                     key={idx} 
                     className={`text-[10px] md:text-[11px] leading-tight font-semibold truncate px-1.5 py-0.5 rounded
                       ${isSelected ? "bg-white/20 text-white" : "bg-[#daa23e]/20 text-[#daa23e] group-hover:bg-[#daa23e]/30"}
                     `}
                     title={fest}
                   >
                     {fest}
                   </div>
                 ))}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-end gap-6 border-t border-white/10 pt-4 px-2">
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]"></span>
            <span className="text-xs text-gray-300 font-medium">Fast / Festival</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[10px] font-bold text-black border-dashed">T</span>
            <span className="text-xs text-gray-300 font-medium">Today</span>
         </div>
      </div>
    </div>
  );
}
