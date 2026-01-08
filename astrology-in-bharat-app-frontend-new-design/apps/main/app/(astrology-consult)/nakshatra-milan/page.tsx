"use client";

import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";
const Image = NextImage as React.FC<ImageProps>;
import {
  FaChevronRight as FaCr,
  FaMars as FaM,
  FaVenus as FaV,
  FaRegCheckCircle as FaRcc,
  FaSpinner as FaSp,
  FaStar as FaS,
  FaChevronDown,
} from "react-icons/fa";
const FaChevronRight = FaCr as React.ComponentType<any>;
const FaMars = FaM as React.ComponentType<any>;
const FaVenus = FaV as React.ComponentType<any>;
const FaRegCheckCircle = FaRcc as React.ComponentType<any>;
const FaSpinner = FaSp as React.ComponentType<any>;
const FaStar = FaS as React.ComponentType<any>;
const FaChevronDownIcon = FaChevronDown as React.ComponentType<any>;

import { MdAutoAwesome as MdAa } from "react-icons/md";
const MdAutoAwesome = MdAa as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import axios from "axios";

const NakshatraMilanPage = () => {
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
  const [results, setResults] = useState<{
    boy: any;
    girl: any;
    match: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const faqs = [
    {
      q: "What is a good Nakshatra Matching score?",
      a: "In Vedic Astrology, a score of 18 or above out of 36 is considered acceptable for marriage. A score above 25 is considered excellent compatibility, while below 18 requires careful consideration and expert consultation.",
    },
    {
      q: "Can Nakshatra Milan predict a happy marriage?",
      a: "Nakshatra Milan provides deep insights into psychological and emotional compatibility. While a high score is a positive sign, a happy marriage also depends on mutual respect, understanding, and the overall strength of individual horoscopes.",
    },
    {
      q: "How serious is Nadi Dosha in matching?",
      a: "Nadi Dosha is one of the most significant aspects of Guna Milan, as it relates to genetic compatibility and progeny. However, Vedic Astrology also provides specific cancellations (Nadi Dosha Parihar) based on various planetary alignments.",
    },
    {
      q: "What are the remedies for Gana Dosha?",
      a: "Gana Dosha relates to temperament differences. If Guna Milan shows a Gana Dosha, experts often recommend specific mantras, charity, or 'Maha-Mrityunjaya' jaap to mitigate the effects and improve mutual harmony.",
    },
  ];

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
      // Fetch for both Boy, Girl and the Match result
      const [boyRes, girlRes, matchRes] = await Promise.all([
        axios.get("/api/birth-details", {
          params: {
            datetime: `${boyDetails.date}T${boyDetails.time}:00+05:30`,
            lat: boyDetails.lat,
            lon: boyDetails.lon,
          },
        }),
        axios.get("/api/birth-details", {
          params: {
            datetime: `${girlDetails.date}T${girlDetails.time}:00+05:30`,
            lat: girlDetails.lat,
            lon: girlDetails.lon,
          },
        }),
        axios.get("/api/kundali-matching", {
          params: {
            boy_dob: `${boyDetails.date}T${boyDetails.time}:00+05:30`,
            boy_lat: boyDetails.lat,
            boy_lon: boyDetails.lon,
            girl_dob: `${girlDetails.date}T${girlDetails.time}:00+05:30`,
            girl_lat: girlDetails.lat,
            girl_lon: girlDetails.lon,
          },
        }),
      ]);

      setResults({
        boy: boyRes.data?.data || boyRes.data,
        girl: girlRes.data?.data || girlRes.data,
        match: matchRes.data?.data || matchRes.data,
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch (err: any) {
      console.error("Fetch Error Diagnosis:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Failed to fetch birth details. Please check your inputs.");
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
                      <span className="aib-trust-badge">Vedic Analysis</span>
                      <h1>Nakshatra Milan</h1>
                      <h4 className="card-title">Star Compatibility Checker</h4>
                      <p>
                        Analyze the birth stars (Nakshatras) of both partners to
                        determine their emotional, mental, and spiritual
                        compatibility based on ancient Vedic astrology.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Nakshatra
                          Analysis
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Chandra Rashi
                          Check
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Birth Star
                          Details
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Professional
                          Report
                        </li>
                      </ul>
                      <button
                        className="btn-link wfc mt-4 mb-4"
                        onClick={() =>
                          window.scrollTo({ top: 600, behavior: "smooth" })
                        }
                      >
                        Check Star Details
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
                    <div className="relative z-10 ">
                      <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                        <FaStar className="text-[#fd6410] text-7xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-4">
            {/* Boy's Card */}
            <div className="col-lg-6">
              <div className="light-card border rounded-4 border-[#fd64102b] p-8 h-100 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-[#fd641055]">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <FaMars size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Boy&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Mental & Star Analysis
                    </p>
                  </div>
                </div>
                <div className="row g-4">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm focus:bg-white"
                      placeholder="Boy's Full Name"
                      value={boyDetails.name}
                      onChange={(e) =>
                        handleInputChange("boy", "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 border bg-gray-50 text-sm focus:bg-white"
                      value={boyDetails.date}
                      onChange={(e) =>
                        handleInputChange("boy", "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control rounded-3 py-3 border bg-gray-50 text-sm focus:bg-white"
                      value={boyDetails.time}
                      onChange={(e) =>
                        handleInputChange("boy", "time", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-12">
                    <LocationAutocomplete
                      placeholder="Boy's Birth Place"
                      onSelect={(val) => handleLocationSelect("boy", val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Girl's Card */}
            <div className="col-lg-6">
              <div className="light-card border rounded-4 border-[#fd64102b] p-8 h-100 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-[#fd641055]">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-pink-500/10 p-3 rounded-2xl text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500">
                    <FaVenus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Girl&apos;s Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Emotional & Star Analysis
                    </p>
                  </div>
                </div>
                <div className="row g-4">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 pl-4 border bg-gray-50 text-sm focus:bg-white"
                      placeholder="Girl's Full Name"
                      value={girlDetails.name}
                      onChange={(e) =>
                        handleInputChange("girl", "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 border bg-gray-50 text-sm focus:bg-white"
                      value={girlDetails.date}
                      onChange={(e) =>
                        handleInputChange("girl", "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control rounded-3 py-3 border bg-gray-50 text-sm focus:bg-white"
                      value={girlDetails.time}
                      onChange={(e) =>
                        handleInputChange("girl", "time", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-12">
                    <LocationAutocomplete
                      placeholder="Girl's Birth Place"
                      onSelect={(val) => handleLocationSelect("girl", val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            {error && <p className="text-red-500 font-bold mb-4">{error}</p>}
            <button
              disabled={loading}
              onClick={handleMatch}
              className="btn-link py-3 px-8 wfc mx-auto uppercase tracking-[3px] text-sm font-black shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 border-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  Fetching Details <FaSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  Compare Star Details <FaChevronRight />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section ref={resultsRef} className="space-section bg-white pt-5">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="bg-[#fff9f6] rounded-[3rem] shadow-[0_20px_50px_rgba(253,100,16,0.1)] border border-orange-100 overflow-hidden">
                <div className="p-8 md:p-16">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#fd641012] text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                      Star Comparison Result
                    </div>
                    <h2 className="text-4xl font-black text-[#301118]">
                      The Celestial{" "}
                      <span className="text-[#fd6410]">Alignment</span>
                    </h2>
                  </div>

                  {/* Matching Score Header */}
                  {results.match?.guna_milan && (
                    <div className="mb-12 bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-xl flex flex-col items-center">
                      <span className="text-[12px] font-black text-[#fd6410] uppercase tracking-[3px] mb-4">
                        Compatibility Score
                      </span>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-7xl font-black text-[#301118]">
                          {results.match.guna_milan.total_points}
                        </span>
                        <span className="text-2xl font-bold text-gray-300">
                          / {results.match.guna_milan.maximum_points}
                        </span>
                      </div>
                      <div
                        className={`px-8 py-2 rounded-full text-[13px] font-bold uppercase tracking-widest ${
                          results.match.guna_milan.total_points >= 18
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {results.match.guna_milan.total_points >= 25
                          ? "Perfect Match"
                          : results.match.guna_milan.total_points >= 18
                            ? "Good Compatibility"
                            : "Careful Consideration Required"}
                      </div>
                    </div>
                  )}

                  <div className="row g-8 items-stretch pt-5">
                    {/* Boy's Result */}
                    <div className="col-lg-6">
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 h-100">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <FaMars className="text-blue-500 text-2xl" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-[#301118]">
                              {boyDetails.name || "Boy"}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                              Birth Star Chart
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            {
                              label: "Nakshatra",
                              value: results.boy.nakshatra?.name,
                              planet: results.boy.nakshatra?.lord?.name,
                            },
                            {
                              label: "Chandra Rashi",
                              value: results.boy.chandra_rasi?.name,
                              lord: results.boy.chandra_rasi?.lord?.name,
                            },
                            {
                              label: "Deity",
                              value: results.boy.additional_info?.deity,
                            },
                            {
                              label: "Gana / Temperament",
                              value: results.boy.additional_info?.ganam,
                            },
                            {
                              label: "Animal Sign",
                              value: results.boy.additional_info?.animal_sign,
                            },
                            {
                              label: "Nadi",
                              value: results.boy.additional_info?.nadi,
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white transition-colors"
                            >
                              <div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] block mb-1">
                                  {item.label}
                                </span>
                                <span className="text-base font-bold text-[#301118]">
                                  {item.value || "Calculating..."}
                                </span>
                              </div>
                              {item.lord && (
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-gray-300 uppercase block">
                                    Lord
                                  </span>
                                  <span className="text-[10px] font-bold text-blue-500">
                                    {item.lord}
                                  </span>
                                </div>
                              )}
                              {item.planet && (
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-gray-300 uppercase block">
                                    Planet
                                  </span>
                                  <span className="text-[10px] font-bold text-blue-500">
                                    {item.planet}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Girl's Result */}
                    <div className="col-lg-6">
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50 h-100">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                            <FaVenus className="text-pink-500 text-2xl" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-[#301118]">
                              {girlDetails.name || "Girl"}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                              Birth Star Chart
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            {
                              label: "Nakshatra",
                              value: results.girl.nakshatra?.name,
                              planet: results.girl.nakshatra?.lord?.name,
                            },
                            {
                              label: "Chandra Rashi",
                              value: results.girl.chandra_rasi?.name,
                              lord: results.girl.chandra_rasi?.lord?.name,
                            },
                            {
                              label: "Deity",
                              value: results.girl.additional_info?.deity,
                            },
                            {
                              label: "Gana / Temperament",
                              value: results.girl.additional_info?.ganam,
                            },
                            {
                              label: "Animal Sign",
                              value: results.girl.additional_info?.animal_sign,
                            },
                            {
                              label: "Nadi",
                              value: results.girl.additional_info?.nadi,
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white transition-colors"
                            >
                              <div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] block mb-1">
                                  {item.label}
                                </span>
                                <span className="text-base font-bold text-[#301118]">
                                  {item.value || "Calculating..."}
                                </span>
                              </div>
                              {item.lord && (
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-gray-300 uppercase block">
                                    Lord
                                  </span>
                                  <span className="text-[10px] font-bold text-pink-500">
                                    {item.lord}
                                  </span>
                                </div>
                              )}
                              {item.planet && (
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-gray-300 uppercase block">
                                    Planet
                                  </span>
                                  <span className="text-[10px] font-bold text-pink-500">
                                    {item.planet}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer / Info */}
                    <div className="col-12 text-center pt-8">
                      <div className="bg-gradient-to-br from-[#301118] to-[#4a1c26] rounded-[3rem] p-10 text-white flex flex-col items-center">
                        <MdAutoAwesome className="text-[#fd6410] text-5xl mb-6 animate-pulse" />
                        <h4 className="text-2xl font-bold mb-4">
                          Cosmic Synchronization
                        </h4>
                        <p className="max-w-2xl opacity-80 italic text-sm leading-relaxed">
                          Nakshatra Milan helps you understand the deep
                          psychological bonding between two individuals. The
                          alignment of birth stars influences your long-term
                          relationship harmony and spiritual growth.
                        </p>
                        <div className="mt-8 flex gap-4">
                          <button className="bg-[#fd6410] text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border-0 hover:scale-105 transition-transform">
                            Download Star Report
                          </button>
                          <button className="bg-white/10 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                            Consult Expert
                          </button>
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

      {/* Info Section */}
      <section className="space-section bg-[#301118] text-white overflow-hidden">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="text-4xl font-bold mb-6">
                Importance of <span className="text-[#fd6410]">Nakshatra</span>
              </h2>
              <p className="text-orange-100/90 mb-8 leading-relaxed italic">
                In Vedic Astrology, the Nakshatras (lunar mansions) are even
                more significant than the solar zodiac signs. They determine our
                temperament, behaviors, and compatibility at a fundamental
                level.
              </p>
              <div className="space-y-4">
                {[
                  "Padas & Quarters",
                  "Gana (Temperament)",
                  "Yoni (Physical Compatibility)",
                  "Nadi (Health & Bloodline)",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-3 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <FaRegCheckCircle className="text-[#fd6410]" />
                    <span className="font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white/5 p-12 rounded-[4rem] border-2 border-dashed border-[#fd641033] relative text-center">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fd6410] rounded-full flex items-center justify-center -rotate-12 shadow-2xl">
                  <FaStar className="text-white text-5xl" />
                </div>
                <h3 className="text-4xl font-black text-[#fd6410] mb-4">
                  27 Nakshatras
                </h3>
                <p className="text-gray-300 italic text-sm">
                  Every individual is born under one of the 27 lunar
                  constellations that define their life path.
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest">
                      Aries - Taurus
                    </span>
                    <p className="text-xs font-semibold text-gray-200">
                      Ashwini, Bharani, Krittika
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest">
                      Gemini - Cancer
                    </span>
                    <p className="text-xs font-semibold text-gray-200">
                      Mrigashira, Punarvasu, Pushya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row justify-content-center mb-12">
            <div className="col-lg-7 text-center">
              <span className="aib-trust-badge mb-3">Questions & Answers</span>
              <h2 className="text-3xl font-black text-[#301118]">
                Common Compatibility Queries
              </h2>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`light-card border rounded-3xl transition-all duration-300 ${
                  openFaq === i
                    ? "border-[#fd6410] bg-white shadow-xl"
                    : "border-[#fd64101a] hover:bg-white hover:border-[#fd641044]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full md:p-6 flex justify-between items-center text-left"
                >
                  <span
                    className={`text-base font-bold transition-colors ${openFaq === i ? "text-[#fd6410]" : "text-[#301118]"}`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${openFaq === i ? "bg-[#fd6410] text-white rotate-180" : "bg-orange-50 text-[#fd6410]"}`}
                  >
                    <FaChevronDownIcon size={12} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === i
                      ? "max-h-[200px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 md:p-6 pt-0 border-t border-orange-50 mt-1">
                    <p className="text-sm text-gray-500 leading-relaxed italic m-0">
                      {faq.a}
                    </p>
                  </div>
                </div>
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
