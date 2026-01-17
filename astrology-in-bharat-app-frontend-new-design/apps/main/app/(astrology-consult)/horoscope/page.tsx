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
} from "react-icons/fa";
const FaCalendarAlt = FaC as any;
const FaClock = FaCl as any;
const FaMapMarkerAlt = FaM as any;
const FaStar = FaS as any;
const FaHeart = FaH as any;
const FaBriefcase = FaB as any;
const FaLeaf = FaL as any;
const FaPlane = FaP as any;

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
            <div className="contant-hero">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card shine">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        Free Daily Horoscope Predictions
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
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Daily, Weekly &
                          Monthly Predictions
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Personalized
                          Zodiac Readings
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Ancient Vedic
                          Astrology Wisdom
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Love, Career &
                          Health Insights
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Trusted by
                          50,000+ Users Daily
                        </li>
                      </ul>
                      <button className="btn-link wfc mt-4 mb-4">
                        Explore Your Horoscope
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="right-illus relative h-[400px]">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac Wheel"
                      fill
                      className="Astrologer-img-h fa-spin object-contain opacity-30"
                    />
                    <Image
                      src={selectedSign.image}
                      alt={selectedSign.title}
                      fill
                      className="Astrologer-img object-contain"
                    />
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
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="light-card p-4 p-md-5 border border-[#fd64102b] shadow-xl rounded-4">
                <div className="flex items-center gap-6 mb-4 pb-6 border-b border-gray-100">
                  <div className="bg-[#fd64101a] p-3 rounded-4">
                    <Image
                      src={selectedSign.image}
                      alt={selectedSign.title}
                      width={60}
                      height={60}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-[#301118] uppercase tracking-tight mb-1">
                      {selectedSign.title} Daily Horoscope
                    </h2>
                    <p className="text-[#fd6410] font-bold text-sm tracking-[0.2em] uppercase">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Characteristics Grid */}
                <div className="row g-4 mb-10">
                  {[
                    {
                      icon: <FaHeart className="text-pink-500" />,
                      label: "Love & Relations",
                      text: "Venus aligns beautifully today, bringing warmth to your relationships. Deep conversations with loved ones will strengthen bonds. Single? A chance encounter may spark something special.",
                      bg: "bg-pink-50",
                    },
                    {
                      icon: <FaBriefcase className="text-blue-500" />,
                      label: "Career & Finance",
                      text: "Mercury's position favors professional growth. An opportunity for advancement may present itself. Stay confident in negotiations and trust your instincts with financial decisions.",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <FaLeaf className="text-green-500" />,
                      label: "Health & Wellbeing",
                      text: "Your energy levels are high today. This is an excellent time for physical activities or starting a new wellness routine. Stay hydrated and maintain balance in all things.",
                      bg: "bg-green-50",
                    },
                    {
                      icon: <FaPlane className="text-orange-500" />,
                      label: "Travel & Luck",
                      text: "Jupiter brings fortunate opportunities, especially in travel or learning. Short trips will be rewarding. Lady Luck is on your side – consider trying something new today!",
                      bg: "bg-orange-50",
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
                          <p className="text-gray-800 text-xs leading-relaxed italic m-0">
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
                    <HiOutlineSparkles className="absolute -right-4 -bottom-4 text-gray-200 text-9xl opacity-20" />
                    <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                      <div className="w-1 h-6 bg-[#fd6410] rounded-full"></div>
                      Cosmic Tip of the Day
                    </h3>
                    <p className="text-gray-500 italic relative z-10 leading-relaxed mb-0">
                      Patience will be your greatest ally today. The Moon is in
                      a complex position, so avoid making hasty decisions in
                      property or legal matters. Wear the color{" "}
                      <strong className="text-[#fd6410]">white</strong> for
                      mental peace and meditate for 10 minutes to align your
                      energies.
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
                    <FaStar className="text-[#fd6410]" /> Cosmic Indicators
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: <FaStar />,
                        label: "Lucky Number",
                        val: "7",
                      },
                      {
                        icon: (
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        ),
                        label: "Lucky Color",
                        val: "Royal Blue",
                      },
                      {
                        icon: <FaCalendarAlt />,
                        label: "Lucky Day",
                        val: "Thursday",
                      },
                      {
                        icon: <FaClock />,
                        label: "Best Timing",
                        val: "2:00 PM - 4:00 PM",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white/5 p-4 rounded-3 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-orange-400">{stat.icon}</span>
                          <span className="text-[10px] font-semibold uppercase text-gray-200">
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
                  <h4 className="text-[#301118] font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#fd6410]" /> Find Nearby
                    Temple
                  </h4>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    Strengthen your planetary influences by visiting your ruling
                    deity. Discover sacred temples near you.
                  </p>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 ps-10 border shadow-sm bg-white"
                      placeholder="Enter your city..."
                    />
                    {/* <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" /> */}
                  </div>
                  <button className="btn-link w-full text-xs bg-[#fd6410] text-white border-0 py-3 rounded-xl font-bold uppercase tracking-widest">
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

export default HoroscopePage;
