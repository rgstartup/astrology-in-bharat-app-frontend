"use client";

import React, { useState, useRef } from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaCalendarAlt as FaCa,
  FaMapMarkerAlt as FaMma,
  FaHeartBroken as FaHb,
  FaChartLine as FaCl,
  FaHospital as FaHos,
  FaUser as FaU,
  FaComments as FaCom,
  FaPhoneAlt as FaPa,
  FaCheck as FaC,
  FaChevronRight as FaCr,
  FaExclamationTriangle as FaEt,
  FaSpinner as FaSp,
  FaMars as FaMa,
  FaCheckCircle as FaCc,
} from "react-icons/fa";
const FaCalendarAlt = FaCa as any;
const FaMapMarkerAlt = FaMma as any;
const FaHeartBroken = FaHb as any;
const FaChartLine = FaCl as any;
const FaHospital = FaHos as any;
const FaUser = FaU as any;
const FaComments = FaCom as any;
const FaPhoneAlt = FaPa as any;
const FaCheck = FaC as any;
const FaChevronRight = FaCr as any;
const FaExclamationTriangle = FaEt as any;
const FaSpinner = FaSp as any;
const FaMars = FaMa as any;
const FaCheckCircle = FaCc as any;

import { GiMeditation as GiM } from "react-icons/gi";
const GiMeditation = GiM as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import axios from "axios";

