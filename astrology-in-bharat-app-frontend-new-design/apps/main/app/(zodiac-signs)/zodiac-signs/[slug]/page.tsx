"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HiSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import {
  MdOutlineHealthAndSafety,
  MdOutlineWorkOutline,
  MdFavoriteBorder,
} from "react-icons/md";
import {
  GiAries,
  GiTaurus,
  GiGemini,
  GiCancer,
  GiLeo,
  GiVirgo,
  GiLibra,
  GiScorpio,
  GiSagittarius,
  GiCapricorn,
  GiAquarius,
  GiPisces,
} from "react-icons/gi";
import Image from "next/image";
import { ZodiacSignsData } from "@/data/homePagaData";

// 12 signs mapping for icons and colors
const zodiacList = [
  { name: "aries", icon: GiAries, color: "from-orange-500 to-red-600" },
  { name: "taurus", icon: GiTaurus, color: "from-green-500 to-emerald-700" },
  { name: "gemini", icon: GiGemini, color: "from-yellow-400 to-amber-600" },
  { name: "cancer", icon: GiCancer, color: "from-blue-400 to-indigo-600" },
  { name: "leo", icon: GiLeo, color: "from-orange-400 to-yellow-600" },
  { name: "virgo", icon: GiVirgo, color: "from-emerald-400 to-green-600" },
  { name: "libra", icon: GiLibra, color: "from-pink-400 to-rose-600" },
  { name: "scorpio", icon: GiScorpio, color: "from-red-600 to-purple-800" },
  {
    name: "sagittarius",
    icon: GiSagittarius,
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "capricorn",
    icon: GiCapricorn,
    color: "from-slate-600 to-slate-800",
  },
  { name: "aquarius", icon: GiAquarius, color: "from-cyan-400 to-blue-600" },
  { name: "pisces", icon: GiPisces, color: "from-teal-400 to-blue-500" },
];

