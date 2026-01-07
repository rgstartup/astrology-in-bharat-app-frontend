"use client";

import React, { useState } from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaCalendarAlt as FaC,
  FaClock as FaCl,
  FaMapMarkerAlt as FaM,
  FaStar as FaS,
  FaHeart as FaH,
  FaBriefcase as FaB,
  FaLeaf as FaL,
  FaPlane as FaP,
  FaBookOpen as FaBo,
  FaCalculator as FaCa,
  FaPray as FaPr,
  FaInfinity as FaI,
  FaRegHeart as FaRh,
} from "react-icons/fa";
const FaCalendarAlt = FaC as any;
const FaClock = FaCl as any;
const FaMapMarkerAlt = FaM as any;
const FaStar = FaS as any;
const FaHeart = FaH as any;
const FaBriefcase = FaB as any;
const FaLeaf = FaL as any;
const FaPlane = FaP as any;
const FaBookOpen = FaBo as any;
const FaCalculator = FaCa as any;
const FaPray = FaPr as any;
const FaInfinity = FaI as any;
const FaRegHeart = FaRh as any;

import { MdOutlineDateRange as MdO } from "react-icons/md";
const MdOutlineDateRange = MdO as any;
import { HiOutlineSparkles as HiOs } from "react-icons/hi";
const HiOutlineSparkles = HiOs as any;
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";
import ChooseYourZodiac from "@/components/layout/main/ChooseYourZodiac";
import Featured4Cards from "@/components/ui/common/Featured4Cards";

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState(ZodiacSignsData[0]);

  if (!selectedSign) return null;

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back">
        <div className="overlay-hero">
          <div className="container">
            <div className="contant-hero rounded-4 border border-[#fd64102b] shadow-xl">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        Free Daily Predictions
                      </span>
                      <h1>Discover Your Destiny</h1>
                      <h4 className="card-title">
                        Accurate Daily & Yearly Horoscopes
                      </h4>
                      <p>
                        Unlock the secrets of the stars with our accurate daily,
                        weekly, monthly, and yearly horoscopes based on ancient
                        Vedic Astrology principles. Find out what the planets
                        have in store for you today.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12 text-center">
                  <div className="right-illus">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac Wheel"
                      width={500}
                      height={500}
                      className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_20s_linear_infinite] opacity-30"
                    />
                    <div className="relative z-10 p-5">
                      <Image
                        src={selectedSign.image}
                        alt={selectedSign.title}
                        width={180}
                        height={180}
                        className="w-[180px] mx-auto drop-shadow-2xl hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChooseYourZodiac />

      {/* Prediction Details */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            {/* Detailed Content */}
            <div className="col-lg-8">
              <div className="light-card border border-[#fd64102b] p-6 p-md-10 shadow-xl h-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[#fd64101a]">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#fd6410] p-3 rounded-4 shadow-lg">
                      <Image
                        src={selectedSign.image}
                        alt={selectedSign.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-[#301118] uppercase tracking-tight m-0">
                        {selectedSign.title} Daily Horoscope
                      </h2>
                      <p className="text-orange-500 font-bold text-xs uppercase tracking-widest m-0">
                        Today&apos;s Cosmic Forecast
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#3011181a] px-4 py-2 rounded-full">
                    <MdOutlineDateRange className="text-[#fd6410]" />
                    <span className="text-xs font-bold text-[#301118]">
                      March 25, 2024
                    </span>
                  </div>
                </div>

                <div className="row g-4">
                  {[
                    {
                      icon: <FaHeart className="text-pink-500" />,
                      lbl: "Love & Relations",
                      bg: "bg-pink-50",
                    },
                    {
                      icon: <FaBriefcase className="text-blue-500" />,
                      lbl: "Career & Finance",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <FaLeaf className="text-green-500" />,
                      lbl: "Health & Wellbeing",
                      bg: "bg-green-50",
                    },
                    {
                      icon: <FaPlane className="text-orange-500" />,
                      lbl: "Travel & Luck",
                      bg: "bg-orange-50",
                    },
                  ].map((cat, i) => (
                    <div key={i} className="col-md-6">
                      <div
                        className={`${cat.bg} p-6 rounded-4 border border-white shadow-sm h-100`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl">{cat.icon}</span>
                          <h4 className="text-sm font-bold text-[#301118] uppercase tracking-wider mb-0">
                            {cat.lbl}
                          </h4>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed italic m-0">
                          A positive alignment of Venus suggests a fulfilling
                          day. Communication with loved ones will be harmonious.
                          Expect a small surprise by evening.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 bg-gray-50 p-8 rounded-4 border border-gray-100 relative overflow-hidden">
                  <HiOutlineSparkles className="absolute -right-4 -bottom-4 text-gray-200 text-9xl opacity-20" />
                  <h3 className="text-xl font-bold mb-4 relative z-10">
                    Cosmic Tip of the Day
                  </h3>
                  <p className="text-gray-500 italic relative z-10 m-0 leading-relaxed">
                    Patience will be your greatest ally today. The Moon is in a
                    complex position, so avoid making hasty decisions in
                    property or legal matters. Wear the color white for mental
                    peace.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar Stats */}
            <div className="col-lg-4">
              <div className="space-y-6">
                <div className="bg-[#301118] text-white p-8 rounded-4 border border-[#fd64102b] shadow-xl">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <StarStats /> Cosmic Indicators
                  </h3>
                  <div className="space-y-5">
                    {[
                      {
                        lbl: "Lucky Number",
                        val: "7",
                        icon: <FaStar className="text-yellow-400" />,
                      },
                      {
                        lbl: "Lucky Color",
                        val: "Royal Blue",
                        icon: (
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        ),
                      },
                      {
                        lbl: "Lucky Day",
                        val: "Thursday",
                        icon: <FaCalendarAlt className="text-blue-400" />,
                      },
                      {
                        lbl: "Best Timing",
                        val: "2:00 PM - 4:00 PM",
                        icon: <FaClock className="text-orange-400" />,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-4 bg-white/5 rounded-3 border border-white/5 hover:bg-white/10 transition-colors"
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

                <div className="light-card border border-[#fd64102b] p-8 shadow-xl">
                  <h4 className="c-1e0b0f font-bold mb-6 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#fd6410]" /> Find Nearby
                    Temple
                  </h4>
                  <p className="text-xs text-gray-500 italic mb-6">
                    Strengthen your planets by visiting your ruling deity.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 ps-10 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter city..."
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" />
                  </div>
                  <button className="btn-link mt-4 w-full text-xs bg-[#fd6410] text-white border-0 py-3 rounded-xl font-bold uppercase tracking-widest">
                    Search Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

const StarStats = () => (
  <div className="flex gap-1">
    {[1, 2, 3].map((s) => (
      <FaStar key={s} className="text-[#fd6410] text-xs" />
    ))}
  </div>
);

export default HoroscopePage;
