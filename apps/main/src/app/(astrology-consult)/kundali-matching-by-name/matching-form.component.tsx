"use client";

import React, { useState } from "react";
import { FaUser, FaSpinner } from "react-icons/fa";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BsCheckCircleFill } from "react-icons/bs";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import { useLanguageStore } from "@repo/store";
import { matchingTranslations } from "@/lib/translations/calculators/matching";

import { MatchFormProps } from "@/lib/types";

const MatchingForm = ({
  boyDetails,
  girlDetails,
  handleInputChange,
  handleLocationSelect,
  handleMatch,
  handleSwap,
  loading,
  error,
}: MatchFormProps) => {
  const { lang } = useLanguageStore();
  const t = (matchingTranslations[lang as keyof typeof matchingTranslations] || matchingTranslations.en).form;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};
  
  const [matchingType, setMatchingType] = useState("ashtakoot");

  return (
    <section className="py-8 bg-transparent">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Card container */}
        <div className="bg-white rounded-[2rem] border border-orange-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 md:p-10 relative">
          
          {/* Header (Inside the Card) */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <FaUser />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800">Enter Birth Details</h2>
                <p className="text-[12px] font-medium text-slate-500">Enter accurate birth details for both partners to get the best results.</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            {/* Swap Button (Floating Center) */}
            <button type="button" onClick={handleSwap} className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-orange-100 shadow-sm items-center justify-center cursor-pointer hover:bg-orange-50 hover:scale-105 transition-all text-orange-500">
              <HiOutlineSwitchHorizontal className="text-lg" />
              <span className="text-[10px] absolute -bottom-5 font-bold text-[#f95700]">Swap</span>
            </button>

            {/* Boy's Details (Person 1) */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-transparent overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                  <FaUser className="text-sm" />
                </div>
                <h3 className="font-semibold text-slate-800" style={fontStyle}>Person 1 (You / Male)</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">{t.labels.name}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder={t.placeholders.boyName}
                    value={boyDetails.name}
                    onChange={(e) => handleInputChange("boy", "name", e.target.value)}
                    style={fontStyle}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">{t.labels.date}</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                      value={boyDetails.date}
                      onChange={(e) => handleInputChange("boy", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">{t.labels.time}</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                      value={boyDetails.time}
                      onChange={(e) => handleInputChange("boy", "time", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">{t.labels.place}</label>
                  <LocationAutocomplete
                    placeholder={t.placeholders.searchPlace}
                    onSelect={(val) => handleLocationSelect("boy", val)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="boy-unknown-time" className="rounded text-blue-500 focus:ring-blue-500 border-gray-300" />
                  <label htmlFor="boy-unknown-time" className="text-sm text-slate-500 cursor-pointer">I don't know the exact time</label>
                </div>
              </div>
            </div>

            {/* Girl's Details (Person 2) */}
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-b from-pink-50/80 to-transparent overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                  <FaUser className="text-sm" />
                </div>
                <h3 className="font-semibold text-slate-800" style={fontStyle}>Person 2 (Partner / Female)</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">{t.labels.name}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                    placeholder={t.placeholders.girlName}
                    value={girlDetails.name}
                    onChange={(e) => handleInputChange("girl", "name", e.target.value)}
                    style={fontStyle}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">{t.labels.date}</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                      value={girlDetails.date}
                      onChange={(e) => handleInputChange("girl", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">{t.labels.time}</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                      value={girlDetails.time}
                      onChange={(e) => handleInputChange("girl", "time", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">{t.labels.place}</label>
                  <LocationAutocomplete
                    placeholder={t.placeholders.searchPlace}
                    onSelect={(val) => handleLocationSelect("girl", val)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="girl-unknown-time" className="rounded text-pink-500 focus:ring-pink-500 border-gray-300" />
                  <label htmlFor="girl-unknown-time" className="text-sm text-slate-500 cursor-pointer">I don't know the exact time</label>
                </div>
              </div>
            </div>
            
            {/* Mobile Swap Button */}
            <div className="md:hidden flex justify-center mt-2">
              <button onClick={handleSwap} className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 text-orange-500 text-sm font-medium">
                <HiOutlineSwitchHorizontal /> Swap Details
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                Matching Type <span className="text-gray-400 font-normal text-xs bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center">i</span>
              </h4>
              <div className="flex flex-wrap gap-3">
                <div 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${matchingType === 'ashtakoot' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMatchingType('ashtakoot')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${matchingType === 'ashtakoot' ? 'border-orange-500' : 'border-gray-300'}`}>
                    {matchingType === 'ashtakoot' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Ashtakoot Milan</p>
                    <p className="text-[10px] text-slate-500">36 Gun Milan</p>
                  </div>
                </div>

                <div 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${matchingType === 'panch' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMatchingType('panch')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${matchingType === 'panch' ? 'border-orange-500' : 'border-gray-300'}`}>
                    {matchingType === 'panch' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Panch Milan</p>
                    <p className="text-[10px] text-slate-500">5 Gun Milan</p>
                  </div>
                </div>

                <div 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${matchingType === 'basic' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMatchingType('basic')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${matchingType === 'basic' ? 'border-orange-500' : 'border-gray-300'}`}>
                    {matchingType === 'basic' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Basic Milan</p>
                    <p className="text-[10px] text-slate-500">Quick Match</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:w-[48%] shrink-0">
              {error && <p className="text-xs text-red-500 mb-2 font-medium">{error}</p>}
              <button
                disabled={loading}
                onClick={handleMatch}
                className="w-full bg-[#f95700] hover:bg-[#e04f00] text-white rounded-xl py-4 px-6 font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(249,87,0,0.25)]"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <HiOutlineSwitchHorizontal className="text-xl rotate-45" />}
                Match Kundlis
              </button>
              <p className="text-[11px] text-green-600 mt-2 flex items-center justify-center gap-1.5 font-medium w-full">
                <BsCheckCircleFill className="text-[10px]" /> Your information is 100% secure & private
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default MatchingForm;