const MangalDoshaPage = () => {
  const [details, setDetails] = useState({
    name: "",
    gender: "male",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper to safely render any content (string, object, array) to avoid "Objects as React Child" error
  const renderContent = (content: any): React.ReactNode => {
    if (content === null || content === undefined) return "";
    if (typeof content === "string" || typeof content === "number")
      return content;
    if (Array.isArray(content)) {
      return content.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && ", "}
          {renderContent(item)}
        </React.Fragment>
      ));
    }
    if (typeof content === "object") {
      // Common Prokerala object properties
      if (content.description) return content.description;
      if (content.name) return content.name;
      if (content.title) return content.title;
      return JSON.stringify(content);
    }
    return String(content);
  };

  const handleInputChange = (field: string, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: {
    name: string;
    lat: string;
    lon: string;
  }) => {
    setDetails((prev) => ({
      ...prev,
      locationName: location.name,
      lat: location.lat,
      lon: location.lon,
    }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (
      !details.date ||
      !details.time ||
      !details.lat ||
      !details.lon ||
      !details.name
    ) {
      setError("Please fill in all details including birth location.");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting Mangal Dosha Request...");
      const response = await axios.get("/api/mangal-dosha", {
        params: {
          dob: `${details.date}T${details.time}:00+05:30`,
          lat: details.lat,
          lon: details.lon,
        },
      });

      console.log("Mangal Dosha Full API Response Object:", response);

      // Navigate possible nesting: response.data -> .data -> .mangal_dosha
      let rawData = response.data;
      if (rawData?.data) rawData = rawData.data;

      const finalData = rawData?.mangal_dosha || rawData;

      console.log("Deeply Extracted Result Data:", finalData);

      if (
        finalData &&
        (finalData.description || finalData.has_dosha !== undefined)
      ) {
        setResult(finalData);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        console.error(
          "Data validation failed. Keys found:",
          finalData ? Object.keys(finalData) : "null"
        );
        setError(
          "The API returned data in an unexpected format. Please check the console."
        );
      }
    } catch (err: any) {
      console.error("Frontend Analyze Error:", err);
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to generate report. Please try again.";
      setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
    } finally {
      setLoading(false);
    }
  };

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
                        Vedic Astrology Calculator
                      </span>
                      <h1>Mangal Dosha Analysis</h1>
                      <h4 className="card-title">
                        Discover & Neutralize Mars Affliction
                      </h4>
                      <p>
                        Get accurate analysis of Mangal Dosha (Mars Affliction)
                        in your birth chart. Understand its impact on marriage,
                        career, and life stability with effective Vedic
                        remedies.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Instant Dosha
                          Check
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Personalized
                          Insights
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Impact Analysis
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Effective Vedic
                          Remedies
                        </li>
                      </ul>
                      <button
                        className="btn-link wfc mt-4 mb-4"
                        onClick={() =>
                          window.scrollTo({ top: 600, behavior: "smooth" })
                        }
                      >
                        Check Mangal Dosha
                      </button>
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
                    <div className="relative z-10 p-5 transform hover:scale-105 transition-transform duration-500">
                      <Image
                        src="/images/mangal-dosha-hero.png"
                        alt="Mangal Dosha Analysis"
                        width={500}
                        height={500}
                        className="w-full h-auto drop-shadow-2xl rounded-3xl"
                      />
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
              <div className="light-card border border-[#fd64102b] p-8 md:p-10 shadow-2xl h-full">
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

                <form className="space-y-4" onSubmit={handleAnalyze}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                        placeholder="Enter name"
                        value={details.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Gender
                      </label>
                      <select
                        className="form-select rounded-3 py-3 border-0 shadow-sm bg-gray-50 text-sm"
                        value={details.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
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
                        value={details.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                        value={details.time}
                        onChange={(e) =>
                          handleInputChange("time", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Place
                      </label>
                      <LocationAutocomplete
                        placeholder="City"
                        onSelect={handleLocationSelect}
                        value={details.locationName}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm font-bold mt-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-link py-4 mt-6 uppercase tracking-widest text-[12px] font-bold w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        Analyzing <FaSpinner className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Analyze Mangal Dosha Now <FaChevronRight size={10} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="col-lg-5">
              <div className="space-y-6">
                <div className="rounded-4 overflow-hidden relative h-64 group shadow-xl border border-[#fd64102b]">
                  <Image
                    src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
                    alt="Meditation"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
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

      {/* Results Section */}
      {result && (
        <section ref={resultsRef} className="space-section bg-white pt-5">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#fff9f6] rounded-[3rem] shadow-[0_20px_50px_rgba(253,100,16,0.1)] border border-orange-100 overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-[#fd641012] text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-6">
                      Analysis Report
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#301118] mb-4">
                      Your Mangal Dosha{" "}
                      <span className="text-[#fd6410]">Status</span>
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                      Based on the birth details provided, here is the detailed
                      analysis of Mars position in your horoscope.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-stretch mb-8">
                    {/* Status Card */}
                    <div className="flex-1">
                      <div
                        className={`h-full rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden ${
                          result.has_dosha
                            ? "bg-red-50 border border-red-100"
                            : "bg-green-50 border border-green-100"
                        }`}
                      >
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                            result.has_dosha
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {result.has_dosha ? (
                            <FaMars size={40} className="animate-pulse" />
                          ) : (
                            <FaCheckCircle size={40} />
                          )}
                        </div>
                        <h3
                          className={`text-2xl font-black uppercase tracking-wider mb-2 ${
                            result.has_dosha ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {result.has_dosha
                            ? "Manglik Dosha Present"
                            : "No Mangal Dosha"}
                        </h3>
                        <p
                          className={`font-bold text-sm uppercase tracking-widest ${
                            result.has_dosha ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {result.has_dosha
                            ? "Requires Attention"
                            : "Favorable Chart"}
                        </p>
                        {result.type && (
                          <div className="mt-4 px-4 py-1.5 bg-white/50 rounded-full text-xs font-bold text-gray-600 border border-gray-100">
                            Type: {renderContent(result.type)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description Card */}
                    <div className="flex-[1.5]">
                      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-orange-50 h-full flex flex-col justify-center">
                        <h4 className="text-lg font-bold text-[#301118] mb-4 flex items-center gap-2">
                          <FaChartLine className="text-[#fd6410]" /> Detailed
                          Analysis
                        </h4>
                        <p className="text-gray-600 leading-loose italic mb-6">
                          &quot;{renderContent(result.description)}&quot;
                        </p>

                        {!result.has_dosha && (
                          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3 items-start">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                            <p className="text-green-800 text-sm m-0 font-medium">
                              Your chart is free from the adverse effects of
                              Mars. This is considered auspicious for marriage
                              and partnerships.
                            </p>
                          </div>
                        )}

                        {result.has_dosha && (
                          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3 items-start">
                            <FaExclamationTriangle className="text-red-500 mt-1 shrink-0" />
                            <p className="text-red-800 text-sm m-0 font-medium">
                              Since Mangal Dosha is present, it is highly
                              recommended to consult with an astrologer for
                              Kumbh Vivah or other remedies before marriage.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Exceptions & Remedies Section (New) */}
                  {(result.exceptions?.length > 0 ||
                    result.remedies?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {result.exceptions?.length > 0 && (
                        <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100">
                          <h4 className="text-lg font-bold text-[#301118] mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-[#fd6410]" />{" "}
                            Exceptions Found
                          </h4>
                          <ul className="space-y-2">
                            {result.exceptions.map((ex: any, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 list-disc list-inside"
                              >
                                {renderContent(ex)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.remedies?.length > 0 && (
                        <div className="bg-[#301118] text-white rounded-[2rem] p-8 border border-white/10">
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <GiMeditation className="text-[#fd6410]" />{" "}
                            Recommended Remedies
                          </h4>
                          <ul className="space-y-2">
                            {result.remedies.map((rem: any, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-300 list-disc list-inside"
                              >
                                {renderContent(rem)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
              <button className="btn-link py-3 px-12 mt-8 inline-flex wfc uppercase tracking-widest text-[11px]">
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
                    <div className="bg-white p-6 rounded-4 text-center group hover:-translate-y-2 transition-transform h-full">
                      <div
                        className={`w-12 h-12 ${effect.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {effect.icon}
                      </div>
                      <h4 className="text-black font-bold text-sm mb-1">
                        {effect.title}
                      </h4>
                      <p className="text-[10px] text-gray-600 font-semibold uppercase">
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
            <button className="btn-link px-8 py-3 inline-flex wfc border-0 bg-transparent text-[#fd6410] hover:text-[#301118] mx-auto">
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


