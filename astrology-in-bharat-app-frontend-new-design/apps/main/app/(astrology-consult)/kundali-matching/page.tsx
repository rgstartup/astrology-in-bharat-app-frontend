"use client";

import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";
const Image = NextImage as React.FC<ImageProps>;
import {
  FaUserFriends as FaUf,
  FaHeart as FaH,
  FaShieldAlt as FaSa,
  FaChevronRight as FaCr,
  FaMars as FaM,
  FaVenus as FaV,
  FaRegCheckCircle as FaRcc,
  FaSpinner as FaSp,
  FaUser as FaU,
  FaHandshake as FaHs
} from "react-icons/fa";
const FaUserFriends = FaUf as React.ComponentType<any>;
const FaHeart = FaH as React.ComponentType<any>;
const FaShieldAlt = FaSa as React.ComponentType<any>;
const FaChevronRight = FaCr as React.ComponentType<any>;
const FaMars = FaM as React.ComponentType<any>;
const FaVenus = FaV as React.ComponentType<any>;
const FaRegCheckCircle = FaRcc as React.ComponentType<any>;
const FaSpinner = FaSp as React.ComponentType<any>;
const FaUser = FaU as React.ComponentType<any>;
const FaHandshake = FaHs as React.ComponentType<any>;

import { MdOutlineSecurity as MdOs } from "react-icons/md";
const MdOutlineSecurity = MdOs as any;

import {
  GiLotus as GiL,
  GiFlowerEmblem as GiFe,
  GiStarShuriken as GiSs,
  GiSparkles as GiSpark,
  GiLion as GiLionI,
  GiYinYang as GiYy,
  GiLovers as GiLov
} from "react-icons/gi";
const GiLotus = GiL as any;
const GiFlowerEmblem = GiFe as any;
const GiStarShuriken = GiSs as any;
const GiSparkles = GiSpark as any;
const GiLion = GiLionI as any;
const GiYinYang = GiYy as any;
const GiLovers = GiLov as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import axios from "axios";
import { toast } from "react-toastify";

