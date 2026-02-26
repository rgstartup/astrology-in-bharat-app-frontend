"use client";

import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";
const Image = NextImage as React.FC<ImageProps>;
import {
  FaHeart as FaH,
  FaShieldAlt as FaSa,
  FaChevronRight as FaCr,
  FaMars as FaM,
  FaVenus as FaV,
  FaRegCheckCircle as FaRcc,
  FaSpinner as FaSp,
  FaExclamationTriangle as FaEt,
  FaCheckCircle as FaCc,
} from "react-icons/fa";
const FaHeart = FaH as React.ComponentType<any>;
const FaShieldAlt = FaSa as React.ComponentType<any>;
const FaChevronRight = FaCr as React.ComponentType<any>;
const FaMars = FaM as React.ComponentType<any>;
const FaVenus = FaV as React.ComponentType<any>;
const FaRegCheckCircle = FaRcc as React.ComponentType<any>;
const FaSpinner = FaSp as React.ComponentType<any>;
const FaExclamationTriangle = FaEt as React.ComponentType<any>;
const FaCheckCircle = FaCc as React.ComponentType<any>;

import { MdOutlineSecurity as MdOs } from "react-icons/md";
const MdOutlineSecurity = MdOs as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import safeFetch from "@packages/safe-fetch/safeFetch";