export default function ZodiacDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const signData = ZodiacSignsData.find(
    (s) => s.title.toLowerCase() === slug.toLowerCase()
  );
  const signTheme = zodiacList.find((z) => z.name === slug.toLowerCase());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/horoscope?sign=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (json.data && json.data.daily_predictions) {
          setHoroscope(json.data.daily_predictions[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const getIcon = (type: string) => {
    switch (type) {
      case "General":
        return <HiOutlineLightningBolt />;
      case "Health":
        return <MdOutlineHealthAndSafety />;
      case "Career":
        return <MdOutlineWorkOutline />;
      case "Love":
        return <MdFavoriteBorder />;
      default:
        return <HiSparkles />;
    }
  };

  if (!signData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf8]">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl border border-[#daa23e73]">
          <h2 className="text-2xl font-bold text-[#301118]">
            Zodiac Sign Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The destiny of this sign is still being written.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper bg-[#fffcf8] min-h-screen">
      <section className="horoscopes-container py-10">
        <div className="container">
          <div className="light-card p-6 md:p-10 rounded-[20px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#daa23e3b]">
            {/* Header with Sign Image and Basic Info */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-[#daa23e1a] pb-10">
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${signTheme?.color || "from-orange-100 to-orange-200"} blur-3xl opacity-20 rounded-full`}
                ></div>
                <Image
                  src={signData.image}
                  alt={signData.title}
                  width={150}
                  height={150}
                  className="relative z-10 w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
                />
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h1 className="text-4xl md:text-6xl font-bold text-[#301118] tracking-tight">
                    {signData.title}
                  </h1>
                  {horoscope && (
                    <span className="text-3xl md:text-4xl text-[#fd6410] opacity-80">
                      {horoscope.sign_info.unicode_symbol}
                    </span>
                  )}
                </div>
                <p className="text-lg md:text-xl text-[#fd6410] font-medium italic">
                  {signData.date}
                </p>
                {horoscope && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    <span className="bg-[#fff5ef] text-[#c45a13] text-[12px] font-bold px-4 py-1.5 rounded-full uppercase border border-[#fd64102b]">
                      {horoscope.sign_info.modality}
                    </span>
                    <span className="bg-[#fff5ef] text-[#c45a13] text-[12px] font-bold px-4 py-1.5 rounded-full uppercase border border-[#fd64102b]">
                      {horoscope.sign_info.triplicity}
                    </span>
                    <span className="bg-[#fff5ef] text-[#c45a13] text-[12px] font-bold px-4 py-1.5 rounded-full uppercase border border-[#fd64102b]">
                      {horoscope.sign_info.quadruplicity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 border-4 border-[#fd6410] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-xl font-medium text-[#301118] animate-pulse">
                  Reading the cosmic alignments for {signData.title}...
                </p>
              </div>
            ) : error ? (
              <div className="py-20 text-center italic text-gray-400">
                <p>
                  The stars are currently veiled by clouds. Please try again
                  later.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Predictions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {horoscope.predictions.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="group bg-white border border-[#daa23e33] p-6 md:p-8 rounded-[15px] hover:shadow-[0_15px_40px_rgba(253,100,16,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-6xl text-[#fd6410]">
                          {getIcon(p.type)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <span className="p-3 bg-[#fff5ef] rounded-xl text-[#fd6410] text-2xl shadow-sm border border-[#fd64101a]">
                          {getIcon(p.type)}
                        </span>
                        <h4 className="font-bold text-xl text-[#301118]">
                          {p.type} Forecast
                        </h4>
                      </div>

                      <p className="text-[#1a1a1a] leading-relaxed mb-6 text-lg italic">
                        &quot;{p.prediction}&quot;
                      </p>

                      <div className="space-y-4 pt-6 border-t border-[#daa23e1a]">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-black uppercase tracking-tighter bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            The Seek
                          </span>
                          <p className="text-sm text-gray-700">{p.seek}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-black uppercase tracking-tighter bg-red-100 text-red-600 px-2 py-1 rounded">
                            Challenge
                          </span>
                          <p className="text-sm text-gray-700">{p.challenge}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
                            Insight
                          </span>
                          <p className="text-sm text-gray-700">{p.insight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cosmic Aspects & Transits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                  {/* Aspects */}
                  <div className="bg-[#301118] p-8 rounded-[20px] shadow-2xl border border-[#fd64102b] text-white overflow-hidden relative">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#fd6410] blur-[120px] opacity-10"></div>
                    <h4 className="font-bold text-2xl mb-6 flex items-center gap-3 relative z-10">
                      <HiSparkles className="text-[#fd6410]" /> Cosmic Aspects
                    </h4>
                    <ul className="space-y-4 relative z-10">
                      {horoscope.aspects.map((a: any, i: number) => (
                        <li
                          key={i}
                          className="flex justify-between items-center bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-[#fd64103d] transition-colors"
                        >
                          <span className="font-medium text-slate-200">
                            {a.planet_one.name}{" "}
                            <span className="text-[#fd6410] mx-1">
                              {a.aspect.name}
                            </span>{" "}
                            {a.planet_two.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#fd6410] bg-[#fd64101a] px-3 py-1 rounded-full border border-[#fd641033]">
                            Active
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transits */}
                  <div className="bg-[#fffcf8] p-8 rounded-[20px] border border-[#daa23e59] shadow-lg">
                    <h4 className="font-bold text-2xl text-[#301118] mb-6 flex items-center gap-3">
                      <HiOutlineLightningBolt className="text-[#fd6410]" />{" "}
                      Today&apos;s Transits
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {horoscope.transits.map((t: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#daa23e1a] shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[#301118]">
                              {t.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              Currently in {t.zodiac.name}
                            </span>
                          </div>
                          {t.is_retrograde && (
                            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                              Retrograde
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-10 text-center border-t border-[#daa23e1a] mt-10">
        <p className="text-gray-400 text-sm italic">
          © 2026 Astrology in Bharat • Data synchronized with precise planetary
          alignments.
        </p>
      </footer>
    </div>
  );
}
