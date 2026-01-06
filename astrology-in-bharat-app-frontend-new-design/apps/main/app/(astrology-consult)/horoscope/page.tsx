"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaBriefcase,
  FaLeaf,
  FaPlane,
  FaBookOpen,
  FaCalculator,
  FaPray,
  FaInfinity,
  FaRegHeart,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";
import { ZodiacSignsData } from "@/data/homePagaData";

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState(ZodiacSignsData[0]);

  return (
    <div className="main-wrapper">
      {/* Top Bar Tool Actions - Themed */}
      <div className="bg-[#301118] py-3 text-white border-b border-[#fd64102b]">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-3">
          {[
            { icon: <FaBookOpen />, label: "My Kundli" },
            { icon: <FaCalculator />, label: "Numerology" },
            { icon: <FaPray />, label: "Online Puja" },
            { icon: <FaInfinity />, label: "Life Horoscope" },
            { icon: <FaRegHeart />, label: "Love Report" },
          ].map((tool, i) => (
            <button
              key={i}
              className="flex items-center gap-2 bg-[#fd6410] hover:bg-[#e55a0d] px-4 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider transition-all shadow-lg"
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="banner-part light-back">
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
                      Vedic Astrology principles. Find out what the planets have
                      in store for you today.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 text-center">
                <div className="right-illus">
                  <img
                    src="/images/horoscope-round2.png"
                    alt="Zodiac Wheel"
                    className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_20s_linear_infinite] opacity-30"
                  />
                  <div className="relative z-10 p-5">
                    <img
                      src={selectedSign.image}
                      alt={selectedSign.title}
                      className="w-[180px] mx-auto drop-shadow-2xl hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zodiac Grid Selection */}
      <section className="space-section light-back pt-0">
        <div className="container">
          <div className="light-card border border-[#fd64102b]">
            <h2 className="title-line c-1e0b0f mb-5 text-center">
              <span>Choose Your Zodiac Sign</span>
            </h2>
            <div className="row g-3">
              {ZodiacSignsData.map((sign) => (
                <div key={sign.id} className="col-6 col-md-4 col-lg-2">
                  <div
                    onClick={() => setSelectedSign(sign)}
                    className={`p-4 rounded-4 text-center cursor-pointer transition-all border ${
                      selectedSign.id === sign.id
                        ? "bg-[#fff5ef] border-[#fd6410] shadow-md scale-105"
                        : "bg-white border-gray-100 hover:border-[#fd641054] hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={sign.image}
                      alt={sign.title}
                      className="w-16 h-16 mx-auto mb-2 object-contain"
                    />
                    <h5 className="font-bold text-sm mb-0 text-[#301118]">
                      {sign.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase leading-none">
                      {sign.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Horoscope Details and Stats */}
      <section className="space-section light-back py-0 pb-10">
        <div className="container">
          <div className="row g-4 items-start">
            {/* Sidebar Form */}
            <aside className="col-lg-4">
              <div className="light-card border border-[#fd64102b] sticky top-[100px]">
                <h3 className="text-xl font-bold text-[#301118] mb-6 flex items-center gap-2 border-b pb-3">
                  <div className="bg-[#fd6410] p-1.5 rounded-lg text-white">
                    <FaUser size={18} />
                  </div>
                  Get Personal Reading
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2.5 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-2.5 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-2.5 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Birth City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-control rounded-3 py-2.5 border-0 shadow-sm bg-gray-50"
                        placeholder="Search city..."
                      />
                      <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <button type="submit" className="btn-link w-100 py-3 mt-4">
                    Generate Horoscope
                  </button>
                </form>
              </div>
            </aside>

            {/* Prediction Area */}
            <main className="col-lg-8">
              {/* Timeperiod Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#f7f3ec] rounded-4 w-fit">
                {["Daily", "Weekly", "Monthly", "Yearly 2026"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-6 py-2.5 rounded-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      i === 0
                        ? "bg-[#301118] text-white shadow-lg"
                        : "text-gray-500 hover:bg-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Horoscope Result Head */}
              <div className="light-card border border-[#fd64102b] bg-[#fffcf8] mb-4 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-28 h-28 bg-white border border-[#daa23e54] rounded-4 p-3 shadow-sm flex-shrink-0">
                  <img
                    src={selectedSign.image}
                    alt={selectedSign.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#301118] mb-1">
                    {selectedSign.title} Daily Reading
                  </h3>
                  <p className="text-[#fd6410] font-bold text-sm mb-3">
                    Tuesday, 06 January 2026
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-0">
                    The celestial alignment today favors growth and new
                    beginnings for {selectedSign.title}. Expect a surge of
                    positive energy that will help you tackle long-standing
                    tasks.
                  </p>
                </div>
              </div>

              {/* Detailed Cards */}
              <div className="row g-4 mb-6">
                {[
                  {
                    title: "Love Life",
                    icon: <FaHeart />,
                    color: "border-pink-400",
                    bg: "bg-pink-50",
                    score: 85,
                  },
                  {
                    title: "Career Path",
                    icon: <FaBriefcase />,
                    color: "border-blue-400",
                    bg: "bg-blue-50",
                    score: 92,
                  },
                  {
                    title: "Health Status",
                    icon: <FaLeaf />,
                    color: "border-green-400",
                    bg: "bg-green-50",
                    score: 78,
                  },
                  {
                    title: "Travel Luck",
                    icon: <FaPlane />,
                    color: "border-purple-400",
                    bg: "bg-purple-50",
                    score: 64,
                  },
                ].map((card, i) => (
                  <div key={i} className="col-md-6">
                    <div
                      className={`light-card border-0 border-l-4 ${card.color} h-100 shadow-sm p-4`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl opacity-80">{card.icon}</span>
                        <h5 className="font-bold text-[#301118] mb-0">
                          {card.title}
                        </h5>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        The planetary positions suggest a favorable phase. Focus
                        on communication to improve connections.
                      </p>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">
                          Cosmic Score
                        </span>
                        <span className="text-xs font-bold text-[#301118]">
                          {card.score}%
                        </span>
                      </div>
                      <div className="progress h-1 border-0 rounded-full bg-gray-100">
                        <div
                          className="progress-bar rounded-pill"
                          style={{
                            width: `${card.score}%`,
                            backgroundColor: "#fd6410",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lucky Stats Bottom */}
              <div className="bg-[#301118] rounded-4 p-6 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-5 opacity-5">
                  <FaStar size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-6">
                    <HiOutlineSparkles className="text-[#fd6410]" />{" "}
                    Today&apos;s Lucky Points
                  </h4>
                  <div className="row g-3">
                    {[
                      { l: "Color", v: "Royal Blue" },
                      { l: "Number", v: "7, 21" },
                      { l: "Alphabet", v: "R, S" },
                      { l: "Mood", v: "Ambitious" },
                    ].map((p, i) => (
                      <div key={i} className="col-6 col-md-3">
                        <div className="bg-white/10 border border-white/5 rounded-3 p-3 text-center">
                          <div className="text-[9px] text-gray-400 uppercase font-bold mb-1">
                            {p.l}
                          </div>
                          <div className="text-sm font-bold">{p.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default HoroscopePage;
