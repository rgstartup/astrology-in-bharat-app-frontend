"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaArrowRight,
  FaSpinner,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { ZodiacSign, SIGNS, elementBySign } from "./useLuckyVibes";
import { LuckyVibesFormProps } from "@/lib/types/calculator";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";

const LuckyVibesForm: React.FC<LuckyVibesFormProps> = ({
  fullName,
  dob,
  zodiac,
  loading,
  canCalculate,
  setFullName,
  setDob,
  setZodiac,
  handleCalculate,
}) => {
  const { lang } = useLanguageStore();
  const translationSet = (homeTranslations[lang as "en" | "hi"] || homeTranslations.en) as any;
  const t = translationSet.calculators.luckyVibes;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleCalculate} className="w-full">
      <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-[#301118]/5 relative overflow-hidden bg-white space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
              {t.form.nameLabel}
            </label>
            <input
              type="text"
              required
              style={{ borderRadius: "9999px" }}
              className="w-full mt-2 bg-white border-2 border-orange-500 px-5 py-3.5 text-[#301118] font-bold focus:border-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400 shadow-sm text-sm"
              placeholder={t.form.namePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
              {t.form.dobLabel}
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                required
                style={{ borderRadius: "9999px" }}
                className="w-full bg-white border-2 border-orange-500 pl-5 pr-12 py-3.5 text-[#301118] font-bold focus:border-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:p-0"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none">
                <FaCalendarAlt size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-50" ref={dropdownRef}>
          <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
            {t.form.zodiacLabel}
          </label>
          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ borderRadius: "9999px", ...fontStyle }}
              className="w-full bg-white border-2 border-orange-500 px-5 py-3.5 text-[#301118] font-black focus:border-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm text-sm flex items-center justify-between"
            >
              <span>{t.dynamic.zodiac[zodiac] || zodiac}</span>
              <FaChevronDown className={`text-orange-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full mt-2 rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden z-50 bg-white">
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "url('/images/back-image.webp')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <ul className="max-h-60 overflow-y-auto relative z-10 p-2 space-y-1">
                  {SIGNS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => {
                          setZodiac(s as ZodiacSign);
                          setIsDropdownOpen(false);
                        }}
                        style={{ borderRadius: "9999px", ...fontStyle }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-all ${
                          zodiac === s 
                            ? 'bg-orange-500 text-white shadow-md' 
                            : 'text-[#301118] hover:bg-orange-100/80 hover:text-orange-700'
                        }`}
                      >
                        {t.dynamic.zodiac[s] || s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="m-0 mt-3 pl-1 text-xs text-gray-500 italic" style={fontStyle}>
            {t.form.elementLabel}: <span className="font-black text-orange-600">{t.dynamic.elements[elementBySign(zodiac)] || elementBySign(zodiac)}</span>
          </p>
        </div>

        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={loading || !canCalculate}
            style={{ borderRadius: "9999px" }}
            className="relative group inline-flex items-center justify-center gap-2 md:gap-3 bg-orange-600 text-white w-full md:w-auto px-4 py-4 md:px-12 md:py-4 font-black uppercase tracking-[1px] md:tracking-[2px] text-[10px] sm:text-xs hover:bg-orange-700 transition-all duration-500 shadow-xl disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-orange-600 cursor-pointer"
          >
            {loading ? <FaSpinner className="animate-spin shrink-0" /> : <TbCrystalBall size={18} className="shrink-0" />}
            <span style={fontStyle} className="text-center">
              {loading ? t.form.btnGenerating : t.form.btnCalculate}
            </span>
            <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="w-full h-2 bg-orange-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
      </div>
    </form>
  );
};

export default LuckyVibesForm;
