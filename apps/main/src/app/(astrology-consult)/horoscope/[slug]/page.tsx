"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguageStore } from "@repo/store";
import { ZodiacSignsData } from "@/components/features/services/zodiac";
import { FaArrowRight } from "react-icons/fa";
import { api } from "@/actions";

import ZodiacHeaderProfile from "./header-profile.component";
import HoroscopeTabs from "./tabs.component";
import PredictionList from "./prediction-list.component";
import PlanetaryInfluence from "./planetary-influence.component";
import {
  LuckyAspects,
  RemedyForYou,
  ThingsToAvoid,
} from "./bottom-cards.component";
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
    const today = new Date().toLocaleDateString(
      lang === "hi" ? "hi-IN" : "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    );
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

      const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
      const [data, fetchError] = await api.get<any>(
        `/astrology/horoscope-daily?sign=${slug}&lang=${lang}`,
      );

      // Fetch panchang mock data for consistent lucky stats with calendar
      const [panchangData, panchangError] = await api.get<any>(
        `/calendar/panchang/daily?date=${today}&lat=28.6139&lon=77.2090&lang=${lang}`,
      );

      if (fetchError) {
        console.error("Error fetching data:", fetchError);
        setError(true);
      } else if (data && data.data) {
        // Don't overwrite formatted date with API datetime, it returns mock Jan 1 2025 data

        if (data.data.daily_predictions) {
          setHoroscope(data.data.daily_predictions[0]);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }

      const panchangRaw = panchangData?.data || panchangData;

      if (!panchangError && panchangRaw?.dailyHoroscope) {
        const signDaily = panchangRaw.dailyHoroscope.find(
          (h: any) => h.sign.toLowerCase() === slug.toLowerCase(),
        );
        if (signDaily) {
          setLuckyStats({
            lucky_number: signDaily.number,
            lucky_color: {
              name: signDaily.color,
              hex: "", // Handled by getVibrantColor fallback
            },
            lucky_time: "09:00 AM - 11:00 AM", // Keep mock time
          });
        }
      }

      setLoading(false);
    };

    if (slug) fetchData();
  }, [slug, lang]);

  const tx = {
    en: {
      notFound: "Not Found",
      notFoundDesc:
        '"The destiny of this sign is still being written by the stars."',
      backToHoroscopes: "Back to Horoscopes",
      failedToLoad: "Failed to load horoscope data.",
      ctaSubtitle: "Personalized Guidance",
      ctaTitle: "Get More Personalized Predictions",
      ctaDesc:
        "Talk to our expert astrologers for in-depth guidance based on your birth chart.",
      ctaBtn: "Talk to Expert",
    },
    hi: {
      notFound: "नहीं मिला",
      notFoundDesc: '"इस राशि का भाग्य अभी भी सितारों द्वारा लिखा जा रहा है।"',
      backToHoroscopes: "राशिफल पर वापस जाएं",
      failedToLoad: "राशिफल डेटा लोड करने में विफल।",
      ctaSubtitle: "व्यक्तिगत मार्गदर्शन",
      ctaTitle: "अधिक व्यक्तिगत भविष्यवाणियां प्राप्त करें",
      ctaDesc:
        "अपनी जन्म कुंडली के आधार पर गहन मार्गदर्शन के लिए हमारे विशेषज्ञ ज्योतिषियों से बात करें।",
      ctaBtn: "विशेषज्ञ से बात करें",
    },
  }[lang] || {
    notFound: "Not Found",
    notFoundDesc:
      '"The destiny of this sign is still being written by the stars."',
    backToHoroscopes: "Back to Horoscopes",
    failedToLoad: "Failed to load horoscope data.",
    ctaSubtitle: "Personalized Guidance",
    ctaTitle: "Get More Personalized Predictions",
    ctaDesc:
      "Talk to our expert astrologers for in-depth guidance based on your birth chart.",
    ctaBtn: "Talk to Expert",
  };

  if (!signData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0] p-6">
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-premium border border-[#E8D5C0] max-w-lg">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm border border-orange-100">
            🔮
          </div>
          <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
            Zodiac Sign{" "}
            <span className="text-orange-500 italic underline underline-offset-8 decoration-orange-500/20">
              {tx.notFound}
            </span>
          </h2>
          <p className="text-slate-500 mb-10 text-lg font-medium italic">
            {tx.notFoundDesc}
          </p>
          <button
            onClick={() => router.push("/horoscope")}
            className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] no-underline transition-all hover:bg-orange-600 hover:-translate-y-1 shadow-2xl"
          >
            {tx.backToHoroscopes}
            <FaArrowRight size={10} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6F0] min-h-screen">
      {/* Container */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-6">
        {/* Full width components */}
        <ZodiacHeaderProfile
          signData={signData}
          formattedDate={formattedDate}
          luckyStats={luckyStats}
        />

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
              <div className="py-20 text-center text-red-500">
                {tx.failedToLoad}
              </div>
            ) : (
              <>
                <PredictionList horoscope={horoscope} />

                <PlanetaryInfluence />

                {/* Talk to Expert Banner */}
                <GuidanceCTA
                  className="mt-8"
                  subtitle={tx.ctaSubtitle}
                  title={tx.ctaTitle}
                  description={tx.ctaDesc}
                  buttonText={tx.ctaBtn}
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