const KundaliMatchingPage = () => {
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
      if (Object.keys(content).length === 0) return "";
      if (content.description) return renderContent(content.description);
      if (content.name) return renderContent(content.name);
      if (content.title) return renderContent(content.title);
      if (content.report) return renderContent(content.report);
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

  // Premium Section Animations & Styles
  const premiumStyles = `
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-soft {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(48, 17, 24, 0.1);
    }
    .text-burgundy { color: #301118; }
    .bg-burgundy { background-color: #301118; }
    .border-burgundy { border-color: #301118; }
    .text-gold { color: #d4af37; }
  `;

  const handleMatch = async () => {
    setMatchingResult(null);
    if (!boyDetails.date || !boyDetails.time || !boyDetails.lat) {
      toast.error("Please fill in Boy's birth details (Date, Time, and Place).");
      return;
    }
    if (!girlDetails.date || !girlDetails.time || !girlDetails.lat) {
      toast.error("Please fill in Girl's birth details (Date, Time, and Place).");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting Guna Milan Request...");

      // Formatting according to Prokerala API requirement from walkthrough
      const response = await axios.post("/api/v1/matchmaking/guna-milan", {
        girl: {
          name: girlDetails.name || "Girl",
          datetime: `${girlDetails.date}T${girlDetails.time}:00Z`,
          location: {
            lat: parseFloat(girlDetails.lat),
            lon: parseFloat(girlDetails.lon),
            tz: 5.5
          }
        },
        boy: {
          name: boyDetails.name || "Boy",
          datetime: `${boyDetails.date}T${boyDetails.time}:00Z`,
          location: {
            lat: parseFloat(boyDetails.lat),
            lon: parseFloat(boyDetails.lon),
            tz: 5.5
          }
        }
      });

      console.log("Matchmaking API Response:", response.data);

      if (response.data.success) {
        setMatchingResult(response.data.data);
        toast.success("Compatibility report generated successfully!");
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        toast.error(response.data.message || "Failed to generate report.");
      }
    } catch (err: any) {
      console.error("Matchmaking Error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] overflow-x-hidden relative">
      <style>{premiumStyles}</style>

      {/* Decorative Ornaments */}
      <div className="absolute top-20 left-[-10%] opacity-[0.03] text-burgundy animate-spin-slow pointer-events-none">
        <GiLotus size={600} />
      </div>
      <div className="absolute top-[40%] right-[-5%] opacity-[0.02] text-burgundy animate-float pointer-events-none">
        <GiFlowerEmblem size={400} />
      </div>
      <div className="absolute bottom-20 left-[-5%] opacity-[0.03] text-burgundy animate-float pointer-events-none">
        <GiStarShuriken size={300} />
      </div>

      {/* Page Header Enhancement */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#301118] via-[#4a1c26] to-[#301118] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[40px] border-white/5 rounded-full blur-3xl"></div>

        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#fd641022] p-4 rounded-full border border-[#fd6410] animate-pulse-soft">
              <GiSparkles className="text-[#fd6410] text-3xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Premium <span className="text-[#fd6410]">Guna Milan</span> Report
          </h1>
          <p className="text-xl md:text-2xl text-orange-100/80 max-w-3xl mx-auto font-light italic leading-relaxed">
            &quot;A divine harmony analysis based on ancient Vedic scriptures for a prosperous and blissful union.&quot;
          </p>
          <div className="mt-10 flex justify-center gap-4 text-xs font-black uppercase tracking-[4px]">
            <span className="bg-white/10 px-6 py-2 rounded-full border border-white/5">Authentic Parashara System</span>
            <span className="bg-white/10 px-6 py-2 rounded-full border border-white/5">Ashta Koot Analysis</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="relative z-20 -mt-20 px-4 pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="row g-4 md:g-6">
              {/* Boy's Details */}
              <div className="col-lg-6">
                <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-blue-500/50 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden h-100">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                    <GiStarShuriken size={100} />
                  </div>
                  <div className="flex items-center gap-6 mb-10 pb-6 border-b border-burgundy/5 leading-none">
                    <div className="bg-blue-500/10 p-4 rounded-3xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                      <FaMars size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-burgundy mb-2">Boy&apos;s Information</h3>
                      <p className="text-[10px] text-[#fd6410] font-black uppercase tracking-widest m-0">The Prospective Groom</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                        placeholder="Full Name"
                        value={boyDetails.name}
                        onChange={(e) => handleInputChange("boy", "name", e.target.value)}
                      />
                    </div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                          value={boyDetails.date}
                          onChange={(e) => handleInputChange("boy", "date", e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="time"
                          className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                          value={boyDetails.time}
                          onChange={(e) => handleInputChange("boy", "time", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <LocationAutocomplete
                        placeholder="Birth Place (City, State)"
                        onSelect={(val) => handleLocationSelect("boy", val)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Girl's Details */}
              <div className="col-lg-6">
                <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-pink-500/50 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden h-100">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                    <GiFlowerEmblem size={100} />
                  </div>
                  <div className="flex items-center gap-6 mb-10 pb-6 border-b border-burgundy/5 leading-none">
                    <div className="bg-pink-500/10 p-4 rounded-3xl text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500 shadow-lg">
                      <FaVenus size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-burgundy mb-2">Girl&apos;s Information</h3>
                      <p className="text-[10px] text-[#fd6410] font-black uppercase tracking-widest m-0">The Prospective Bride</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                        placeholder="Full Name"
                        value={girlDetails.name}
                        onChange={(e) => handleInputChange("girl", "name", e.target.value)}
                      />
                    </div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                          value={girlDetails.date}
                          onChange={(e) => handleInputChange("girl", "date", e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="time"
                          className="form-control rounded-2xl py-4 pl-6 border border-burgundy/10 bg-white/50 text-sm shadow-sm focus:bg-white focus:ring-4 focus:ring-[#fd641011] transition-all"
                          value={girlDetails.time}
                          onChange={(e) => handleInputChange("girl", "time", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <LocationAutocomplete
                        placeholder="Birth Place (City, State)"
                        onSelect={(val) => handleLocationSelect("girl", val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              {error && (
                <p className="text-red-500 font-bold mb-6 animate-bounce">
                  {error}
                </p>
              )}
              <button
                disabled={loading}
                onClick={handleMatch}
                className="bg-burgundy text-white py-4 px-12 rounded-full uppercase tracking-[4px] text-xs font-black shadow-[0_15px_30px_rgba(48,17,24,0.3)] hover:scale-105 hover:bg-[#fd6410] transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    Analyzing Destiny <FaSpinner className="animate-spin" />
                  </>
                ) : (
                  <>
                    Match Kundali Now <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><MdOutlineSecurity size={16} /> 100% Private</div>
                <div className="w-1 h-1 bg-burgundy rounded-full"></div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><FaRegCheckCircle size={14} /> Vedic Verified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {matchingResult && (
        <section ref={resultsRef} className="pb-32 relative">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Premium Result Container */}
              <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(48,17,24,0.15)] overflow-hidden border border-burgundy/5">
                <div className="p-8 md:p-20 relative">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] animate-spin-slow">
                    <GiLotus size={300} />
                  </div>

                  {/* Enhanced Result Header */}
                  <div className="text-center mb-16 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[#fd641012] text-[#fd6410] px-8 py-2 rounded-full text-[12px] font-black uppercase tracking-[4px] mb-10 border border-[#fd641022]">
                      <GiSparkles /> Analysis Complete <GiSparkles />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-12 leading-tight tracking-tight">
                      Divine <span className="text-[#fd6410]">Compatibility</span> Verdict
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32">
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-blue-500/5 rounded-[2.5rem] flex items-center justify-center mb-6 border border-blue-100 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                          <FaMars className="text-blue-500 text-4xl" />
                        </div>
                        <p className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest mb-1">Groom</p>
                        <h4 className="text-2xl font-black text-burgundy tracking-tight">{boyDetails.name || "Boy"}</h4>
                      </div>

                      <div className="relative">
                        <div className="w-20 h-20 bg-[#fd6410] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(253,100,16,0.5)] z-10 relative animate-pulse-soft">
                          <FaHeart size={32} />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-burgundy/10 to-transparent hidden md:block"></div>
                      </div>

                      <div className="text-center group">
                        <div className="w-28 h-28 bg-pink-500/5 rounded-[2.5rem] flex items-center justify-center mb-6 border border-pink-100 group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
                          <FaVenus className="text-pink-500 text-4xl" />
                        </div>
                        <p className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest mb-1">Bride</p>
                        <h4 className="text-2xl font-black text-burgundy tracking-tight">{girlDetails.name || "Girl"}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Main Outcome Grid */}
                  <div className="row g-5">
                    {/* Visual Score Gauge */}
                    <div className="col-lg-5">
                      <div className="bg-[#fffcf9] rounded-[3.5rem] p-12 border border-burgundy/5 text-center h-100 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:rotate-12 transition-transform">
                          <GiFlowerEmblem size={150} />
                        </div>
                        <h3 className="text-[12px] font-black text-burgundy uppercase tracking-[4px] mb-10 relative z-10">Milan Score</h3>

                        <div className="relative inline-flex items-center justify-center z-10">
                          <svg className="w-56 h-56 transform -rotate-90">
                            <circle className="text-[#30111808]" strokeWidth="16" stroke="currentColor" fill="transparent" r="95" cx="112" cy="112" />
                            <circle
                              className="text-[#fd6410] transition-all duration-1000 ease-out"
                              strokeWidth="16"
                              strokeDasharray={`${((matchingResult.guna_milan?.total_points ?? 0) / (matchingResult.guna_milan?.maximum_points ?? 36)) * (2 * Math.PI * 95)} ${2 * Math.PI * 95}`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="95"
                              cx="112"
                              cy="112"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-7xl font-black text-burgundy leading-none mb-2 tracking-tighter">
                              {matchingResult.guna_milan?.total_points ?? 0}
                            </span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[2px]">Points of 36</span>
                          </div>
                        </div>

                        <div className="mt-12 relative z-10">
                          <div
                            className={`px-12 py-4 rounded-full text-xs font-black uppercase tracking-[3px] shadow-2xl transition-all ${(matchingResult.guna_milan?.total_points ?? 0) >= 18
                              ? "bg-green-500 text-white shadow-green-200"
                              : "bg-burgundy text-white shadow-burgundy/20"
                              }`}
                          >
                            {(matchingResult.guna_milan?.total_points ?? 0) >= 18
                              ? "Excellent Harmony"
                              : "Moderate Match"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pro Expert Verdict */}
                    <div className="col-lg-7">
                      <div className="bg-gradient-to-br from-[#301118] to-[#1a090d] rounded-[3.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] h-100 group">
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 p-10 opacity-[0.05] animate-float">
                          <GiLotus size={250} />
                        </div>

                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                            <div className="bg-[#fd6410] p-6 rounded-[2rem] flex items-center justify-center shrink-0 shadow-[0_15px_30px_rgba(253,100,16,0.3)] rotate-3">
                              <MdOutlineSecurity size={48} />
                            </div>
                            <div className="text-center md:text-left">
                              <h4 className="text-[12px] font-black uppercase tracking-[5px] mb-2 text-[#fd6410] opacity-80">Astro-Expert Conclusion</h4>
                              <p className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">Master Summary</p>
                            </div>
                          </div>

                          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                            <p className="text-xl md:text-2xl italic opacity-90 leading-relaxed m-0 font-light border-l-4 border-[#fd6410] pl-8">
                              &quot;{renderContent(matchingResult.message?.description || "Our automated analysis indicates a significant celestial alignment.")}&quot;
                            </p>
                          </div>

                          <div className="mt-12 pt-10 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-6">
                            <button className="bg-[#fd6410] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-[#fd641022]" onClick={() => window.print()}>Print Detailed Report</button>
                            <button className="bg-white/5 text-white border border-white/20 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Download PDF</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ashta Koot Details */}
                  {matchingResult.guna_milan?.ashta_koot && (
                    <div className="mt-20 relative z-10">
                      <div className="flex items-center gap-8 mb-12">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fd64101a]"></div>
                        <h4 className="text-[16px] font-black uppercase tracking-[6px] text-burgundy whitespace-nowrap">
                          <span className="text-[#fd6410]">Ashta Koot</span> breakdown
                        </h4>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fd64101a]"></div>
                      </div>

                      <div className="row g-4">
                        {Object.entries(matchingResult.guna_milan.ashta_koot).map(([key, value]: [string, any], idx) => (
                          <div key={key} className="col-md-6 col-lg-3">
                            <div className="bg-white border border-burgundy/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <GiSparkles size={40} className="text-[#fd6410]" />
                              </div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#fd6410] mb-2">Factor {idx + 1}</p>
                              <h5 className="text-lg font-black text-burgundy capitalize mb-4">{key}</h5>
                              <div className="flex justify-between items-end">
                                <div>
                                  <span className="text-3xl font-black text-burgundy">{value.points}</span>
                                  <span className="text-[10px] font-bold text-gray-300 uppercase ml-2">/ {value.maximum_points}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${value.points > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                  {value.description}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Methodology Section */}
      <section className="py-32 bg-[#301118] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#fd6410] opacity-[0.03] rounded-full blur-[120px] -mr-[400px] -mt-[400px]"></div>
        <div className="container relative z-10">
          <div className="row justify-content-center mb-20">
            <div className="col-lg-8 text-center">
              <span className="inline-block bg-[#fd6410] text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8">Vedic Methodology</span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                Authentic <span className="text-[#fd6410]">Ashtakoot</span> System
              </h2>
              <p className="text-xl text-orange-100/60 leading-relaxed font-light italic">
                Our analysis is built on the foundation of Bhrigu Samhita and Parashara Horasastra, ensuring that every guna has the spiritual weight it deserves.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {[
              { title: "Varan", desc: "Checks for personality matching", icon: FaUser },
              { title: "Vashya", desc: "Checks for mutual attraction", icon: FaHeart },
              { title: "Tara", desc: "Checks for health and longevity", icon: GiStarShuriken },
              { title: "Yoni", desc: "Checks for physical compatibility", icon: GiLion },
              { title: "Maitri", desc: "Checks for psychological bond", icon: FaHandshake },
              { title: "Gana", desc: "Checks for temperament matching", icon: GiYinYang },
              { title: "Bhakoot", desc: "Checks for overall family harmony", icon: FaUserFriends },
              { title: "Nadi", desc: "Checks for spiritual connection", icon: GiLotus }
            ].map((koot, i) => (
              <div key={koot.title} className="col-6 col-md-3">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[3rem] hover:bg-white/10 transition-all duration-500 group cursor-default h-100 relative overflow-hidden flex flex-col items-center text-center border-l-4 border-l-transparent hover:border-l-[#fd6410]">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                    <koot.icon size={120} />
                  </div>
                  <div className="bg-gradient-to-br from-[#fd6410] to-[#301118] text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-all duration-500">
                    <span className="text-sm font-black italic">{i + 1}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-[#fd6410] transition-colors">{koot.title}</h4>
                  <p className="text-[11px] text-white/50 m-0 leading-relaxed font-light italic">{koot.desc}</p>
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

export default KundaliMatchingPage;
