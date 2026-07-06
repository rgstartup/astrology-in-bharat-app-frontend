"use client";

import React, { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  setYear,
  setMonth,
  startOfToday,
} from "date-fns";
import {
  getMonthlyCalendar,
  getDailyPanchang,
  CalendarDay,
  PanchangData,
} from "@/libs/api-calendar";
import { useLanguageStore } from "@repo/store";

import PanchangHeroBanner from "@/components/features/calendar/PanchangHeroBanner";
import TodayPanchangWidget from "@/components/features/calendar/TodayPanchangWidget";
import CompactCalendarWidget from "@/components/features/calendar/CompactCalendarWidget";
import FestivalCarouselWidget from "@/components/features/calendar/FestivalCarouselWidget";
import AuspiciousMuhuratWidget from "@/components/features/calendar/AuspiciousMuhuratWidget";
import MoonPhaseWidget from "@/components/features/calendar/MoonPhaseWidget";
import UpcomingFestivalsWidget from "@/components/features/calendar/UpcomingFestivalsWidget";
import ZodiacHoroscopeWidget from "@/components/features/calendar/ZodiacHoroscopeWidget";
import GuidanceCTA from "@/components/ui/GuidanceCTA";

export default function HinduCalendarPage() {
  const { lang } = useLanguageStore();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [daysData, setDaysData] = useState<CalendarDay[]>([]);
  const [panchangData, setPanchangData] = useState<any | null>(null);

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
      // Format manually for the API to avoid timezone shifts
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
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
    setCurrentMonthDate(date);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] overflow-x-hidden font-sans">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-6">
        
        {/* Hero Banner Image */}
        <div className="w-full mb-8">
          <img 
            src="/images/Screenshot 2026-07-06 115425.png" 
            alt="Hindu Panchang Banner" 
            className="w-full h-auto rounded-2xl shadow-sm"
          />
        </div>

        {/* First Row: Panchang details + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          <div className="lg:col-span-8">
            <TodayPanchangWidget 
              selectedDate={selectedDate} 
              panchang={panchangData} 
              isLoading={loadingDaily} 
              lang={lang} 
            />
          </div>
          <div className="lg:col-span-4">
            <CompactCalendarWidget 
              currentMonthDate={currentMonthDate}
              daysData={daysData}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              lang={lang}
            />
          </div>
        </div>

        {/* Festival Carousel */}
        <FestivalCarouselWidget lang={lang} />

        {/* Second Row: Muhurat + Moon + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          <div className="lg:col-span-5 xl:col-span-6">
            <AuspiciousMuhuratWidget panchang={panchangData} lang={lang} />
          </div>
          <div className="lg:col-span-3 xl:col-span-3">
            <MoonPhaseWidget panchang={panchangData} lang={lang} />
          </div>
          <div className="lg:col-span-4 xl:col-span-3">
            <UpcomingFestivalsWidget lang={lang} />
          </div>
        </div>

        {/* Zodiac Horoscope (Full Width) */}
        <div className="mt-6">
          <ZodiacHoroscopeWidget horoscope={panchangData?.dailyHoroscope} lang={lang} />
        </div>

        {/* Bottom CTA Banner (DRY Component) */}
        <div className="mt-12">
          <GuidanceCTA 
            title="Want Personal Panchang Guidance?"
            description="Talk to our Astrology Experts and get accurate personal guidance."
          />
        </div>

      </div>
    </div>
  );
}
