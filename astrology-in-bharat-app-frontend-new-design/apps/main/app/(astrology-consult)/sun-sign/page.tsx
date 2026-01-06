"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaHeart,
  FaBriefcase,
  FaHospital,
  FaCheck,
  FaTimes,
  FaDice,
  FaPalette,
  FaCalendarAlt,
  FaGem,
  FaChartBar,
  FaArrowRight,
} from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";
import { ZodiacSignsData } from "@/data/homePagaData";

const SunSignPage = () => {
  const [selectedSign, setSelectedSign] = useState(ZodiacSignsData[0]);

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
                  <img
                    src="/images/horoscope-round2.png"
                    alt="Zodiac Wheel"
                    className="w-[80%] mx-auto animate-[spin_20s_linear_infinite] absolute z-0 left-[10%] top-0 opacity-20"
                  />
                  <img
                    src={selectedSign.image}
                    alt={selectedSign.title}
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
              <div
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className={`snap-center shrink-0 flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
                  selectedSign.id === sign.id
                    ? "border-[#fd6410] bg-[#fff5ef] scale-105 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ minWidth: "100px" }}
              >
                <img
                  src={sign.image}
                  alt={sign.title}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    selectedSign.id === sign.id
                      ? "text-[#fd6410]"
                      : "text-[#1e0b0f]"
                  }`}
                >
                  {sign.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row">
            {/* Left Column - Detailed Content */}
            <div className="col-lg-8">
              <div className="light-card mb-4 border border-[#fd64102b]">
                <h2 className="title-line c-1e0b0f">
                  <span>{selectedSign.title} Overview</span>
                </h2>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 rounded-3xl bg-[#fff8e7] flex items-center justify-center border border-[#daa23e73] shadow-lg flex-shrink-0">
                    <img
                      src={selectedSign.image}
                      alt={selectedSign.title}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#301118] mb-2">
                      {selectedSign.title} ({selectedSign.date})
                    </h3>
                    <p className="text-[#1a1a1a] leading-relaxed mb-4">
                      {selectedSign.title} is known for its unique planetary
                      influences. Those born under this sign possess distinctive
                      personality traits that define their path in life, love,
                      and career. Understanding these cosmic vibrations can help
                      you navigate life with greater clarity.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Determined", "Intuitive", "Passionate", "Strong"].map(
                        (t) => (
                          <span
                            key={t}
                            className="bg-[#edeef1] text-[#301118] text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider"
                          >
                            {t}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Traits Grid */}
              <div className="row mb-4">
                <div className="col-md-6 mb-4 mb-md-0">
                  <div className="light-card h-100 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4">
                      <FaCheck /> Positive Traits
                    </h4>
                    <ul className="list-check p-0">
                      <li className="text-sm py-2">
                        Adventurous and energetic
                      </li>
                      <li className="text-sm py-2">
                        Pioneering and courageous
                      </li>
                      <li className="text-sm py-2">
                        Enthusiastic and confident
                      </li>
                      <li className="text-sm py-2">Dynamic and quick-witted</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="light-card h-100 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
                      <FaTimes /> Challenge Areas
                    </h4>
                    <ul className="list-check p-0">
                      <li className="text-sm py-2">Impulsive and impatient</li>
                      <li className="text-sm py-2">Quick-tempered at times</li>
                      <li className="text-sm py-2">
                        Occasional over-confidence
                      </li>
                      <li className="text-sm py-2">Resistance to delays</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Deep Dive Content */}
              <div className="light-card border border-[#fd64102b] mb-4">
                <h3 className="text-xl font-bold text-[#301118] mb-4">
                  A Deep Dive into {selectedSign.title}
                </h3>
                <div className="text-[#1a1a1a] space-y-4">
                  <p>
                    Astrology provides a profound roadmap for personal growth.
                    For {selectedSign.title}, the planetary alignment suggests a
                    journey of self-discovery through action and contemplation.
                    By leveraging your natural strengths, you can overcome any
                    obstacle that life throws your way.
                  </p>
                  <p>
                    In social settings, you shine as a beacon of your
                    sign&apos;s best qualities. Whether it&apos;s leading a team
                    or supporting a loved one, your {selectedSign.title}
                    energy is unmistakable and powerful.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              {/* Lucky Factors Card */}
              <div className="light-card mb-4 border border-[#fd64102b]">
                <h3 className="text-lg font-bold text-[#301118] mb-4 border-b pb-2">
                  Lucky Factors
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Numbers",
                      value: "9, 18, 27",
                      icon: <FaDice className="text-[#fd6410]" />,
                    },
                    {
                      label: "Colors",
                      value: "Red, Scarlet",
                      icon: <FaPalette className="text-[#fd6410]" />,
                    },
                    {
                      label: "Day",
                      value: "Tuesday",
                      icon: <FaCalendarAlt className="text-[#fd6410]" />,
                    },
                    {
                      label: "Stone",
                      value: "Red Coral",
                      icon: <FaGem className="text-[#fd6410]" />,
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        {f.icon}
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {f.label}
                        </span>
                      </div>
                      <span className="font-bold text-[#301118]">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Reports Sidebar CTA */}
              <div className="bg-[#301118] p-6 rounded-[20px] text-white mb-4 shadow-xl">
                <h4 className="text-xl font-bold mb-3">
                  Get Your Personal Report
                </h4>
                <p className="text-sm text-gray-300 mb-6">
                  Our expert astrologers can provide deep insights into your
                  destiny based on your exact birth details.
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Love Life Report", icon: <FaHeart /> },
                    { title: "Career Forecast", icon: <FaChartBar /> },
                    { title: "Life Guidance", icon: <TbCrystalBall /> },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/5 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#fd6410]">{s.icon}</span>
                        <span className="font-semibold text-sm">{s.title}</span>
                      </div>
                      <FaArrowRight className="text-xs opacity-50 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Consultation Button */}
              <a href="#" className="btn-link shadow-lg py-4">
                Consult with Expert Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default SunSignPage;