const KundaliMatchingByNamePage = () => {
  const [boyDetails, setBoyDetails] = useState({
    name: "",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [girlDetails, setGirlDetails] = useState({
    name: "",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

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
      if (content.description) return content.description;
      if (content.name) return content.name;
      if (content.title) return content.title;
      if (content.report) return content.report;
      return JSON.stringify(content);
    }
    return String(content);
  };

  const handleInputChange = (
    gender: "boy" | "girl",
    field: string,
    value: any
  ) => {
    if (gender === "boy") {
      setBoyDetails((prev) => ({ ...prev, [field]: value }));
    } else {
      setGirlDetails((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationSelect = (
    gender: "boy" | "girl",
    location: { name: string; lat: string; lon: string }
  ) => {
    if (gender === "boy") {
      setBoyDetails((prev) => ({
        ...prev,
        locationName: location.name,
        lat: location.lat,
        lon: location.lon,
      }));
    } else {
      setGirlDetails((prev) => ({
        ...prev,
        locationName: location.name,
        lat: location.lat,
        lon: location.lon,
      }));
    }
  };

  const handleMatch = async () => {
    setError(null);
    if (
      !boyDetails.date ||
      !boyDetails.time ||
      !boyDetails.lat ||
      !girlDetails.date ||
      !girlDetails.time ||
      !girlDetails.lat
    ) {
      setError("Please fill in all birth details for both individuals.");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        boy_dob: `${boyDetails.date}T${boyDetails.time}:00+05:30`,
        boy_lat: boyDetails.lat,
        boy_lon: boyDetails.lon,
        girl_dob: `${girlDetails.date}T${girlDetails.time}:00+05:30`,
        girl_lat: girlDetails.lat,
        girl_lon: girlDetails.lon,
      }).toString();

      const [rawData, fetchErr] = await safeFetch<any>(`/api/kundali-matching-advanced?${query}`);

      if (fetchErr) {
        const errMsg = fetchErr?.message || "Failed to generate report.";
        setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        return;
      }

      let finalData = rawData?.data ?? rawData;

      if (finalData) {
        setMatchingResult(finalData);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      } else {
        setError("Received incomplete data from the server.");
      }
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
                      <span className="aib-trust-badge">Advanced Analysis</span>
                      <h1>Detailed Kundali Matching</h1>
                      <h4 className="card-title">
                        Comprehensive Compatibility Report
                      </h4>
                      <p>
                        Get deep insights into relationship harmony with Guna
                        Milan, Ashtakoot Analysis, and detailed Mangal Dosha
                        verification for both partners.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> 8-Point
                          Ashtakoot Milan
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Advanced Mangal
                          Dosha Check
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Dosha Exceptions
                          & Remedies
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Conclusion &
                          Advice
                        </li>
                      </ul>
                      <button
                        className="btn-link wfc mt-4 mb-4"
                        onClick={() =>
                          window.scrollTo({ top: 600, behavior: "smooth" })
                        }
                      >
                        Check Detailed Compatibility
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
                      className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_25s_linear_infinite] opacity-30"
                    />
                    <div className="relative z-10 p-5 transform hover:scale-105 transition-transform duration-500">
                      <Image
                        src="/images/kundali-matching-hero.png"
                        alt="Kundali Matching"
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

      {/* Dual Detail Cards Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-4">
            {/* Boy's Details */}
            <div className="col-lg-6">
              <div className="light-card border rounded-4 border-[#fd64102b] p-8 h-100 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-[#fd641055]">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <FaMars size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Boy&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      The Groom&apos;s Profile
                    </p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="relative group/input">
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        placeholder="Boy's Full Name"
                        value={boyDetails.name}
                        onChange={(e) =>
                          handleInputChange("boy", "name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="relative group/input">
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        value={boyDetails.date}
                        onChange={(e) =>
                          handleInputChange("boy", "date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="relative group/input">
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        value={boyDetails.time}
                        onChange={(e) =>
                          handleInputChange("boy", "time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <LocationAutocomplete
                      placeholder="Boy's Birth Place (City, State)"
                      onSelect={(val) => handleLocationSelect("boy", val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Girl's Details */}
            <div className="col-lg-6">
              <div className="light-card border rounded-4 border-[#fd64102b] p-8 h-100 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-[#fd641055]">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-pink-500/10 p-3 rounded-2xl text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <FaVenus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Girl&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      The Bride&apos;s Profile
                    </p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="relative group/input">
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        placeholder="Girl's Full Name"
                        value={girlDetails.name}
                        onChange={(e) =>
                          handleInputChange("girl", "name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="relative group/input">
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        value={girlDetails.date}
                        onChange={(e) =>
                          handleInputChange("girl", "date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="relative group/input">
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#fd641022] transition-all"
                        value={girlDetails.time}
                        onChange={(e) =>
                          handleInputChange("girl", "time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <LocationAutocomplete
                      placeholder="Girl's Birth Place (City, State)"
                      onSelect={(val) => handleLocationSelect("girl", val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            {error && (
              <p className="text-red-500 font-bold mb-4 animate-bounce">
                {error}
              </p>
            )}
            <button
              disabled={loading}
              onClick={handleMatch}
              className="btn-link py-3 px-4 wfc mx-auto uppercase tracking-[3px] text-sm font-black shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Analyzing Advanced Data <FaSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  Generate Advanced Report{" "}
                  <FaChevronRight className="animate-pulse" />
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <MdOutlineSecurity size={14} className="text-[#fd6410]" /> 100%
              Private & Secure Analysis
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {matchingResult && (
        <section ref={resultsRef} className="space-section bg-white pt-5">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="bg-[#fff9f6] rounded-[3rem] shadow-[0_20px_50px_rgba(253,100,16,0.1)] border border-orange-100 overflow-hidden">
                <div className="p-8 md:p-16">
                  {/* Result Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#fd641012] text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                      Advanced Compatibility Analysis
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#301118] mb-8 leading-tight">
                      Relationship{" "}
                      <span className="text-[#fd6410]">Scorecard</span>
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
                      <div className="text-center group">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-2 border-blue-100 group-hover:scale-110 transition-transform duration-500">
                          <FaMars className="text-blue-500 text-3xl" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Groom
                        </p>
                        <h4 className="text-xl font-bold text-[#301118]">
                          {boyDetails.name || "Boy"}
                        </h4>
                      </div>

                      <div className="relative">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#fd6410] shadow-xl border border-orange-50 z-10 relative animate-pulse">
                          <FaHeart size={24} />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-200 to-transparent hidden md:block"></div>
                      </div>

                      <div className="text-center group">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4 border-2 border-pink-100 group-hover:scale-110 transition-transform duration-500">
                          <FaVenus className="text-pink-500 text-3xl" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Bride
                        </p>
                        <h4 className="text-xl font-bold text-[#301118]">
                          {girlDetails.name || "Girl"}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Kundali Data */}
                  <div className="row g-4 mb-12">
                    {/* Boy's Kundali Card */}
                    <div className="col-lg-6">
                      <div className="bg-white rounded-[2rem] p-8 border border-blue-50 h-100 shadow-sm">
                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[3px] mb-6 flex items-center gap-2">
                          <FaMars /> Groom&apos;s Kundali
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-50 pb-2 gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                              Nakshatra
                            </span>
                            <span className="text-sm font-bold text-[#301118] text-right">
                              {renderContent(
                                matchingResult.boy_info?.nakshatra?.name
                              )}{" "}
                              (
                              {renderContent(
                                matchingResult.boy_info?.nakshatra?.lord?.name
                              )}
                              , Pada{" "}
                              {renderContent(
                                matchingResult.boy_info?.nakshatra?.pada
                              )}
                              )
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2 gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                              Rasi (Moon Sign)
                            </span>
                            <span className="text-sm font-bold text-[#301118] text-right">
                              {renderContent(
                                matchingResult.boy_info?.rasi?.name
                              )}{" "}
                              (
                              {renderContent(
                                matchingResult.boy_info?.rasi?.lord?.name
                              )}
                              )
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2">
                            {matchingResult.boy_info?.koot &&
                              Object.entries(matchingResult.boy_info.koot).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between items-center border-b border-gray-50 pb-1"
                                  >
                                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                                      {key}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#301118] uppercase">
                                      {renderContent(value)}
                                    </span>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Girl's Kundali Card */}
                    <div className="col-lg-6">
                      <div className="bg-white rounded-[2rem] p-8 border border-pink-50 h-100 shadow-sm">
                        <h4 className="text-[11px] font-black text-pink-600 uppercase tracking-[3px] mb-6 flex items-center gap-2">
                          <FaVenus /> Bride&apos;s Kundali
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-50 pb-2 gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                              Nakshatra
                            </span>
                            <span className="text-sm font-bold text-[#301118] text-right">
                              {renderContent(
                                matchingResult.girl_info?.nakshatra?.name
                              )}{" "}
                              (
                              {renderContent(
                                matchingResult.girl_info?.nakshatra?.lord?.name
                              )}
                              , Pada{" "}
                              {renderContent(
                                matchingResult.girl_info?.nakshatra?.pada
                              )}
                              )
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2 gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                              Rasi (Moon Sign)
                            </span>
                            <span className="text-sm font-bold text-[#301118] text-right">
                              {renderContent(
                                matchingResult.girl_info?.rasi?.name
                              )}{" "}
                              (
                              {renderContent(
                                matchingResult.girl_info?.rasi?.lord?.name
                              )}
                              )
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2">
                            {matchingResult.girl_info?.koot &&
                              Object.entries(matchingResult.girl_info.koot).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between items-center border-b border-gray-50 pb-1"
                                  >
                                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                                      {key}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#301118] uppercase">
                                      {renderContent(value)}
                                    </span>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Data Grid */}
                  <div className="row g-5">
                    {/* Score Card */}
                    <div className="col-lg-5">
                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50 text-center h-100 flex flex-col items-center justify-center">
                        <h3 className="text-[11px] font-black text-[#301118] uppercase tracking-[3px] mb-8">
                          Final Guna Score
                        </h3>

                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-48 h-48 transform -rotate-90">
                            <circle
                              className="text-gray-100"
                              strokeWidth="12"
                              stroke="currentColor"
                              fill="transparent"
                              r="80"
                              cx="96"
                              cy="96"
                            />
                            <circle
                              className="text-[#fd6410]"
                              strokeWidth="12"
                              strokeDasharray={
                                (
                                  ((matchingResult.guna_milan?.total_points ??
                                    matchingResult.guna_milan?.total?.score ??
                                    matchingResult.total?.score ??
                                    matchingResult.total_score ??
                                    0) /
                                    (matchingResult.guna_milan
                                      ?.maximum_points ?? 36)) *
                                  (2 * Math.PI * 80)
                                ).toString() +
                                " " +
                                2 * Math.PI * 80
                              }
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="80"
                              cx="96"
                              cy="96"
                              style={{
                                transition: "stroke-dasharray 1s ease-in-out",
                              }}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-6xl font-black text-[#301118] leading-none mb-1">
                              {matchingResult.guna_milan?.total_points ??
                                matchingResult.guna_milan?.total?.score ??
                                matchingResult.total?.score ??
                                matchingResult.total_score ??
                                0}
                            </span>
                            <span className="text-sm font-black text-gray-300 uppercase tracking-tighter">
                              out of{" "}
                              {matchingResult.guna_milan?.maximum_points ?? 36}
                            </span>
                          </div>
                        </div>

                        <div className="mt-10">
                          <div
                            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest ${(matchingResult.guna_milan?.total_points ??
                                matchingResult.guna_milan?.total?.score ??
                                matchingResult.total?.score ??
                                matchingResult.total_score ??
                                0) >=
                                (matchingResult.guna_milan?.maximum_points ??
                                  36) /
                                2
                                ? "bg-green-500 text-white shadow-lg shadow-green-100"
                                : "bg-[#301118] text-white shadow-lg shadow-orange-100"
                              }`}
                          >
                            {(matchingResult.guna_milan?.total_points ??
                              matchingResult.guna_milan?.total?.score ??
                              matchingResult.total?.score ??
                              matchingResult.total_score ??
                              0) >=
                              (matchingResult.guna_milan?.maximum_points ?? 36) /
                              2
                              ? "High Compatibility"
                              : "Moderate Match"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="col-lg-7">
                      <div className="bg-white rounded-[3rem] p-10 h-100 shadow-sm border border-orange-50">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                          <h3 className="text-[11px] font-black text-[#301118] uppercase tracking-[3px]">
                            Ashtakoot Breakdown
                          </h3>
                          <span className="text-[10px] font-bold text-[#fd6410] bg-[#fd641010] px-3 py-1 rounded-full uppercase tracking-widest">
                            8 Koot Milan
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {(
                            matchingResult.guna_milan?.guna ||
                            Object.entries(
                              (matchingResult.guna_milan?.ashtakoot ||
                                matchingResult.ashtakoot ||
                                matchingResult.ashtakoot_points ||
                                {}) as Record<
                                  string,
                                  { score: number; maximum_score: number }
                                >
                            ).map(([key, value]) => ({
                              name: key,
                              obtained_points: value.score,
                              maximum_points: value.maximum_score,
                            }))
                          ).map((item: any, idx: number) => (
                            <div key={idx} className="space-y-2 group">
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#301118] opacity-70 group-hover:opacity-100 transition-opacity">
                                  {item.name}
                                </span>
                                <span className="text-[11px] font-black text-[#fd6410]">
                                  {item.obtained_points}{" "}
                                  <span className="text-gray-300 font-bold">
                                    /
                                  </span>{" "}
                                  {item.maximum_points}
                                </span>
                              </div>
                              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                                <div
                                  className="bg-linear-to-r from-[#fd6410] to-[#ff8c4a] h-full rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${(item.obtained_points / (item.maximum_points || 1)) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mangal Dosha Section (NEW) */}
                    {(matchingResult.girl_mangal_dosha_details ||
                      matchingResult.boy_mangal_dosha_details) && (
                        <div className="col-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Boy Dosha */}
                            <div
                              className={`p-8 rounded-[2rem] border ${matchingResult.boy_mangal_dosha_details?.has_dosha ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}
                            >
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${matchingResult.boy_mangal_dosha_details?.has_dosha ? "bg-red-500" : "bg-green-500"}`}
                                >
                                  {matchingResult.boy_mangal_dosha_details
                                    ?.has_dosha ? (
                                    <FaExclamationTriangle />
                                  ) : (
                                    <FaCheckCircle />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-[#301118]">
                                    Groom Mangal Dosha
                                  </h4>
                                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Status Check
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium opacity-80 leading-relaxed">
                                {renderContent(
                                  matchingResult.boy_mangal_dosha_details
                                    ?.description
                                ) || "No specific details available."}
                              </p>
                              {matchingResult.boy_mangal_dosha_details
                                ?.has_exception && (
                                  <div className="mt-3 text-xs bg-white/50 p-2 rounded-lg font-bold text-[#301118]">
                                    Exception Applied: True
                                  </div>
                                )}
                            </div>

                            {/* Girl Dosha */}
                            <div
                              className={`p-8 rounded-[2rem] border ${matchingResult.girl_mangal_dosha_details?.has_dosha ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}
                            >
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${matchingResult.girl_mangal_dosha_details?.has_dosha ? "bg-red-500" : "bg-green-500"}`}
                                >
                                  {matchingResult.girl_mangal_dosha_details
                                    ?.has_dosha ? (
                                    <FaExclamationTriangle />
                                  ) : (
                                    <FaCheckCircle />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-[#301118]">
                                    Bride Mangal Dosha
                                  </h4>
                                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Status Check
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium opacity-80 leading-relaxed">
                                {renderContent(
                                  matchingResult.girl_mangal_dosha_details
                                    ?.description
                                ) || "No specific details available."}
                              </p>
                              {matchingResult.girl_mangal_dosha_details
                                ?.has_exception && (
                                  <div className="mt-3 text-xs bg-white/50 p-2 rounded-lg font-bold text-[#301118]">
                                    Exception Applied: True
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Conclusion Card */}
                    <div className="col-12">
                      <div className="bg-gradient-to-br from-[#301118] to-[#4a1c26] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd641008] rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="bg-[#fd6410] w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl rotate-3">
                              <MdOutlineSecurity size={40} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[12px] font-black uppercase tracking-[4px] mb-4 text-[#fd6410]">
                                Astro-Expert Conclusion
                              </h4>
                              <p className="text-lg italic opacity-95 leading-relaxed m-0 font-display">
                                &quot;
                                {renderContent(
                                  matchingResult.message?.description ||
                                  matchingResult.guna_milan?.conclusion
                                    ?.report ||
                                  matchingResult.conclusion?.report ||
                                  matchingResult.conclusion ||
                                  "Our analysis suggests consulting with a professional astrologer for a truly personalized compatibility reading."
                                )}
                                &quot;
                              </p>
                            </div>
                          </div>
                          <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-4">
                            <button
                              className="bg-white text-[#301118] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                              onClick={() => window.print()}
                            >
                              Print Report
                            </button>
                            <button className="bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Guna Milan Section (Copied for consistence) */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="text-4xl font-bold mb-6">
                Importance of <span className="text-[#fd6410]">Matching</span>
              </h2>
              <p className="text-orange-100/90 mb-8 leading-relaxed italic">
                Beyond just the Guna score, our advanced system analyzes Mangal
                Dosha and other planetary positions to give you a complete
                picture of relationship compatibility.
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

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default KundaliMatchingByNamePage;


