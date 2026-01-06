"use client";

import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartBroken,
  FaChartLine,
  FaHospital,
  FaUser,
  FaComments,
  FaPhoneAlt,
  FaCheck,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineStar } from "react-icons/md";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";

const MangalDoshaPage = () => {
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
                      Vedic Astrology Calculator
                    </span>
                    <h1>Mangal Dosha Analysis</h1>
                    <h4 className="card-title">
                      Discover & Neutralize Mars Affliction
                    </h4>
                    <p>
                      Get accurate analysis of Mangal Dosha (Mars Affliction) in
                      your birth chart. Understand its impact on marriage,
                      career, and life stability with effective Vedic remedies.
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
                      <FaExclamationTriangle className="text-[#fd6410] text-7xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            {/* Form Area */}
            <div className="col-lg-7">
              <div className="light-card border border-[#fd64102b] p-8 md:p-10 shadow-2xl h-100">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-[#fd6410] text-white p-3 rounded-3 shadow-lg">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Enter Birth Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Free Personal Analysis
                    </p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Gender
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm bg-gray-50 text-sm">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Am/Pm
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm bg-gray-50 text-sm">
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" />
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50 ps-10"
                        placeholder="Enter city name"
                      />
                    </div>
                  </div>
                  <button className="btn-link py-4 mt-6 uppercase tracking-widest text-[12px] font-bold">
                    Analyze Mangal Dosha Now{" "}
                    <FaChevronRight className="ms-2" size={10} />
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="col-lg-5">
              <div className="space-y-6">
                <div className="rounded-4 overflow-hidden relative h-64 group shadow-xl border border-[#fd64102b]">
                  <img
                    src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
                    alt="Meditation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 h-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#301118] to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white mb-2">
                      What is Mangal Dosha?
                    </h3>
                    <p className="text-sm text-gray-200 italic mb-0">
                      Occurs when Mars occupies 1st, 4th, 7th, 8th or 12th house
                      in birth chart.
                    </p>
                  </div>
                </div>

                <div className="light-card border border-[#fd64102b] p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-[#301118] mb-4 border-b border-[#fd64101a] pb-2">
                    Why Analyze Now?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Check marriage compatibility issues.",
                      "Find effective Vedic remedies.",
                      "Clarity on career hurdles.",
                      "Plan auspicious life events.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheck className="text-green-500 mt-1" size={12} />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="text-3xl font-bold mb-6">
                Effects of Mangal Dosha
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed italic">
                <p>
                  In Vedic Astrology, Mars represents drive, ego, and energy.
                  When malefic, it creates Mangal Dosha, potentially causing
                  disharmony in married life if both partners aren&apos;t
                  aligned.
                </p>
                <p>
                  However, various cancellations (Mangal Dosha Bhanga) exist.
                  Our advanced calculator checks these exceptions before giving
                  a final verdict.
                </p>
              </div>
              <button className="btn-link py-3 px-8 mt-8 inline-flex w-auto uppercase tracking-widest text-[11px]">
                Consult remedies <FaChevronRight className="ms-2" size={10} />
              </button>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  {
                    icon: <FaHeartBroken />,
                    title: "Marriage",
                    color: "bg-red-500",
                    desc: "Delays or clashes",
                  },
                  {
                    icon: <FaChartLine />,
                    title: "Career",
                    color: "bg-blue-500",
                    desc: "Impulsivity",
                  },
                  {
                    icon: <FaHospital />,
                    title: "Health",
                    color: "bg-green-500",
                    desc: "Energy levels",
                  },
                  {
                    icon: <GiMeditation />,
                    title: "Peace",
                    color: "bg-purple-500",
                    desc: "Restlessness",
                  },
                ].map((effect, i) => (
                  <div key={i} className="col-6">
                    <div className="bg-white p-6 rounded-4 text-center group hover:-translate-y-2 transition-transform h-100">
                      <div
                        className={`w-12 h-12 ${effect.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {effect.icon}
                      </div>
                      <h4 className="text-[#301118] font-bold text-sm mb-1">
                        {effect.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {effect.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="space-section light-back">
        <div className="container">
          <h2 className="title-line mb-12 text-center">
            <span>Talk to Mangal Dosha Experts</span>
          </h2>
          <div className="row g-4">
            {[
              { name: "Pandit Sharma", exp: "21 Years", spec: "Vedic | Dosha" },
              { name: "Acharya Priya", exp: "15 Years", spec: "Numerology" },
              { name: "Dr. Rakesh", exp: "25 Years", spec: "Vedic | Prashna" },
              { name: "Meera Devi", exp: "10 Years", spec: "Tarot Expert" },
            ].map((ast, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="light-card border border-[#fd64102b] p-6 text-center group hover:shadow-2xl transition-all">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#fd641054] group-hover:scale-105 transition-transform">
                    <FaUser className="text-[#fd6410] text-4xl" />
                  </div>
                  <h4 className="text-[#301118] font-bold mb-1">{ast.name}</h4>
                  <p className="text-[#fd6410] text-[10px] font-bold uppercase tracking-widest">
                    {ast.spec}
                  </p>
                  <p className="text-gray-400 text-[11px] mb-3">
                    Exp: {ast.exp}
                  </p>
                  <div className="flex gap-2">
                    <button className="btn-link flex-1 py-2 text-[10px] uppercase shadow-sm">
                      <FaComments className="inline me-1" /> Chat
                    </button>
                    <button className="btn-link flex-1 py-2 text-[10px] uppercase bg-white text-[#301118] border-0 shadow-sm">
                      <FaPhoneAlt className="inline me-1" /> Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="btn-link px-12 py-3 inline-flex w-auto border-0 bg-transparent text-[#fd6410] !hover:text-[#301118] !p-0">
              View All Experts <FaChevronRight className="ms-2" size={10} />
            </button>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default MangalDoshaPage;
