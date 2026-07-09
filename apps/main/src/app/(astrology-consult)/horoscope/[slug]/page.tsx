"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";
import { ZodiacSignsData } from "@/components/features/services/zodiac";
import { FaArrowRight } from "react-icons/fa";
import { api } from "@/lib/api";

import ZodiacHeaderProfile from "./header-profile.component";
import HoroscopeTabs from "./tabs.component";
import PredictionList from "./prediction-list.component";
import PlanetaryInfluence from "./planetary-influence.component";
import { LuckyAspects, RemedyForYou, ThingsToAvoid } from "./bottom-cards.component";
import ZodiacDetailsSidebar from "./sidebar.component";
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import ZodiacSignSeoContent from "./zodiac-seo-content.component";

export default function ZodiacDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Force scroll to top when navigating to a new zodiac sign
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { lang } = useLanguageStore();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setFormattedDate(today);
  }, [lang]);

  const signData = ZodiacSignsData.find(
    (s) => s.title.toLowerCase() === slug?.toLowerCase(),
  );

  const [luckyStats, setLuckyStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      const [data, fetchError] = await api.get<any>(`/astrology/horoscope-daily?sign=${slug}&lang=${lang}`);
      const [luckyData, luckyError] = await api.get<any>(`/astrology/lucky-stats?sign=${slug}&date=${today}`);
      
      if (fetchError) {
          console.error("Error fetching data:", fetchError);
          setError(true);
      } else if (data && data.data) {
          if (data.data.datetime) {
            setFormattedDate(
              new Date(data.data.datetime).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            );
          }
          
          if (data.data.daily_predictions) {
            setHoroscope(data.data.daily_predictions[0]);
          } else {
            setError(true);
          }
      } else {
          setError(true);
      }
      
      if (!luckyError && luckyData?.data) {
        setLuckyStats(luckyData.data);
      }
      
      setLoading(false);
    };

    if (slug) fetchData();
  }, [slug, lang]);

  if (!signData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-6">
        <div className="text-center p-12 bg-[#1A1A1A] rounded-[3rem] shadow-premium border border-[#333333] max-w-lg">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm border border-orange-100">
            🔮
          </div>
          <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
            Zodiac Sign <span className="text-orange-500 italic underline underline-offset-8 decoration-orange-500/20">Not Found</span>
          </h2>
          <p className="text-slate-500 mb-10 text-lg font-medium italic">
            &quot;The destiny of this sign is still being written by the stars.&quot;
          </p>
          <button
            onClick={() => router.push('/horoscope')}
            className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] no-underline transition-all hover:bg-orange-600 hover:-translate-y-1 shadow-2xl"
          >
            Back to Horoscopes
            <FaArrowRight size={10} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      
      {/* Container */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-6">
        
        {/* Full width components */}
        <ZodiacHeaderProfile signData={signData} formattedDate={formattedDate} luckyStats={luckyStats} />
        
        <HoroscopeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Grid: Left content, Right sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
          
          {/* Left Column */}
          <div className="flex-1 w-full min-w-0">
            
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-[#E8D5C0] border-t-[#F26500] rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500">Failed to load horoscope data.</div>
            ) : (
              <>
                <PredictionList horoscope={horoscope} />
                
                <PlanetaryInfluence />

                {/* Talk to Expert Banner */}
                <GuidanceCTA 
                  className="mt-8"
                  subtitle="Personalized Guidance"
                  title="Get More Personalized Predictions"
                  description="Talk to our expert astrologers for in-depth guidance based on your birth chart."
                  buttonText="Talk to Expert"
                  buttonIcon="fa-solid fa-headset"
                />

              </>
            )}

          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[350px] shrink-0">
            <ZodiacDetailsSidebar signData={signData} />
          </div>

        </div>

        {/* Full width Bottom Cards Row */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
            <LuckyAspects />
            <RemedyForYou />
            <ThingsToAvoid />
          </div>
        )}
      </div>

      {/* SEO/Content Section Specific to Sign */}
      <ZodiacSignSeoContent signSlug={slug} />

    </div>
  );
}
