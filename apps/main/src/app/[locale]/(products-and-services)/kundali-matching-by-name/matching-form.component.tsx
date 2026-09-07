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
  

  return (
    <section className="pb-2 pt-2 bg-transparent">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Card container */}
        <div className="bg-white rounded-[2rem] border-2 border-orange-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible p-6 md:p-10 relative">
          
          {/* Header (Inside the Card) */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <FaUser />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800">{t.labels.name ? (lang === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Enter Birth Details') : 'Enter Birth Details'}</h2>
                <p className="text-[12px] font-medium text-slate-500">{lang === 'hi' ? 'सर्वोत्तम परिणामों के लिए दोनों भागीदारों का सटीक जन्म विवरण दर्ज करें।' : 'Enter accurate birth details for both partners to get the best results.'}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            {/* Swap Button (Floating Center) */}
            <button type="button" onClick={handleSwap} className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border-2 border-orange-500 shadow-sm items-center justify-center cursor-pointer hover:bg-orange-50 hover:scale-105 transition-all text-orange-500 ring-4 ring-white">
              <HiOutlineSwitchHorizontal className="text-lg" />
              <span className="text-[10px] absolute -bottom-[18px] font-bold text-orange-500 bg-white px-1.5 rounded-full leading-none py-0.5">Swap</span>
            </button>

            {/* Boy's Details (Person 1) */}
            <div className="rounded-2xl border-2 border-orange-500 bg-gradient-to-b from-blue-50/80 to-transparent overflow-visible">
              <div className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                  <FaUser className="text-sm" />
                </div>
                <h3 className="font-semibold text-slate-800 text-[14px] sm:text-base whitespace-nowrap sm:whitespace-normal tracking-tight sm:tracking-normal" style={fontStyle}>{t.boyTitle}</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black">{t.labels.name}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-500"
                    placeholder={t.placeholders.boyName}
                    value={boyDetails.name}
                    onChange={(e) => handleInputChange("boy", "name", e.target.value)}
                    style={fontStyle}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-black">{t.labels.date}</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-500"
                      value={boyDetails.date}
                      onChange={(e) => handleInputChange("boy", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-black">{t.labels.time}</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-500"
                      value={boyDetails.time}
                      onChange={(e) => handleInputChange("boy", "time", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black">{t.labels.place}</label>
                  <LocationAutocomplete
                    placeholder={t.placeholders.searchPlace}
                    onSelect={(val) => handleLocationSelect("boy", val)}
                    inputClassName="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Girl's Details (Person 2) */}
            <div className="rounded-2xl border-2 border-orange-500 bg-gradient-to-b from-pink-50/80 to-transparent overflow-visible">
              <div className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                  <FaUser className="text-sm" />
                </div>
                <h3 className="font-semibold text-slate-800 text-[14px] sm:text-base whitespace-nowrap sm:whitespace-normal tracking-tight sm:tracking-normal" style={fontStyle}>{t.girlTitle}</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black">{t.labels.name}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-500"
                    placeholder={t.placeholders.girlName}
                    value={girlDetails.name}
                    onChange={(e) => handleInputChange("girl", "name", e.target.value)}
                    style={fontStyle}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-black">{t.labels.date}</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-500"
                      value={girlDetails.date}
                      onChange={(e) => handleInputChange("girl", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-black">{t.labels.time}</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-500"
                      value={girlDetails.time}
                      onChange={(e) => handleInputChange("girl", "time", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black">{t.labels.place}</label>
                  <LocationAutocomplete
                    placeholder={t.placeholders.searchPlace}
                    onSelect={(val) => handleLocationSelect("girl", val)}
                    inputClassName="w-full rounded-xl border border-gray-100/70 bg-white shadow-sm px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Swap Button */}
            <div className="md:hidden flex justify-center mt-2">
              <button onClick={handleSwap} className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 text-orange-500 text-sm font-medium">
                <HiOutlineSwitchHorizontal /> {lang === 'hi' ? 'विवरण बदलें' : 'Swap Details'}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <div className="flex flex-col items-center w-full max-w-md shrink-0">
              {error && <p className="text-xs text-red-500 mb-2 font-medium">{error}</p>}
              <button
                disabled={loading}
                onClick={handleMatch}
                className="w-full bg-[#f95700] hover:bg-[#e04f00] text-white rounded-xl py-4 px-6 font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(249,87,0,0.25)]"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <HiOutlineSwitchHorizontal className="text-xl rotate-45" />}
                {lang === 'hi' ? 'कुंडली मिलाएं' : 'Match Kundlis'}
              </button>
              <p className="text-[11px] text-green-600 mt-2 flex items-center justify-center gap-1.5 font-medium w-full">
                <BsCheckCircleFill className="text-[10px]" /> {lang === 'hi' ? 'आपकी जानकारी 100% सुरक्षित और निजी है' : 'Your information is 100% secure & private'}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default MatchingForm;
