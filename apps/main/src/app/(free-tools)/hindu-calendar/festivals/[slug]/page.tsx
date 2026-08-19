"use client";

import React, { useState, useEffect, use } from 'react';
import { getFestivalDetails, getYearlyFestivals, FestivalItem } from '@/libs/api-calendar';
import { useLanguageStore } from '@repo/store';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';

export default function FestivalDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const { lang } = useLanguageStore();
  const [data, setData] = useState<any>(null);
  const [festivalDateItem, setFestivalDateItem] = useState<FestivalItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Convert slug back to approximate name (e.g., makar-sankranti -> Makar Sankranti)
  const festivalName = unwrappedParams.slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Fallback beautiful AI-generated images for Hindu festivals
  const fallbackImages = [
    '/images/festivals/fallback-1.jpg', // Diyas
    '/images/festivals/fallback-2.jpg', // Temple
    '/images/festivals/fallback-3.jpg'  // Puja Thali
  ];
  const randomFallback = fallbackImages[festivalName.length % fallbackImages.length];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Fetch Wiki Details
        const res = await getFestivalDetails(festivalName, lang);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setData({ extract: 'Information will be updated soon.' }); // Fallback if wiki fails
        }

        // Fetch exact date from our calendar API
        const currentYear = new Date().getFullYear();
        const festRes = await getYearlyFestivals(currentYear, lang);
        if (festRes.success && festRes.data) {
          // Find matching festival by name
          const matched = festRes.data.find((f: any) => 
            f.name.toLowerCase().includes(festivalName.toLowerCase()) || 
            festivalName.toLowerCase().includes(f.name.toLowerCase().split('(')[0].trim())
          );
          if (matched) setFestivalDateItem(matched);
        }

      } catch (e) {
        setData({ extract: 'Information will be updated soon.' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [festivalName, lang]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] pt-8 pb-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500 flex items-center gap-2 font-sans">
          <Link href="/hindu-calendar" className="hover:text-[#c85a17] transition-colors font-medium">
            <i className="fa-solid fa-home"></i> Hindu Calendar
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-[#c85a17] font-bold">{festivalName}</span>
        </div>

        {loading ? (
          <div className="bg-white rounded shadow-sm border border-gray-200 p-20 flex flex-col items-center justify-center">
            <i className="fa-solid fa-dharmachakra fa-spin text-5xl text-[#ff6b00] mb-4"></i>
            <p className="text-gray-500 font-medium text-lg animate-pulse">Loading festival details...</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg border border-gray-200 overflow-hidden animate-fade-in p-8 md:p-12 relative">
            
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#ff6b00]"></div>

            {/* Newspaper Header */}
            <header className="mb-8 border-b-2 border-gray-800 pb-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {festivalName}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm text-gray-600 font-semibold uppercase tracking-wider font-sans border-t border-b border-gray-300 py-2 px-4">
                <span>
                  <i className="fa-regular fa-calendar-check mr-2 text-[#c85a17]"></i>
                  {festivalDateItem ? format(new Date(festivalDateItem.date), 'dd MMMM yyyy, eeee') : 'Date Calculating...'}
                </span>
                {festivalDateItem && differenceInDays(new Date(festivalDateItem.date), new Date()) > 0 && (
                  <span className="text-[#c85a17]">
                    <i className="fa-solid fa-hourglass-half mr-2"></i>
                    {differenceInDays(new Date(festivalDateItem.date), new Date())} Days Left
                  </span>
                )}
                <span>
                  <i className="fa-solid fa-tag mr-2 text-[#c85a17]"></i>
                  {festivalDateItem?.category || 'Hindu Festival'}
                </span>
              </div>
            </header>

            {/* Content Area - Newspaper Style */}
            <article className="clearfix text-lg text-gray-800 leading-loose" style={{ fontFamily: 'Georgia, serif' }}>
              
              {/* Image floated to the left */}
              <div className="float-none md:float-left w-full md:w-[350px] mr-8 mb-6 relative group">
                <img 
                  src={(data && data.thumbnail?.source) ? data.thumbnail.source : randomFallback} 
                  alt={festivalName} 
                  className="w-full h-auto object-cover rounded shadow-md border border-gray-200 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="text-xs text-gray-500 mt-2 text-center italic font-sans">
                  Visual representation of {festivalName}
                </div>
              </div>

              {/* Main Text wrapping around the image */}
              <div className="text-gray-700 text-justify">
                {data && data.extract ? (
                  <p className="whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:text-[#ff6b00] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {data.extract}
                  </p>
                ) : (
                  <p className="italic text-gray-500">Detailed information about {festivalName} will be updated soon.</p>
                )}
              </div>
              
              <div className="clear-both"></div>

              {/* Divider */}
              <div className="flex items-center justify-center my-10">
                <div className="w-16 h-px bg-gray-400"></div>
                <i className="fa-solid fa-om text-gray-400 mx-4"></i>
                <div className="w-16 h-px bg-gray-400"></div>
              </div>

              {/* Secondary Section */}
              <section className="bg-[#fffaf5] p-6 md:p-8 rounded-xl border border-[#ff6b00]/20">
                <h3 className="text-2xl font-bold text-[#5b2a26] mb-3 flex items-center gap-3">
                  <i className="fa-solid fa-hands-praying text-[#c85a17]"></i> 
                  Puja Vidhi & Shubh Muhurat
                </h3>
                <p className="text-gray-700 font-sans text-base">
                  {lang === 'hi' 
                    ? 'Is tyohar ki puja vidhi aur shubh muhurat jald hi yahan update kiye jayenge. Kripya niyamit roop se check karein.'
                    : 'Detailed Puja rituals (Vidhi) and auspicious timings (Shubh Muhurat) will be updated here shortly. Please check back later.'}
                </p>
                <div className="mt-6 text-center md:text-left">
                  <Link href="/our-experts" className="inline-block px-6 py-3 bg-[#ff6b00] text-white rounded font-bold shadow hover:bg-[#e65c00] transition-colors font-sans text-sm uppercase tracking-wide">
                    Talk to Astrologer for Details
                  </Link>
                </div>
              </section>

            </article>
          </div>
        )}
      </div>
    </div>
  );
}
