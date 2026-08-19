"use client";

import React from "react";
import { format } from "date-fns";
import { PanchangData } from "@/libs/api-calendar";

interface DailyPanchangViewProps {
  selectedDate: Date | null;
  panchang: PanchangData | null;
  isLoading: boolean;
}

export default function DailyPanchangView({
  selectedDate,
  panchang,
  isLoading
}: DailyPanchangViewProps) {
  if (!selectedDate) {
    return (
      <div className="bg-[#3a1520]/80 h-full backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center text-center">
        <i className="fa-solid fa-calendar-star text-4xl text-[#ff6b00] mb-4 opacity-70"></i>
        <h3 className="text-xl font-bold text-white mb-2">Panchang Details</h3>
        <p className="text-gray-400 max-w-xs">Select a date from the calendar to view its detailed Tithi, Nakshatra, and Muhurat information.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#3a1520]/80 h-full backdrop-blur-xl rounded-2xl border border-[#daa23e]/20 shadow-2xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-white/5 rounded w-3/4 mx-auto"></div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!panchang) {
    return (
      <div className="bg-[#3a1520]/80 h-full backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center text-center">
        <i className="fa-solid fa-circle-exclamation text-4xl text-gray-500 mb-4 opacity-70"></i>
        <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
        <p className="text-gray-400 max-w-xs">Could not load the Panchang details for {format(selectedDate, "dd MMMM yyyy")}.</p>
      </div>
    );
  }

  // Helper to render a data card
  const DataCard = ({ icon, title, value, time }: { icon: string, title: string, value: string, time?: string }) => (
    <div className="bg-black/30 border border-white/5 rounded-xl p-4 hover:bg-black/50 transition-colors border-l-4 border-l-[#ff6b00]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00]">
          <i className={icon}></i>
        </div>
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{title}</h4>
      </div>
      <p className="text-lg font-bold text-white mb-1 leading-tight">{value}</p>
      {time && <p className="text-xs font-medium text-[#daa23e]"><i className="fa-regular fa-clock mr-1"></i> {time}</p>}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#3a1520]/90 to-[#2a0f16]/95 h-full backdrop-blur-2xl rounded-2xl border border-[#daa23e]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <div className="text-center mb-8 border-b border-white/10 pb-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/20 blur-3xl rounded-full z-0"></div>
        <h2 className="text-3xl font-display font-black text-white mb-2 relative z-10">
          {format(selectedDate, "dd MMMM yyyy")}
        </h2>
        <p className="text-[#daa23e] font-semibold text-lg relative z-10 flex items-center justify-center gap-2">
          {format(selectedDate, "EEEE")}
        </p>
      </div>

      {/* Sun/Moon Card directly spanning top */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black/40 rounded-xl p-4 mb-6 border border-white/5">
         <div className="flex flex-col items-center justify-center text-center p-2 border-r border-white/10">
            <i className="fa-solid fa-sun text-yellow-400 text-xl mb-1 drop-shadow-md"></i>
            <span className="text-xs text-gray-400 font-bold uppercase">Sunrise</span>
            <span className="text-sm text-white font-semibold">{panchang.sunrise || "-"}</span>
         </div>
         <div className="flex flex-col items-center justify-center text-center p-2 border-r border-white/10">
            <i className="fa-solid fa-cloud-sun text-orange-400 text-xl mb-1 drop-shadow-md"></i>
            <span className="text-xs text-gray-400 font-bold uppercase">Sunset</span>
            <span className="text-sm text-white font-semibold">{panchang.sunset || "-"}</span>
         </div>
         <div className="flex flex-col items-center justify-center text-center p-2 col-span-2 md:col-span-1">
            <i className="fa-solid fa-moon text-blue-300 text-xl mb-1 drop-shadow-md"></i>
            <span className="text-xs text-gray-400 font-bold uppercase">Moonrise</span>
            <span className="text-sm text-white font-semibold">{panchang.moonrise || "-"}</span>
         </div>
      </div>

      {/* Grid Data */}
      <div className="grid border border-white/5 bg-black/20 rounded-xl p-4 grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <DataCard 
          icon="fa-regular fa-moon" 
          title="Tithi" 
          value={panchang.tithi?.name || "N/A"} 
          time={panchang.tithi?.start ? `${panchang.tithi.start} to ${panchang.tithi.end}` : ""}
        />
        <DataCard 
          icon="fa-solid fa-star" 
          title="Nakshatra" 
          value={panchang.nakshatra?.name || "N/A"} 
          time={panchang.nakshatra?.start ? `${panchang.nakshatra.start} to ${panchang.nakshatra.end}` : ""}
        />
        <DataCard 
          icon="fa-solid fa-shapes" 
          title="Yoga" 
          value={panchang.yoga?.name || "N/A"} 
        />
        <DataCard 
          icon="fa-solid fa-circle-notch" 
          title="Karana" 
          value={panchang.karana?.name || "N/A"} 
        />
      </div>

      {/* Muhurats */}
      <div className="mt-6 space-y-4">
         {/* Shubh */}
         <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2">
               <i className="fa-solid fa-check-circle"></i> Auspicious Timings
            </h4>
            <div className="flex justify-between items-center text-sm">
               <span className="text-gray-300 font-medium">Abhijit Muhurat</span>
               <span className="text-emerald-200 font-semibold">{panchang.shubhMuhurat?.abhijit?.start || "N/A"} - {panchang.shubhMuhurat?.abhijit?.end || "N/A"}</span>
            </div>
         </div>
         
         {/* Ashubh */}
         <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2">
               <i className="fa-solid fa-triangle-exclamation"></i> Inauspicious Timings
            </h4>
            <div className="flex justify-between items-center text-sm border-b border-red-500/10 pb-2 mb-2">
               <span className="text-gray-300 font-medium">Rahu Kalam</span>
               <span className="text-red-200 font-semibold">{panchang.ashubhMuhurat?.rahuKalam?.start || "N/A"} - {panchang.ashubhMuhurat?.rahuKalam?.end || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
               <span className="text-gray-300 font-medium">Yamaganda</span>
               <span className="text-red-200 font-semibold">{panchang.ashubhMuhurat?.yamaganda?.start || "N/A"} - {panchang.ashubhMuhurat?.yamaganda?.end || "N/A"}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
