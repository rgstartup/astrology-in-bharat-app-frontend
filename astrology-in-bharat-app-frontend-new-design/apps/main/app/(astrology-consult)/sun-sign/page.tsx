"use client";
import React, { useState } from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaUser as FaU,
  FaHeart as FaH,
  FaBriefcase as FaB,
  FaHospital as FaHos,
  FaCheck as FaC,
  FaTimes as FaT,
  FaDice as FaD,
  FaPalette as FaP,
  FaCalendarAlt as FaCa,
  FaGem as FaG,
  FaChartBar as FaCb,
  FaArrowRight as FaAr,
} from "react-icons/fa";
const FaUser = FaU as any;
const FaHeart = FaH as any;
const FaBriefcase = FaB as any;
const FaHospital = FaHos as any;
const FaCheck = FaC as any;
const FaTimes = FaT as any;
const FaDice = FaD as any;
const FaPalette = FaP as any;
const FaCalendarAlt = FaCa as any;
const FaGem = FaG as any;
const FaChartBar = FaCb as any;
const FaArrowRight = FaAr as any;

import { TbCrystalBall as TbCb } from "react-icons/tb";
const TbCrystalBall = TbCb as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";

const SunSignPage = () => {
  const [selectedSign, setSelectedSign] = useState(ZodiacSignsData[0]);

  if (!selectedSign) return null;

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back pb-0">
        <div className="container">
          <div className="contant-hero mb-0 rounded-b-none border-b-0">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-12">
                <div className="hero-card">
                  <div className="card-z">
                    <span className="aib-trust-badge">
                      Zodiac Knowledge Base
                    </span>
                    <h1>Sun Sign Details</h1>
                    <h4 className="card-title">
                      Discover the Secrets of Your Personality
                    </h4>
                    <p>
                      Explore the cosmic lens of your sun sign to understand
                      your true self, your relationships, and your destiny. Each
                      sign carries unique energies that shape who you are.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {["Personality", "Love", "Career", "Health"].map(
                        (trait) => (
                          <span
                            key={trait}
                            className="bg-[#fde6d3] text-[#c45a13] text-[12px] font-bold px-4 py-2 rounded-full uppercase tracking-wider"
                          >
                            {trait}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 text-center">
                <div className="right-illus py-10">
                  <Image
                    src="/images/horoscope-round2.png"
                    alt="Zodiac Wheel"
                    width={500}
                    height={500}
                    className="w-[80%] mx-auto animate-[spin_20s_linear_infinite] absolute z-0 left-[10%] top-0 opacity-20"
                  />
                  <Image
                    src={selectedSign.image}
                    alt={selectedSign.title}
                    width={200}
                    height={200}
                    className="relative z-10 w-[200px] h-[200px] object-contain mx-auto drop-shadow-2xl transition-all duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zodiac Selection Slider - Matching ChooseYourZodiac style */}
      <section className="bg-white border-y border-[#fd64102b] py-4 sticky top-[70px] z-40 shadow-sm">
        <div className="container">
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide snap-x items-center px-4">
            {ZodiacSignsData.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className={`snap-center shrink-0 flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-xl border bg-transparent ${
                  selectedSign.id === sign.id
                    ? "border-[#fd6410] bg-[#fff5ef] scale-105 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ minWidth: "100px" }}
              >
                <Image
                  src={sign.image}
                  alt={sign.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {sign.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="light-card p-4 p-md-5 border border-[#fd64102b] shadow-xl">
                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-100">
                  <div className="bg-[#fd64101a] p-4 rounded-4">
                    <Image
                      src={selectedSign.image}
                      alt={selectedSign.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-[#301118] uppercase tracking-tight mb-1">
                      {selectedSign.title}
                    </h2>
                    <p className="text-[#fd6410] font-bold text-sm tracking-[0.2em] uppercase">
                      The {selectedSign.nature} Sign
                    </p>
                  </div>
                </div>

                {/* Characteristics Grid */}
                <div className="row g-4 mb-10">
                  {[
                    {
                      icon: <FaUser className="text-blue-500" />,
                      label: "Personality",
                      text: "Strong, ambitious and determined individuals with a natural spark for leadership.",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <FaHeart className="text-pink-500" />,
                      label: "Love & Relations",
                      text: "Passionate and loyal partners who seek deep emotional connections.",
                      bg: "bg-pink-50",
                    },
                    {
                      icon: <FaBriefcase className="text-orange-500" />,
                      label: "Career",
                      text: "Excel in creative and structured environments where their skills are valued.",
                      bg: "bg-orange-50",
                    },
                    {
                      icon: <FaHospital className="text-green-500" />,
                      label: "Health",
                      text: "Generally strong constitution but need to maintain balance in routines.",
                      bg: "bg-green-50",
                    },
                  ].map((feat, i) => (
                    <div key={i} className="col-md-6">
                      <div
                        className={`${feat.bg} p-6 rounded-4 border border-white h-100 flex gap-4`}
                      >
                        <div className="text-2xl mt-1">{feat.icon}</div>
                        <div>
                          <h4 className="text-sm font-bold text-[#301118] uppercase mb-1">
                            {feat.label}
                          </h4>
                          <p className="text-gray-500 text-xs leading-relaxed italic m-0">
                            {feat.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Extra Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-100 p-8 rounded-4 relative overflow-hidden">
                    <TbCrystalBall className="absolute -right-4 -bottom-4 text-gray-200 text-9xl opacity-20" />
                    <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                      <div className="w-1 h-6 bg-[#fd6410] rounded-full"></div>
                      Vedic Perspective
                    </h3>
                    <p className="text-gray-500 italic relative z-10 leading-relaxed mb-0">
                      In Vedic astrology, the Sun represents the Soul, the King,
                      and the Father. Your sun sign placement determines the
                      inner light and core vitality you bring to the world.
                      Analysis of {selectedSign.title}&apos;s ruling planet and
                      element provides deep insight into your spiritual purpose.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="col-lg-4">
              <div className="space-y-6">
                <div className="bg-[#301118] text-white p-8 rounded-4 border border-[#fd64102b] shadow-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <FaChartBar className="text-[#fd6410]" /> Key Attributes
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: <FaPalette />,
                        label: "Lucky Color",
                        val: "Golden & Red",
                      },
                      {
                        icon: <FaDice />,
                        label: "Lucky No.",
                        val: "1, 5, 9",
                      },
                      {
                        icon: <FaGem />,
                        label: "Stone",
                        val: "Ruby / Amber",
                      },
                      {
                        icon: <FaCalendarAlt />,
                        label: "Lucky Day",
                        val: "Sunday",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white/5 p-4 rounded-3 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-orange-400">{stat.icon}</span>
                          <span className="text-[10px] font-bold uppercase text-gray-400">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-orange-200">
                          {stat.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="light-card p-8 bg-orange-50 border border-orange-100 rounded-4">
                  <h4 className="text-[#301118] font-black uppercase tracking-wider text-sm mb-4">
                    compatibility
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <FaCheck size={10} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 italic">
                        Best With: Leo, Sagittarius, Aries
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full">
                        <FaTimes size={10} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 italic">
                        Challenge With: Scorpio, Aquarius
                      </span>
                    </div>
                  </div>
                  <button className="btn-link mt-8 w-full flex items-center justify-center gap-4 text-xs bg-[#fd6410] text-white rounded-xl border-0 font-bold uppercase tracking-widest">
                    View Full Compatibility <FaArrowRight />
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

export default SunSignPage;
