"use client";

import React from "react";
import Image from "next/image";
import {
  FaMoon,
  FaHeart,
  FaBriefcase,
  FaUserFriends,
  FaStar,
  FaPhoneAlt,
  FaCheck,
  FaExclamation,
  FaChevronRight,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";
import { ZodiacSignsData } from "@/components/AstrologyServices/homePagaData";

const MoonSignPage = () => {
  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back">
        <div className="container">
          <div className="contant-hero rounded-4 border border-[#fd64102b] shadow-xl">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-12">
                <div className="hero-card">
                  <div className="card-z">
                    <span className="aib-trust-badge">
                      Emotional Intelligence
                    </span>
                    <h1>Moon Sign Details</h1>
                    <h4 className="card-title">
                      Discover Your True Inner Self
                    </h4>
                    <p>
                      In Vedic Astrology, your Moon Sign reveals your emotional
                      landscape, subconscious patterns, and deepest needs. It
                      governs your intuition, vulnerability, and instinctive
                      reactions to the world.
                    </p>
                    <div className="pt-3">
                      <button className="btn-link py-3 px-10 shadow-lg inline-flex w-auto uppercase tracking-widest text-[12px]">
                        Find My Moon Sign{" "}
                        <FaChevronRight className="ms-2" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 text-center">
                <div className="right-illus">
                  <Image
                    src="/images/horoscope-round2.png"
                    alt="Zodiac"
                    width={500}
                    height={500}
                    className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_30s_linear_infinite] opacity-30"
                  />
                  <div className="relative z-10 p-5">
                    <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                      <FaMoon className="text-[#fd6410] text-7xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Select Moon Sign - Zodiac Grid */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] shadow-xl p-8">
            <h2 className="title-line mb-4 text-center">
              <span>Choose Your Moon Sign</span>
            </h2>
            <p className="text-center text-gray-500 italic mb-10">
              Select your sign to explore daily emotional forecast and lunar
              insights.
            </p>

            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4">
              {ZodiacSignsData.map((sign) => (
                <div key={sign.id} className="col">
                  <button className="block h-100 group w-full bg-transparent border-0 p-0 text-left">
                    <div className="bg-white border border-[#fd64101a] rounded-4 p-4 text-center h-100 transition-all hover:-translate-y-2 hover:shadow-xl hover:border-[#fd641054]">
                      <Image
                        src={sign.image}
                        alt={sign.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h3 className="text-sm font-bold text-[#301118] mb-1">
                        {sign.title}
                      </h3>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        {sign.date}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <h2 className="title-line mb-8">
                <span>The Lunar Influence</span>
              </h2>
              <div className="space-y-6">
                <div className="light-card border border-[#fd64102b] p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fd641008] rounded-full -mr-16 -mt-16"></div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <HiOutlineSparkles className="text-orange-400" />
                    How Moon Sign Affects You?
                  </h3>
                  <p className="text-gray-500 italic leading-relaxed mb-6">
                    While the Sun sign defines your personality, the Moon sign
                    reveals your essence. It governs how you feel, how you care
                    for others, and how you find comfort in life.
                  </p>

                  <div className="row g-4">
                    {[
                      {
                        icon: <FaHeart />,
                        lbl: "Emotions",
                        desc: "Your internal mood and emotional reactions.",
                      },
                      {
                        icon: <FaBriefcase />,
                        lbl: "Career Style",
                        desc: "How you handle stress and workspace harmony.",
                      },
                      {
                        icon: <FaUserFriends />,
                        lbl: "Relations",
                        desc: "Your expectations from a partner emotionally.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="col-md-4">
                        <div className="bg-orange-50/50 p-4 rounded-3 border border-orange-100">
                          <div className="text-[#fd6410] mb-2">{item.icon}</div>
                          <h4 className="text-[10px] font-bold uppercase mb-1">
                            {item.lbl}
                          </h4>
                          <p className="text-[9px] text-gray-400 m-0 leading-tight">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="bg-[#301118] text-white p-8 rounded-4 shadow-2xl relative overflow-hidden h-100 flex flex-col justify-center border border-[#fd64102b]">
                <FaStar className="absolute top-8 right-8 text-[#fd641054] text-4xl animate-pulse" />
                <h3 className="text-2xl font-bold mb-6 font-display">
                  Precise Lunar Chart Analysis
                </h3>
                <div className="space-y-4 mb-8">
                  {[
                    "Understand your Nakshatra",
                    "Auspicious timings based on Moon",
                    "Emotional compatibility check",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#fd6410] rounded-full flex items-center justify-center shrink-0">
                        <FaCheck size={8} />
                      </div>
                      <span className="text-sm text-orange-50 italic">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white/5 rounded-3 border border-white/10 mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <FaExclamation className="text-orange-400" size={12} />
                    <h4 className="text-[10px] font-bold uppercase text-orange-400">
                      Did you know?
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-400 italic m-0">
                    The moon changes signs every 2.5 days, making its impact on
                    your daily mood more dynamic than your sun sign.
                  </p>
                </div>
                <button className="btn-link bg-[#fd6410] text-white py-4 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-3 w-full border-0 font-bold uppercase tracking-widest text-xs">
                  <FaPhoneAlt /> Call Expert Astrologer
                </button>
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

export default MoonSignPage;
