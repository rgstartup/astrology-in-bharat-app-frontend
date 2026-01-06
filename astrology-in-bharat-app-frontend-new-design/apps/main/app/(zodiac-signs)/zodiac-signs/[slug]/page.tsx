"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaBriefcase,
  FaLeaf,
  FaPlane,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaCalculator,
  FaPray,
  FaInfinity,
  FaRegHeart,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import {
  HiSparkles,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";
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

import { ZodiacSignsData } from "@/data/homePagaData";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";

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
    (s) => s.title.toLowerCase() === slug?.toLowerCase()
  );
  const signTheme = zodiacList.find((z) => z.name === slug?.toLowerCase());

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
      case "Health":
        return <FaLeaf className="text-green-500" />;
      case "Career":
        return <FaBriefcase className="text-blue-500" />;
      case "Love":
        return <FaHeart className="text-pink-500" />;
      default:
        return <FaPlane className="text-orange-500" />;
    }
  };

  const getPredictionCategory = (type: string) => {
    switch (type) {
      case "Health":
        return { label: "Health & Wellbeing", bg: "bg-green-50" };
      case "Career":
        return { label: "Career & Finance", bg: "bg-blue-50" };
      case "Love":
        return { label: "Love & Relations", bg: "bg-pink-50" };
      default:
        return { label: type + " Forecast", bg: "bg-orange-50" };
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
          <Link href="/" className="mt-4 inline-block text-[#fd6410] font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper bg-[#fffcf8]">
      {/* Top Bar Tool Actions */}
      {/* <div className="bg-[#301118] py-3 text-white border-b border-[#fd64102b] sticky top-0 z-50">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-2 md:gap-3">
          {[
            { icon: <FaBookOpen />, label: "My Kundli", href: "/kundli" },
            {
              icon: <FaCalculator />,
              label: "Numerology",
              href: "/numerology",
            },
            { icon: <FaPray />, label: "Online Puja", href: "/online-puja" },
            {
              icon: <FaInfinity />,
              label: "Life Horoscope",
              href: "/horoscope",
            },
            {
              icon: <FaRegHeart />,
              label: "Love Report",
              href: "/love-report",
            },
          ].map((tool, i) => (
            <Link
              href={tool.href}
              key={i}
              className="flex items-center gap-2 bg-[#fd6410] hover:bg-[#e55a0d] px-3 md:px-4 py-2 rounded-full font-bold text-[10px] md:text-[12px] uppercase tracking-wider transition-all shadow-lg border-0 no-underline text-white"
            >
              {tool.icon} <span className="hidden sm:inline">{tool.label}</span>
            </Link>
          ))}
        </div>
      </div> */}

      {/* Hero Section - Following Homepage Aesthetics & UI/UX */}
      <section className="banner-part light-back">
        <div className="overlay-hero">
          <div className="container">
            <div className="contant-hero">
              <div className="row align column-reverse">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card shine px-0 md:px-4">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        {signData.date} •{" "}
                        {horoscope?.sign_info?.unicode_symbol || "✨"}
                      </span>
                      <h1 className="text-[36px] md:text-[50px] font-bold text-[#2b1b1b] mb-1">
                        {signData.title}{" "}
                        <span className="text-[#fd6410]">Horoscope</span>
                      </h1>
                      <h4 className="card-title">
                        Daily Predictions & Cosmic Guidance
                      </h4>
                      <p className="text-[16px] text-[#1a1a1a] mb-3">
                        Discover what the stars have in store for{" "}
                        {signData.title} today. Our expert astrologers analyze
                        planetary movements to provide accurate daily
                        predictions specifically for your zodiac sign.
                      </p>

                      <ul className="list-check mb-4">
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Personalized
                          Daily Forecasts
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Love, Career &
                          Health Insights
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Planetary
                          Transit Analysis
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {horoscope ? (
                          <>
                            <div className="flex items-center gap-2 bg-[#fd64101a] text-[#c45a13] text-[12px] font-bold px-4 py-2 rounded-full uppercase border border-[#fd64102b]">
                              <HiSparkles /> Element:{" "}
                              {horoscope.sign_info.triplicity}
                            </div>
                            <div className="flex items-center gap-2 bg-[#fd64101a] text-[#c45a13] text-[12px] font-bold px-4 py-2 rounded-full uppercase border border-[#fd64102b]">
                              <HiOutlineLightningBolt /> Modality:{" "}
                              {horoscope.sign_info.modality}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#fd64101a] text-[#c45a13] text-[12px] font-bold px-4 py-2 rounded-full uppercase border border-[#fd64102b]">
                            Aligning with your destiny...
                          </div>
                        )}
                      </div>

                      <Link
                        href="/our-astrologers"
                        className="btn-link wfc mt-4 no-underline"
                      >
                        Ask an Expert Today
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="right-illus relative h-[350px] md:h-[450px]">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac Back"
                      fill
                      className="Astrologer-img-h fa-spin object-contain opacity-30"
                    />
                    <Image
                      src={signData.image}
                      alt={signData.title}
                      fill
                      className="Astrologer-img object-contain animate-[float_4s_ease-in-out_infinite] z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Predictions */}
      <section className="space-section light-back">
        <div className="container">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-[#fd6410] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl font-medium text-[#301118] animate-pulse">
                Consulting the heavens for {signData.title}...
              </p>
            </div>
          ) : error ? (
            <div className="py-20 text-center italic text-gray-400">
              <p>The stars are currently veiled. Please try again later.</p>
            </div>
          ) : (
            <div className="row g-5">
              {/* Detailed Predictions */}
              <div className="col-lg-8">
                <div className="light-card border border-[#fd64102b] p-6 md:p-10 shadow-xl h-100 bg-white rounded-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[#fd64101a]">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#fd6410] p-3 rounded-4 shadow-lg text-white text-2xl">
                        {signTheme?.icon && <signTheme.icon />}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-[#301118] uppercase tracking-tight m-0">
                          {signData.title} Prediction
                        </h2>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest m-0">
                          Today's Cosmic Forecast
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#3011181a] px-4 py-2 rounded-full">
                      <MdOutlineDateRange className="text-[#fd6410]" />
                      <span className="text-xs font-bold text-[#301118]">
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="row g-4">
                    {horoscope.predictions.map((p: any, idx: number) => {
                      const cat = getPredictionCategory(p.type);
                      return (
                        <div key={idx} className="col-md-6">
                          <div
                            className={`${cat.bg} p-6 rounded-4 border border-white shadow-sm h-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}
                          >
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl text-[#fd6410]">
                              {getIcon(p.type)}
                            </div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                              <span className="text-xl">{getIcon(p.type)}</span>
                              <h4 className="text-sm font-bold text-[#301118] uppercase tracking-wider mb-0">
                                {cat.label}
                              </h4>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed italic m-0 relative z-10">
                              "{p.prediction}"
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                  Advice
                                </span>
                                <p className="text-[11px] text-gray-500 m-0">
                                  {p.seek}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cosmic Tip Card */}
                  <div className="mt-10 bg-[#301118] p-8 rounded-4 border border-[#fd641033] relative overflow-hidden text-white shadow-2xl">
                    <HiOutlineSparkles className="absolute -right-10 -bottom-10 text-[#fd6410] text-9xl opacity-10" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#fd6410] flex items-center justify-center text-xl">
                        <HiSparkles />
                      </div>
                      <h3 className="text-xl font-bold m-0 text-white">
                        Cosmic Tip of the Day
                      </h3>
                    </div>
                    <p className="text-orange-100/80 italic relative z-10 m-0 leading-relaxed text-lg">
                      "Align your energy with the universe by practicing
                      mindfulness. Your lucky star is rising, but clarity of
                      thought is your greatest asset when dealing with personal
                      choices today."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-lg-4">
                <div className="sticky top-24 space-y-6">
                  {/* Cosmic Indicators */}
                  <div className="bg-[#301118] text-white p-8 rounded-4 border border-[#fd64102b] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#fd6410] blur-[100px] opacity-10"></div>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                          <FaStar key={s} className="text-[#fd6410] text-xs" />
                        ))}
                      </div>
                      Cosmic Indicators
                    </h3>
                    <div className="space-y-4 relative z-10">
                      {[
                        {
                          lbl: "Lucky Number",
                          val: "9 & 14",
                          icon: <FaStar className="text-yellow-400" />,
                        },
                        {
                          lbl: "Lucky Color",
                          val: "Zodiac Orange",
                          icon: (
                            <div className="w-3 h-3 bg-[#fd6410] rounded-full" />
                          ),
                        },
                        {
                          lbl: "Lucky Day",
                          val: "Thursday",
                          icon: <FaCalendarAlt className="text-blue-400" />,
                        },
                        {
                          lbl: "Best Timing",
                          val: "10:30 AM - 12:00 PM",
                          icon: <FaClock className="text-orange-400" />,
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-4 bg-white/5 rounded-3 border border-white/5 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            {stat.icon}
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                              {stat.lbl}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-orange-200">
                            {stat.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Find Temple / Remedy Search */}
                  <div className="light-card border border-[#fd64102b] p-8 shadow-xl bg-white rounded-4">
                    <h4 className="text-[#301118] font-bold mb-6 flex items-center gap-2">
                      <HiOutlineLightningBolt className="text-[#fd6410]" />{" "}
                      Expert Guidance
                    </h4>
                    <p className="text-xs text-gray-500 italic mb-6">
                      Get personalized remedies and detailed analysis for{" "}
                      {signData.title} by connecting with our expert
                      astrologers.
                    </p>
                    <Link
                      href="/our-astrologers"
                      className="btn-link w-full text-center text-xs bg-[#fd6410] text-white border-0 py-3 rounded-xl font-bold uppercase tracking-widest no-underline hover:bg-[#e55a0d] transition-colors"
                    >
                      Consult Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us & CTA */}
      <WhyChooseUs />
      <CTA />

      {/* Internal Navigation for other Signs */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="title-line text-center mb-10">
            <span>Explore Other Zodiac Signs</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {ZodiacSignsData.map((sign) => (
              <Link
                key={sign.id}
                href={`/zodiac-signs/${sign.title.toLowerCase()}`}
                className={`p-2 rounded-xl text-center border transition-all duration-300 no-underline ${
                  slug?.toLowerCase() === sign.title.toLowerCase()
                    ? "border-[#fd6410] bg-[#fd641008] shadow-md -translate-y-1"
                    : "border-transparent hover:border-[#fd641033] hover:bg-gray-50"
                }`}
              >
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <Image
                    src={sign.image}
                    alt={sign.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase ${slug?.toLowerCase() === sign.title.toLowerCase() ? "text-[#fd6410]" : "text-[#301118]"}`}
                >
                  {sign.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
