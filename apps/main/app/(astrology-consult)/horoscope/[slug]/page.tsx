"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ZodiacSignsData } from "@/components/features/services/zodiac";
import CTA from "@/components/layout/main/CTA";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import { FaLeaf, FaBriefcase, FaHeart, FaPlane, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { api } from "@/lib/api";

export default function ZodiacDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // We will initialize with today's date, but then overwrite it with the API date
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      const [data, fetchError] = await api.get<any>(`/astrology/horoscope/daily?sign=${slug}&lang=${lang}`);
      
      if (fetchError) {
          console.error("Error fetching data:", fetchError);
          setError(true);
      } else if (data && data.data) {
          // 🔥 Dynamic Date Fix: Using 'datetime' from the actual API response
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
      setLoading(false);
    };

    if (slug) fetchData();
  }, [slug, lang]);

  const getIcon = (type: string) => {
    switch (type) {
      case "Health":
        return <FaLeaf className="text-emerald-500" />;
      case "Career":
        return <FaBriefcase className="text-indigo-500" />;
      case "Love":
        return <FaHeart className="text-rose-500" />;
      default:
        return <FaPlane className="text-orange-500" />;
    }
  };

  const getPredictionCategory = (type: string) => {
    switch (type) {
      case "Health":
        return {
          label: lang === "hi" ? "स्वास्थ्य और कल्याण" : "Health & Wellbeing",
          gradient: "from-emerald-50/50 via-white to-white",
          border: "border-emerald-100",
          text: "text-emerald-600",
          accent: "orange-500"
        };
      case "Career":
        return {
          label: lang === "hi" ? "कैरियर और वित्त" : "Career & Finance",
          gradient: "from-indigo-50/50 via-white to-white",
          border: "border-indigo-100",
          text: "text-indigo-600",
          accent: "orange-500"
        };
      case "Love":
        return {
          label: lang === "hi" ? "प्रेम और संबंध" : "Love & Relations",
          gradient: "from-rose-50/50 via-white to-white",
          border: "border-rose-100",
          text: "text-rose-600",
          accent: "orange-500"
        };
      default:
        return {
          label: lang === "hi" ? `${type} पूर्वानुमान` : `${type} Forecast`,
          gradient: "from-orange-50/50 via-white to-white",
          border: "border-orange-100",
          text: "text-orange-600",
          accent: "orange-500"
        };
    }
  };

  if (!signData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-premium border border-gray-100 max-w-lg">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm border border-orange-100">
            🔮
          </div>
          <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
            Zodiac Sign <span className="text-orange-500 italic underline underline-offset-8 decoration-orange-500/20">Not Found</span>
          </h2>
          <p className="text-slate-500 mb-10 text-lg font-medium italic">
            &quot;The destiny of this sign is still being written by the stars.&quot;
          </p>
          <Link
            href="/horoscope"
            className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] no-underline transition-all hover:bg-orange-600 hover:-translate-y-1 shadow-2xl"
          >
            Back to Horoscopes
            <FaArrowRight size={10} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32 bg-slate-950 text-white">
          {/* Celestial background elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-md hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span className="text-base">{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
            {lang === "en" ? "हिंदी" : "English"}
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center font-display">
            <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4">
                    <span className="inline-block px-5 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-black text-[10px] border border-orange-500/20 tracking-[0.3em] uppercase">
                    {signData.date} • Daily Guide
                    </span>
                    <div className="w-12 h-[1px] bg-white/20"></div>
                </div>
                <h1 className="text-5xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tighter" style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                  {signData.title}{" "}
                  <span className="text-orange-500 italic block lg:inline">{lang === "hi" ? "दैनिक" : "Daily"}</span> {lang === "hi" ? "भविष्यवाणी" : "Predictions"}
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl leading-relaxed italic border-l-4 border-orange-500/30 pl-8" style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                  {signData.title}, the stars are aligning for you today.
                  Explore how planetary movements are influencing your personal
                  and professional life with our expert Vedic analysis.
                </p>
              </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black italic text-white/50">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                    Ancient Wisdom • Modern Guidance
                  </span>
                </div>
            </div>

            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative group flex items-center justify-center">
                <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative aspect-square max-w-md mx-auto p-12 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl shadow-black/50 overflow-hidden transform transition-transform duration-700 group-hover:-translate-y-4">
                  <Image
                    src="/images/horoscope-round2.png"
                    alt="Zodiac Wheel"
                    fill
                    className="animate-[spin_60s_linear_infinite] opacity-20 object-contain p-8"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-4/5 h-4/5">
                      <Image
                        src={signData.image}
                        alt={signData.title}
                        fill
                        className="object-contain drop-shadow-[0_0_50px_rgba(249,115,22,0.6)] transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-4 -right-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        Live Vedic Forecast
                    </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Predictions */}
      <section className="py-24 relative z-20 -mt-20">
        <div className="max-w-[1400px] mx-auto px-4">
          {loading ? (
            <div className="bg-white rounded-[3rem] p-24 text-center shadow-premium border border-gray-100 max-w-5xl mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 animate-pulse tracking-tight uppercase">
                Consulting the heavens for{" "}
                <span className="text-orange-500">{signData.title}</span>...
              </h3>
              <p className="text-slate-400 mt-4 font-bold tracking-widest uppercase text-xs italic">
                Wait for the cosmic alignment
              </p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-[3rem] p-24 text-center shadow-premium border border-rose-100 max-w-5xl mx-auto">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-sm border border-rose-100">
                ✨
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                The stars are currently veiled
              </h3>
              <p className="text-slate-500 italic font-medium max-w-md mx-auto text-lg">
                &quot;Our connection with the cosmic data is momentarily disrupted.
                Please check back soon.&quot;
              </p>
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto">
              <div className="bg-white rounded-[3.5rem] p-10 lg:p-20 shadow-premium border border-gray-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  <HiOutlineSparkles className="text-[12rem] text-orange-500" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20 pb-16 border-b border-gray-100">
                  <div className="flex items-center gap-10">
                    <div className="relative group/sign">
                        <div className="absolute -inset-2 bg-orange-500/10 rounded-3xl blur-2xl opacity-0 group-hover/sign:opacity-100 transition-opacity"></div>
                        <div className="relative w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover/sign:scale-105">
                        <Image
                            src={signData.image}
                            alt={signData.title}
                            width={60}
                            height={60}
                            className="w-14 h-14 object-contain drop-shadow-xl"
                        />
                        </div>
                    </div>
                    <div>
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight uppercase">
                        {signData.title}{" "}
                        <span className="text-orange-500 italic block lg:inline">Horoscope</span>
                      </h2>
                      <div className="flex items-center gap-5 mt-2">
                        <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] italic">
                          Forecast for {formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                    <div className="inline-flex items-center gap-4 bg-slate-950 text-white px-8 py-5 rounded-3xl shadow-2xl relative group/live overflow-hidden">
                        <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover/live:translate-y-0 transition-transform duration-500"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]"></span>
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                                Realtime Alignment
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prediction Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                  {horoscope.predictions.map((p: any, idx: number) => {
                    const cat = getPredictionCategory(p.type);
                    return (
                      <div key={idx} className="group/pred">
                        <div
                          className={`p-12 rounded-[2.5rem] border border-gray-100 group-hover/pred:border-orange-500/20 bg-gradient-to-br ${cat.gradient} h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col relative overflow-hidden`}
                        >
                            {/* Accent Line */}
                            <div className={`absolute top-0 left-12 w-16 h-1.5 bg-orange-500 rounded-b-full opacity-20 group-hover/pred:opacity-100 group-hover/pred:w-24 transition-all duration-500`}></div>

                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-4xl mb-8 group-hover/pred:scale-110 group-hover/pred:shadow-md transition-transform duration-500">
                                {getIcon(p.type)}
                            </div>

                            <h4 className={`text-[11px] font-black ${cat.text} uppercase mb-4 tracking-[0.4em] flex items-center justify-between`}>
                                {cat.label}
                                <FaChevronRight className="opacity-0 group-hover/pred:opacity-20 -translate-x-4 group-hover/pred:translate-x-0 transition-all" />
                            </h4>

                            <p className="text-slate-700 text-[16px] leading-relaxed mb-0 font-bold italic opacity-90 border-l-4 border-orange-500/10 pl-6 py-2 group-hover/pred:text-slate-950 transition-colors">
                                &quot;{p.prediction}&quot;
                            </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cosmic Tip Section */}
                <div className="relative rounded-[3rem] bg-slate-950 p-12 lg:p-20 shadow-2xl overflow-hidden group/tip border border-white/5 shadow-black/30">
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/tip:bg-orange-500/20 transition-all duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-2/3 space-y-10">
                      <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Expert Insight</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black text-white mb-0 tracking-tight leading-tight">
                          Today&apos;s Spiritual{" "}
                          <span className="text-orange-500 italic block lg:inline underline underline-offset-8 decoration-orange-500/20">Alignment</span>
                        </h3>
                      </div>
                      <p className="text-white/70 text-xl lg:text-2xl font-bold font-display leading-relaxed italic border-l-8 border-orange-500 pl-10 py-4 max-w-2xl bg-white/5 rounded-r-3xl backdrop-blur-sm shadow-2xl">
                        &quot;Patience will be your greatest ally. The cosmic
                        energies favor thoughtful decisions. Wear colors that
                        resonate with your spirit and meditate for 10 minutes
                        to align your energy with the universe.&quot;
                      </p>
                    </div>

                    <div className="lg:w-1/3 w-full">
                      <Link
                        href="/our-astrologers"
                        className="group/btn relative w-full inline-flex items-center justify-center gap-6 bg-white hover:bg-orange-500 text-slate-950 hover:text-white px-10 py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] no-underline transition-all shadow-2xl hover:-translate-y-2 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">Consult Astrologer</span>
                        <FaArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation for other Signs */}
      <section className="py-24 bg-white relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-linear-to-r from-transparent via-gray-100 to-transparent"></div>
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-block px-5 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">The Zodiac Wheel</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight uppercase">
              Explore Our <span className="text-orange-500 italic block lg:inline">Zodiac</span> Constellations
            </h2>
            <div className="w-24 h-2 bg-orange-500/10 mx-auto rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-orange-500 animate-[shimmer_2s_infinite_linear]"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
            {ZodiacSignsData.map((sign) => (
              <Link
                key={sign.id}
                href={`/horoscope/${sign.title.toLowerCase()}`}
                className={`group relative p-6 rounded-[2.5rem] border transition-all duration-700 no-underline flex flex-col items-center justify-center gap-4 overflow-hidden h-full ${
                  slug?.toLowerCase() === sign.title.toLowerCase()
                    ? "border-orange-500/30 bg-orange-500/5 shadow-2xl -translate-y-4 ring-2 ring-orange-500/10 ring-offset-4"
                    : "border-gray-50 hover:border-orange-500/20 hover:bg-slate-50 hover:-translate-y-2"
                }`}
              >
                {/* Active Glow */}
                {slug?.toLowerCase() === sign.title.toLowerCase() && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)]"></div>
                )}

                <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-700 drop-shadow-lg">
                  <Image
                    src={sign.image}
                    alt={sign.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                    <span
                    className={`block text-[11px] font-black uppercase tracking-widest leading-none mb-1 transition-colors ${slug?.toLowerCase() === sign.title.toLowerCase() ? "text-orange-600" : "text-slate-400 group-hover:text-slate-900"}`}
                    >
                    {sign.title}
                    </span>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {sign.id}th House
                    </span>
                </div>

                {slug?.toLowerCase() === sign.title.toLowerCase() && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
      
      <style jsx global>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
