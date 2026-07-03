"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  setYear,
  setMonth,
  startOfToday,
} from "date-fns";
import CalendarGrid from "@/components/features/calendar/CalendarGrid";
import DailyPanchangView from "@/components/features/calendar/DailyPanchangView";
import {
  getMonthlyCalendar,
  getDailyPanchang,
  getYearlyFestivals,
  CalendarDay,
  PanchangData,
  FestivalItem,
} from "@/libs/api-calendar";
import { useLanguageStore } from "@repo/store";

export default function HinduCalendarPage() {
  const { lang } = useLanguageStore();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [daysData, setDaysData] = useState<CalendarDay[]>([]);
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);

  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Fetch Month Data
  useEffect(() => {
    const fetchMonth = async () => {
      setLoadingMonth(true);
      const year = currentMonthDate.getFullYear();
      const month = currentMonthDate.getMonth() + 1; // 1-12

      const res = await getMonthlyCalendar(
        year,
        month,
        "28.6139",
        "77.2090",
        lang,
      );
      if (res.success) {
        setDaysData(res.data);
      }
      setLoadingMonth(false);
    };
    fetchMonth();
  }, [currentMonthDate, lang]);

  // Fetch Daily Data
  useEffect(() => {
    if (!selectedDate) return;
    const fetchDaily = async () => {
      setLoadingDaily(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      // Default to Delhi coords
      const res = await getDailyPanchang(dateStr, "28.6139", "77.2090", lang);
      if (res.success) {
        setPanchangData(res.data);
      } else {
        setPanchangData(null);
      }
      setLoadingDaily(false);
    };
    fetchDaily();
  }, [selectedDate, lang]);

  const handlePrevMonth = () =>
    setCurrentMonthDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () =>
    setCurrentMonthDate((prev) => addMonths(prev, 1));

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonthDate((prev) => setMonth(prev, parseInt(e.target.value)));
  };

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonthDate((prev) => setYear(prev, parseInt(e.target.value)));
  };

  const goToToday = () => {
    const today = startOfToday();
    setCurrentMonthDate(today);
    setSelectedDate(today);
  };

  const YEARS = Array.from({ length: 140 }, (_, i) => 1900 + i);
  const MONTHS_EN = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const MONTHS_HI = [
    "जनवरी",
    "फ़रवरी",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अगस्त",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर",
  ];
  const MONTHS = lang === "hi" ? MONTHS_HI : MONTHS_EN;

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#301118]"
      style={{
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Hero Header */}
      <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[300px] lg:min-h-[340px]">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-[#301118]/90 to-[#301118]/40"></div>
        <div className="absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b00]/30 blur-[100px]"></div>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white drop-shadow-lg mb-4">
            {lang === "hi"
              ? "हिन्दू पंचांग कैलेंडर"
              : "Hindu Calendar & Panchang"}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl font-medium max-w-2xl">
            {lang === "hi"
              ? "दैनिक पंचांग, शुभ मुहूर्त, राहु काल, व्रत और त्यौहारों की सटीक जानकारी प्राप्त करें।"
              : "Get accurate daily Panchang, auspicious timings, fasts, and festival details."}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto pb-24 pt-8">
        {/* Navigation & Selectors */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-black/40 backdrop-blur-md p-4 md:px-6 rounded-2xl border border-[#daa23e]/30 shadow-xl gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 hover:bg-[#ff6b00] hover:text-white transition-all font-semibold text-sm mr-2 shadow-sm"
            >
              {lang === "hi" ? "आज" : "Today"}
            </button>
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 transition flex items-center justify-center text-white"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 justify-center">
            <select
              value={currentMonthDate.getMonth()}
              onChange={handleMonthSelect}
              className="bg-black/80 border border-[#daa23e]/50 text-[#ff6b00] font-bold text-lg md:text-xl rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-[#ff6b00]/50 appearance-none cursor-pointer w-32 md:w-44 text-center hover:bg-black transition shadow-inner"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={currentMonthDate.getFullYear()}
              onChange={handleYearSelect}
              className="bg-black/80 border border-[#daa23e]/50 text-[#ff6b00] font-bold text-lg md:text-xl rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-[#ff6b00]/50 appearance-none cursor-pointer w-24 md:w-32 text-center hover:bg-black transition shadow-inner"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center mt-2 md:mt-0">
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 transition flex items-center justify-center text-white"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Layout Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left/Top: Calendar Grid */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CalendarGrid
              currentMonthDate={currentMonthDate}
              daysData={daysData}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              isLoading={loadingMonth}
            />
          </div>

          {/* Right/Bottom: Daily Panchang Detail Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <DailyPanchangView
              selectedDate={selectedDate}
              panchang={panchangData}
              isLoading={loadingDaily}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
