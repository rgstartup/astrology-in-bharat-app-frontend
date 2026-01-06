"use client";

import React from "react";
import {
  FaUserFriends,
  FaHeart,
  FaBrain,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronRight,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";

const NakshatraMilanPage = () => {
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
                      Vedic Compatibility Analysis
                    </span>
                    <h1>Nakshatra Milan</h1>
                    <h4 className="card-title">Meld Your Destinies Together</h4>
                    <p>
                      Analyze the compatibility between partners based on birth
                      stars. This ancient method evaluates relationship harmony
                      and long-term stability.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 text-center">
                <div className="right-illus">
                  <img
                    src="/images/horoscope-round2.png"
                    alt="Zodiac"
                    className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_30s_linear_infinite] opacity-30"
                  />
                  <div className="relative z-10 p-5">
                    <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                      <FaHeart className="text-[#fd6410] text-7xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Form */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fd6410] via-yellow-400 to-[#fd6410]"></div>

            <div className="row g-5">
              {/* Boy's Details */}
              <div className="col-lg-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 text-blue-500 p-3 rounded-full shadow-sm">
                    <FaUserFriends size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#301118] mb-0">
                    Boy&apos;s Details
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" />
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm ps-10"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Girl's Details */}
              <div className="col-lg-6 border-start border-[#fd64101a] ps-lg-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pink-50 text-pink-500 p-3 rounded-full shadow-sm">
                    <FaUserFriends size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#301118] mb-0">
                    Girl&apos;s Details
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" />
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 bg-gray-50 shadow-sm ps-10"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 pb-4">
              <button className="btn-link py-4 px-16 shadow-xl uppercase tracking-widest text-sm font-bold inline-flex w-auto">
                Match Nakshatras Now{" "}
                <FaChevronRight className="ms-2" size={10} />
              </button>
              <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Privacy Protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Why Check Nakshatra Compatibility?
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed italic">
                <p>
                  In Vedic Astrology, Nakshatras (lunar mansions) determine the
                  mental and emotional compatibility between two individuals.
                  While Rashi matching is popular, Nakshatra Matching goes
                  deeper into the subconscious nature.
                </p>
                <p>
                  Our tool evaluates Nadi Dosha, Bhakoot Dosha, and Gana Dosha,
                  providing a score out of 36 points (Gunas).
                </p>
              </div>

              <div className="row g-4 mt-8">
                <div className="col-sm-6">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                    <div className="bg-white p-3 rounded-3 text-[#301118]">
                      <FaBrain size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">
                        Mental Chemistry
                      </h4>
                      <p className="text-[11px] text-gray-400 italic mb-0">
                        Understands thought processes and emotional bonding.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                    <div className="bg-white p-3 rounded-3 text-[#301118]">
                      <MdOutlineHealthAndSafety size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">
                        Health & Progeny
                      </h4>
                      <p className="text-[11px] text-gray-400 italic mb-0">
                        Checking for Nadi Dosha affecting long-term health.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="light-card border-0 bg-white p-8 md:p-12 text-center rounded-4 shadow-2xl">
                <div className="bg-[#fd6410] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <HiOutlineSparkles className="text-white" size={30} />
                </div>
                <h3 className="text-2xl font-bold text-[#301118] mb-4">
                  Expert Analysis
                </h3>
                <p className="text-gray-500 text-sm mb-8 italic">
                  Softwares are great, but experts provide personalized remedies
                  for deep-seated Doshas.
                </p>
                <button className="btn-link py-3 px-10">
                  Talk to Astrologer
                </button>
                <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  Starting at ₹25/min
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-section light-back">
        <div className="container">
          <h2 className="title-line text-center mb-12">
            <span>Common Compatibility Queries</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              "What is a good Nakshatra Matching score?",
              "Can Nakshatra Milan predict a happy marriage?",
              "How serious is Nadi Dosha in matching?",
              "What are the remedies for Gana Dosha?",
            ].map((q, i) => (
              <div
                key={i}
                className="light-card border border-[#fd64101a] p-4 flex justify-between items-center group cursor-pointer hover:bg-white transition-all"
              >
                <span className="text-sm font-bold text-[#301118]">{q}</span>
                <FaChevronDown className="text-gray-300 group-hover:text-[#fd6410] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default NakshatraMilanPage;
