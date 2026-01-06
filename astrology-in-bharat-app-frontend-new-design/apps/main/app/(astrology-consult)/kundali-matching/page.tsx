"use client";

import React from "react";
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider transition-all shadow-lg ${i === 3 ? "bg-white text-[#fd6410]" : "bg-[#fd6410] hover:bg-[#e55a0d] text-white"}`}
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
                  <img
                    src="/images/horoscope-round2.png"
                    alt="Zodiac"
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
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter city name"
                    />
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      placeholder="Enter city name"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="btn-link py-4 px-12 shadow-lg inline-flex w-auto hover:scale-105 transition-transform">
              Check Compatibility Now{" "}
              <FaChevronRight className="ms-2" size={12} />
            </button>
            <div className="mt-4 flex justify-center items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <MdOutlineSecurity className="text-primary text-base" />
              100% Private & Secure Analysis
            </div>
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <h2 className="title-line color-light mb-10 text-center">
            <span>Why Vedic Matching Matters?</span>
          </h2>
          <div className="row g-4">
            {[
              {
                title: "Guna Milan",
                icon: <FaHeart />,
                color: "bg-red-500",
                desc: "Assesses mental and emotional wavelength between partners using the 36-point system.",
              },
              {
                title: "Dosha Analysis",
                icon: <FaShieldAlt />,
                color: "bg-orange-500",
                desc: "Identifies Manglik and Nadi Doshas that could impact health, longevity, and prosperity.",
              },
              {
                title: "Growth & Progeny",
                icon: <FaUserFriends />,
                color: "bg-green-500",
                desc: "Predicts the potential for family growth, financial stability, and mutual respect.",
              },
            ].map((item, i) => (
              <div key={i} className="col-md-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-4 text-center h-100 hover:bg-white/10 transition-all">
                  <div
                    className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg`}
                  >
                    {item.icon}
                  </div>
                  <h4 className="font-bold mb-4">{item.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed px-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ashtakoota Knowledge Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] p-8 md:p-16 shadow-2xl">
            <div className="row g-5 align-items-center">
              <div className="col-lg-7">
                <h2 className="text-3xl font-bold text-[#301118] mb-6">
                  Understanding the 36 Gunas
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Vedic astrology evaluates 8 distinct categories (Ashtakoota)
                  for marriage compatibility. Each category has specific points
                  (Gunas) assigned to it, totaling 36. A score above 18 is
                  generally considered positive for a harmonious union.
                </p>
                <div className="row g-3">
                  {[
                    { name: "Varna", p: "Work / Ego", pts: "1" },
                    { name: "Vashya", p: "Dominance", pts: "2" },
                    { name: "Tara", p: "Destiny/Luck", pts: "3" },
                    { name: "Yoni", p: "Intimacy", pts: "4" },
                    { name: "Maitri", p: "Friendship", pts: "5" },
                    { name: "Gana", p: "Temperament", pts: "6" },
                  ].map((g, i) => (
                    <div key={i} className="col-md-6">
                      <div className="flex items-center gap-3 bg-white border border-[#fd64101a] p-3 rounded-3 shadow-sm">
                        <FaRegCheckCircle className="text-green-500" />
                        <div className="flex-1">
                          <div className="font-bold text-sm text-[#301118]">
                            {g.name}{" "}
                            <span className="text-[10px] text-gray-400 font-normal">
                              ({g.p})
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-[#fd6410]">
                          {g.pts} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-5 text-center">
                <div className="p-5 bg-[#fff5ef] border-2 border-dashed border-[#fd641054] rounded-[50px] relative overflow-hidden">
                  <HiOutlineSparkles
                    size={100}
                    className="text-[#fd6410] opacity-10 absolute -top-5 -right-5"
                  />
                  <div className="relative z-10 py-10">
                    <HiOutlineSparkles
                      size={80}
                      className="text-[#fd6410] mx-auto mb-6 animate-pulse"
                    />
                    <h3 className="font-bold text-[#301118] text-4xl">
                      Divine Match
                    </h3>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[12px] mt-2">
                      Certified Vedic Analysis
                    </p>
                  </div>
                </div>
              </div>
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

export default KundaliMatchingPage;
