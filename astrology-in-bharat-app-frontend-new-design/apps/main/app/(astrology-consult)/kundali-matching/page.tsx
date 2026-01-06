"use client";

import React from "react";
import Image from "next/image";
import {
  FaUserFriends,
  FaHeart,
  FaShieldAlt,
  FaChevronRight,
  FaMars,
  FaVenus,
  FaRegCheckCircle,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineSecurity } from "react-icons/md";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";

const KundaliMatchingPage = () => {
  return (
    <div className="main-wrapper">
      {/* Top Bar Tool Actions - Themed */}
      <div className="bg-[#301118] py-3 text-white border-b border-[#fd64102b]">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-3">
          {[
            { icon: <FaUsers />, label: "My Kundli" },
            { icon: <FaInfoCircle />, label: "Numerology" },
            { icon: <HiOutlineSparkles />, label: "Online Puja" },
            { icon: <FaHeart />, label: "Match Analysis" },
          ].map((tool, i) => (
            <button
              key={i}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider transition-all shadow-lg border-0 ${
                i === 3
                  ? "bg-white text-[#fd6410]"
                  : "bg-[#fd6410] hover:bg-[#e55a0d] text-white"
              }`}
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
                    <span className="aib-trust-badge">Free Service</span>
                    <h1>Kundali Matching</h1>
                    <h4 className="card-title">Find Your Perfect Soulmate</h4>
                    <p>
                      Generate a comprehensive compatibility report based on
                      ancient Vedic Astrology principles (Guna Milan). Enter
                      birth details to understand the mental, physical, and
                      spiritual alignment between partners.
                    </p>
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
                    className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_25s_linear_infinite] opacity-30"
                  />
                  <div className="relative z-10 p-5">
                    <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                      <FaUserFriends className="text-[#fd6410] text-7xl animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Detail Cards Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-4">
            {/* Boy's Details */}
            <div className="col-lg-6">
              <div className="light-card border border-[#fd64102b] p-8 h-100 shadow-xl group">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                    <FaMars size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Boy&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Groom Information
                    </p>
                  </div>
                </div>

                <form className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                      placeholder="Boy's Full Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                      placeholder="Birth Place (City, State)"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Girl's Details */}
            <div className="col-lg-6">
              <div className="light-card border border-[#fd64102b] p-8 h-100 shadow-xl group">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-pink-50 p-3 rounded-full text-pink-500 group-hover:scale-110 transition-transform">
                    <FaVenus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Girl&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Bride Information
                    </p>
                  </div>
                </div>

                <form className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                      placeholder="Girl's Full Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 text-sm shadow-sm"
                      placeholder="Birth Place (City, State)"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn-link py-4 px-12 uppercase tracking-[3px] text-sm font-black shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto border-0">
              Generate Detailed Report{" "}
              <FaChevronRight className="animate-pulse" />
            </button>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <MdOutlineSecurity size={14} className="text-[#fd6410]" /> 100%
              Private & Secure Analysis
            </p>
          </div>
        </div>
      </section>

      {/* Why Guna Milan Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="text-4xl font-bold mb-6">
                Importance of <span className="text-[#fd6410]">Guna Milan</span>
              </h2>
              <p className="text-orange-100/70 mb-8 leading-relaxed italic">
                In Vedic Astrology, matching horoscopes is vital for a happy and
                enduring marriage. The Guna Milan system checks 8 different
                aspects (Ashtakoot) to ensure overall compatibility.
              </p>

              <div className="space-y-4">
                {[
                  "Mental Compatibility (Gana)",
                  "Physical Attraction (Yoni)",
                  "Destiny & Harmony (Bhakoot)",
                  "Progeny & Health (Nadi)",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-4 border border-white/5 transition-all hover:bg-white/10"
                  >
                    <div className="bg-[#fd6410] p-2 rounded-full">
                      <FaRegCheckCircle size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-wide">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white/5 p-10 rounded-[4rem] text-center border-2 border-dashed border-[#fd64103d] relative">
                <div className="absolute top-0 left-0 w-20 h-20 bg-[#fd6410] rounded-full -ml-8 -mt-8 flex items-center justify-center shadow-lg">
                  <FaHeart className="text-white text-3xl animate-pulse" />
                </div>
                <h3 className="text-6xl font-black mb-2 text-[#fd6410]">36</h3>
                <h4 className="text-2xl font-bold mb-6">Total Gunas</h4>
                <div className="space-y-4 text-left border-t border-white/10 pt-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold opacity-60">
                      Excellent
                    </span>
                    <span className="text-sm font-bold text-green-400">
                      25 - 36
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-green-400 w-[80%] h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                  </div>
                  <div className="flex justify-between items-baseline mt-4">
                    <span className="text-sm font-bold opacity-60">Normal</span>
                    <span className="text-sm font-bold text-orange-400">
                      18 - 24
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-orange-400 w-[50%] h-full rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Information Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="light-card border border-[#fd64102b] p-8 text-center h-100 shadow-xl border-b-4 border-b-[#fd6410]">
                <div className="bg-orange-50 w-16 h-16 rounded-4 flex items-center justify-center mx-auto mb-6 text-[#fd6410]">
                  <FaShieldAlt size={30} />
                </div>
                <h4 className="text-lg font-bold mb-3">Vedic Standards</h4>
                <p className="text-xs text-gray-500 leading-relaxed italic m-0">
                  Our calculations follow the authentic Parashara system for
                  highest accuracy.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="light-card border border-[#fd64102b] p-8 text-center h-100 shadow-xl border-b-4 border-b-blue-500">
                <div className="bg-blue-50 w-16 h-16 rounded-4 flex items-center justify-center mx-auto mb-6 text-blue-500">
                  <FaMars size={30} />
                </div>
                <h4 className="text-lg font-bold mb-3">Manglik Check</h4>
                <p className="text-xs text-gray-500 leading-relaxed italic m-0">
                  Deep analysis of Mars position for Dosha detection and
                  remedies.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="light-card border border-[#fd64102b] p-8 text-center h-100 shadow-xl border-b-4 border-b-pink-500">
                <div className="bg-pink-50 w-16 h-16 rounded-4 flex items-center justify-center mx-auto mb-6 text-pink-500">
                  <FaVenus size={30} />
                </div>
                <h4 className="text-lg font-bold mb-3">Love Compatibility</h4>
                <p className="text-xs text-gray-500 leading-relaxed italic m-0">
                  Understand the emotional and psychological bond between both
                  charts.
                </p>
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

export default KundaliMatchingPage;
