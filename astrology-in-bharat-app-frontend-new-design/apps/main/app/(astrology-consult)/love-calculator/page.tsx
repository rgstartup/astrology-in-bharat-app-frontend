"use client";
import React, { useState, useRef } from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaHeart as FaH,
  FaUser as FaU,
  FaUserFriends as FaUf,
  FaRing as FaR,
  FaArrowRight as FaAr,
  FaStar as FaS,
  FaBalanceScale as FaBs,
  FaBullseye as FaBul,
  FaMars as FaM,
  FaVenus as FaV,
  FaChevronRight as FaCr,
  FaSpinner as FaSp,
  FaHandshake as FaHs,
} from "react-icons/fa";
const FaHeart = FaH as any;
const FaUser = FaU as any;
const FaUserFriends = FaUf as any;
const FaRing = FaR as any;
const FaArrowRight = FaAr as any;
const FaStar = FaS as any;
const FaBalanceScale = FaBs as any;
const FaBullseye = FaBul as any;
const FaMars = FaM as any;
const FaVenus = FaV as any;
const FaChevronRight = FaCr as any;
const FaSpinner = FaSp as any;
const FaHandshake = FaHs as any;

import { TbCrystalBall as TbCb } from "react-icons/tb";
const TbCrystalBall = TbCb as any;
import { MdOutlineFavorite as MdOf, MdOutlineSecurity as MdOs } from "react-icons/md";
const MdOutlineFavorite = MdOf as any;
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
import { ZodiacSignsData } from "@/components/features/services/homePagaData";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import axios from "axios";
import { toast } from "react-toastify";

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

const LoveCalculatorPage = () => {
  const [activeMode, setActiveMode] = useState<"simple" | "advanced">("simple");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Simple Mode State
  const [simpleData, setSimpleData] = useState({
    p1Name: "",
    p1Gender: "male",
    p2Name: "",
    p2Gender: "female",
  });

  // Advanced Mode State
  const [advancedData, setAdvancedData] = useState({
    boy: { name: "", date: "", time: "", lat: "", lon: "", tz: 5.5, locationName: "" },
    girl: { name: "", date: "", time: "", lat: "", lon: "", tz: 5.5, locationName: "" },
  });

  // Helper to safely render any content (string, object, array)
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

  const handleSimpleInputChange = (field: string, value: string) => {
    setSimpleData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdvancedInputChange = (gender: "boy" | "girl", field: string, value: any) => {
    setAdvancedData((prev) => ({
      ...prev,
      [gender]: { ...prev[gender], [field]: value },
    }));
  };

  const handleLocationSelect = (gender: "boy" | "girl", location: { name: string; lat: string; lon: string }) => {
    handleAdvancedInputChange(gender, "locationName", location.name);
    handleAdvancedInputChange(gender, "lat", location.lat);
    handleAdvancedInputChange(gender, "lon", location.lon);
  };

  const calculateSimpleLove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simpleData.p1Name || !simpleData.p2Name) {
      toast.error("Please enter both names");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/v1/matchmaking/love-calculator", {
        yourName: simpleData.p1Name,
        partnerName: simpleData.p2Name
      });

      if (response.data.success) {
        setResult({ type: "simple", ...response.data.data });
        toast.success("Love score calculated!");
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        toast.error(response.data.message || "Failed to calculate love score.");
      }
    } catch (err: any) {
      console.error("Love Calculator Error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to calculate love score.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAdvancedMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { boy, girl } = advancedData;
    if (!boy.date || !boy.time || !boy.lat || !girl.date || !girl.time || !girl.lat) {
      toast.error("Please fill in all birth details");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/v1/matchmaking/guna-milan", {
        girl: {
          name: girl.name || "Girl",
          datetime: `${girl.date}T${girl.time}:00Z`,
          location: { lat: parseFloat(girl.lat), lon: parseFloat(girl.lon), tz: girl.tz }
        },
        boy: {
          name: boy.name || "Boy",
          datetime: `${boy.date}T${boy.time}:00Z`,
          location: { lat: parseFloat(boy.lat), lon: parseFloat(boy.lon), tz: boy.tz }
        }
      });

      if (response.data.success) {
        setResult({ type: "advanced", data: response.data.data });
        toast.success("Advanced Guna Milan report generated!");
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        toast.error(response.data.message || "Failed to calculate match");
      }
    } catch (error: any) {
      console.error("Matchmaking Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-[#fd6410]/20">
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#301118] via-[#4a1c26] to-[#301118] text-white overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#fd6410] opacity-[0.05] rounded-full blur-[100px] animate-pulse-soft"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#d4af37] opacity-[0.03] rounded-full blur-[100px] animate-pulse-soft"></div>

          {/* Floating Vedic Symbols */}
          <div className="absolute top-[20%] right-[10%] opacity-10 animate-float">
            <GiLotus size={180} className="text-white" />
          </div>
          <div className="absolute bottom-[20%] left-[8%] opacity-5 animate-spin-slow">
            <GiFlowerEmblem size={250} className="text-white font-thin" />
          </div>
          <div className="absolute top-[40%] left-[15%] opacity-10 animate-float" style={{ animationDelay: "2s" }}>
            <GiStarShuriken size={80} className="text-[#d4af37]" />
          </div>
        </div>

        <div className="container relative z-10 px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="inline-block bg-[#fd6410] text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8 animate-fade-in">
              Cosmic Compatibility
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none overflow-visible py-2">
              Love <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fd6410] via-[#ff8c42] to-[#fd6410]">Calculator</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100/60 leading-relaxed font-light italic mb-12">
              Discover how your stars align and explore the ultimate connection between you and your partner with ancient Vedic wisdom.
            </p>

            {/* Mode Switcher */}
            <div className="inline-flex p-2 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 gap-2 mb-8">
              <button
                onClick={() => setActiveMode("simple")}
                className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-500 ${activeMode === "simple"
                  ? "bg-gradient-to-r from-[#fd6410] to-[#ff8c42] text-white shadow-xl scale-105"
                  : "hover:bg-white/5 text-white/60"
                  }`}
              >
                <TbCrystalBall size={20} />
                Simple Match
              </button>
              <button
                onClick={() => setActiveMode("advanced")}
                className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-500 ${activeMode === "advanced"
                  ? "bg-gradient-to-r from-[#fd6410] to-[#ff8c42] text-white shadow-xl scale-105"
                  : "hover:bg-white/5 text-white/60"
                  }`}
              >
                <GiSparkles size={20} />
                Advanced Guna
              </button>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[#301118] bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-orange-100/40">
                <span className="text-white">10M+</span> Cosmic connections calculated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Form Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-[#fd6410]/50 relative overflow-hidden">
            {/* Decorative background for the card */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                {activeMode === "simple" ? (
                  <>Find Love <span className="text-red-500 underline decoration-red-100 decoration-2 underline-offset-4">(Percentage)%</span> Between</>
                ) : (
                  "Enter Birth Details"
                )}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2"></div>
            </div>

            {activeMode === "simple" ? (
              <form onSubmit={calculateSimpleLove} className="max-w-3xl mx-auto">
                <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white">
                  <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 relative">

                    {/* Person 1 */}
                    <div className="flex-1 w-full space-y-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">Your Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            style={{ borderRadius: '9999px' }}
                            className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                            placeholder="Type your name..."
                            value={simpleData.p1Name}
                            onChange={(e) => handleSimpleInputChange("p1Name", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleSimpleInputChange("p1Gender", "male")}
                          style={{ borderRadius: '9999px' }}
                          className={`flex-1 py-2.5 font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${simpleData.p1Gender === "male" ? "bg-red-500 text-white shadow-red-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimpleInputChange("p1Gender", "female")}
                          style={{ borderRadius: '9999px' }}
                          className={`flex-1 py-2.5 font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${simpleData.p1Gender === "female" ? "bg-red-500 text-white shadow-red-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                        >
                          Female
                        </button>
                      </div>
                    </div>

                    {/* Divider with Heart */}
                    <div className="hidden md:flex flex-col items-center justify-center px-4 relative h-full self-stretch">
                      <div className="w-[1px] bg-gray-100 h-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-9 h-9 bg-white rounded-full shadow-md border border-burgundy/5 flex items-center justify-center">
                          <FaHeart className="text-red-500" size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Divider (Heart only) */}
                    <div className="md:hidden flex items-center justify-center py-6">
                      <div className="w-9 h-9 bg-white rounded-full shadow-md border border-burgundy/5 flex items-center justify-center">
                        <FaHeart className="text-red-500" size={14} />
                      </div>
                    </div>

                    {/* Person 2 */}
                    <div className="flex-1 w-full space-y-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">Partner's Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            style={{ borderRadius: '9999px' }}
                            className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                            placeholder="Type their name..."
                            value={simpleData.p2Name}
                            onChange={(e) => handleSimpleInputChange("p2Name", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleSimpleInputChange("p2Gender", "male")}
                          style={{ borderRadius: '9999px' }}
                          className={`flex-1 py-2.5 font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${simpleData.p2Gender === "male" ? "bg-red-500 text-white shadow-red-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimpleInputChange("p2Gender", "female")}
                          style={{ borderRadius: '9999px' }}
                          className={`flex-1 py-2.5 font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${simpleData.p2Gender === "female" ? "bg-red-500 text-white shadow-red-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                        >
                          Female
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="text-center mt-10">
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ borderRadius: '9999px' }}
                      className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaHeart className="group-hover:scale-125 transition-transform" />
                      )}
                      {loading ? "Calculating..." : "Calculate Love %"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
                </div>
              </form>
            ) : (
              <form onSubmit={calculateAdvancedMatch} className="max-w-5xl mx-auto">
                {/* Advanced Guna Milan Form (Vedic Style) */}
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Boy's Section */}
                  <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-t-4 border-t-blue-500/50 group transition-all duration-500 hover:shadow-2xl h-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                      <GiStarShuriken size={100} />
                    </div>
                    <div className="flex items-center gap-6 mb-10 pb-6 border-b border-burgundy/5">
                      <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <FaMars size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-burgundy mb-1">Boy's Info</h3>
                        <p className="text-[10px] text-[#fd6410] font-black uppercase tracking-widest">Prospective Groom</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="relative group/field">
                        <input
                          type="text"
                          required
                          className="w-full bg-white/50 border-2 border-burgundy/5 rounded-2xl px-6 py-4 text-burgundy font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                          placeholder="Full Name"
                          value={advancedData.boy.name}
                          onChange={(e) => handleAdvancedInputChange("boy", "name", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          required
                          className="bg-white/50 border-2 border-burgundy/5 rounded-2xl px-4 py-4 text-burgundy font-bold focus:bg-white outline-none"
                          value={advancedData.boy.date}
                          onChange={(e) => handleAdvancedInputChange("boy", "date", e.target.value)}
                        />
                        <input
                          type="time"
                          required
                          className="bg-white/50 border-2 border-burgundy/5 rounded-2xl px-4 py-4 text-burgundy font-bold focus:bg-white outline-none"
                          value={advancedData.boy.time}
                          onChange={(e) => handleAdvancedInputChange("boy", "time", e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <LocationAutocomplete
                          placeholder="Birth Place"
                          onSelect={(loc) => handleLocationSelect("boy", loc)}
                          className="w-full bg-white/50 border-2 border-burgundy/5 rounded-2xl px-6 py-4 text-burgundy font-bold focus:bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Girl's Section */}
                  <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-t-4 border-t-pink-500/50 group transition-all duration-500 hover:shadow-2xl h-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <GiLotus size={120} />
                    </div>
                    <div className="flex items-center gap-6 mb-10 pb-6 border-b border-burgundy/5">
                      <div className="bg-pink-500/10 p-4 rounded-2xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500">
                        <FaVenus size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-burgundy mb-1">Girl's Info</h3>
                        <p className="text-[10px] text-[#fd6410] font-black uppercase tracking-widest">Prospective Bride</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="relative group/field">
                        <input
                          type="text"
                          required
                          className="w-full bg-white/50 border-2 border-burgundy/5 rounded-2xl px-6 py-4 text-burgundy font-bold focus:bg-white focus:border-pink-500 outline-none transition-all"
                          placeholder="Full Name"
                          value={advancedData.girl.name}
                          onChange={(e) => handleAdvancedInputChange("girl", "name", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          required
                          className="bg-white/50 border-2 border-burgundy/5 rounded-2xl px-4 py-4 text-burgundy font-bold focus:bg-white outline-none"
                          value={advancedData.girl.date}
                          onChange={(e) => handleAdvancedInputChange("girl", "date", e.target.value)}
                        />
                        <input
                          type="time"
                          required
                          className="bg-white/50 border-2 border-burgundy/5 rounded-2xl px-4 py-4 text-burgundy font-bold focus:bg-white outline-none"
                          value={advancedData.girl.time}
                          onChange={(e) => handleAdvancedInputChange("girl", "time", e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <LocationAutocomplete
                          placeholder="Birth Place"
                          onSelect={(loc) => handleLocationSelect("girl", loc)}
                          className="w-full bg-white/50 border-2 border-burgundy/5 rounded-2xl px-6 py-4 text-burgundy font-bold focus:bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-16">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group inline-flex items-center gap-6 bg-burgundy text-white px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-[4px] text-sm hover:bg-[#fd6410] transition-all duration-500 shadow-2xl disabled:opacity-50 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {loading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <GiSparkles className="group-hover:rotate-45 transition-transform" />
                      )}
                      {loading ? "Analyzing Charts..." : "Generate Guna Report"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Result Section */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] animate-spin-slow pointer-events-none">
                    <GiLotus size={300} />
                  </div>

                  {result.type === "simple" ? (
                    <div className="relative z-10">
                      <div className="text-center mb-16">
                        <span className="inline-block bg-[#fd6410]/10 text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                          Match Results
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                          Your <span className="text-[#fd6410]">Love Score</span>
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mb-16"></div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="relative mb-16">
                          {/* Premium Gauge/Ring for Love Score */}
                          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                            <div className="absolute inset-0 rounded-full border-8 border-[#fd6410] border-t-transparent animate-spin-slow opacity-20"></div>
                            <div className="text-center">
                              <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                                {result.score}<span className="text-4xl text-[#fd6410]">%</span>
                              </span>
                              <span className="text-[12px] font-black uppercase tracking-[4px] text-[#fd6410] mt-4 block">
                                Cosmic Bond
                              </span>
                            </div>
                            <FaHeart className="absolute -top-4 -right-4 text-pink-500 text-5xl animate-bounce shadow-xl" />
                          </div>
                        </div>

                        <div className="max-w-2xl text-center">
                          <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fd6410] p-4 rounded-2xl shadow-lg">
                              <TbCrystalBall size={32} />
                            </div>
                            <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90">
                              "{renderContent(result.message)}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      <div className="text-center mb-16">
                        <span className="inline-block bg-burgundy text-[#d4af37] px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-[4px] mb-8 shadow-xl">
                          Vedic Compatibility Report
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                          Guna Milan <span className="text-[#fd6410]">Score</span>
                        </h2>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="bg-white rounded-[4rem] p-12 shadow-sm border border-orange-50 text-center relative group">
                          <div className="relative inline-flex items-center justify-center mb-10 overflow-visible py-4">
                            <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90">
                              <circle className="text-gray-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="90" cx="128" cy="128" />
                              <circle
                                className="text-[#fd6410] transition-all duration-1000 ease-out"
                                strokeWidth="12"
                                strokeDasharray={`${(result.data.guna_milan.total_points / 36) * 565} 565`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="90"
                                cx="128"
                                cy="128"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-6xl md:text-8xl font-black text-burgundy">{result.data.guna_milan.total_points}</span>
                              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Out of 36</span>
                            </div>
                          </div>
                          <div>
                            <div className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest ${result.data.guna_milan.total_points >= 18 ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-burgundy text-white shadow-lg shadow-orange-100"}`}>
                              {result.data.guna_milan.total_points >= 18 ? "Good Compatibility" : "Moderate Match"}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-burgundy to-[#4a1c26] rounded-[4rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                          <div className="absolute top-[-20%] right-[-10%] opacity-10 animate-spin-slow">
                            <GiLotus size={200} />
                          </div>
                          <div className="relative z-10">
                            <span className="text-[#fd6410] font-black uppercase tracking-[4px] text-[10px] mb-6 block">Expert Vedic Analysis</span>
                            <h3 className="text-3xl font-black mb-8 leading-tight">Match <span className="text-[#fd6410]">Summary</span></h3>
                            <p className="text-xl font-light italic text-orange-100/80 leading-relaxed mb-10 border-l-2 border-[#fd6410]/30 pl-8">
                              "{renderContent(result.data.message)}"
                            </p>
                            <div className="flex items-center gap-6 p-4 bg-white/5 rounded-3xl border border-white/5">
                              <div className="w-12 h-12 rounded-full bg-[#fd6410] flex items-center justify-center text-white shadow-xl">
                                <FaSpinner className="animate-pulse" />
                              </div>
                              <p className="text-sm font-bold text-orange-50/60 m-0">Report processed via deep Vedic algorithms</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ashta Koot Breakdown Table (Premium Styling) */}
                      <div className="bg-[#fff9f6] rounded-[3rem] p-8 md:p-12 border border-orange-100">
                        <div className="flex items-center justify-between mb-12">
                          <h4 className="text-xl font-black text-burgundy tracking-tight">Ashta Koot Breakdown</h4>
                          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-orange-50">
                            <span className="text-xs font-bold text-gray-400">Match Accuracy: </span>
                            <span className="text-xs font-black text-[#fd6410]">100% Verified</span>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b-2 border-burgundy/5">
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-burgundy/40">Component</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-burgundy/40">Significance</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-burgundy/40">Score</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-burgundy/40 text-right">Interpretation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(result.data.guna_milan.ashta_koot).map(([key, val]: [string, any], idx) => (
                                <tr key={key} className={`group hover:bg-white transition-all duration-300 ${idx === Object.entries(result.data.guna_milan.ashta_koot).length - 1 ? "" : "border-b border-burgundy/5"}`}>
                                  <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-orange-100/30 flex items-center justify-center text-burgundy group-hover:bg-[#fd6410] group-hover:text-white transition-all duration-500">
                                        <span className="text-xs font-black italic">{idx + 1}</span>
                                      </div>
                                      <span className="font-black text-burgundy capitalize text-sm">{key}</span>
                                    </div>
                                  </td>
                                  <td className="py-6 px-4 text-xs text-gray-500 font-medium italic">
                                    {key === "varna" && "Personality & Ego Matching"}
                                    {key === "vashya" && "Mutual Attraction & Power Balance"}
                                    {key === "tara" && "Health, Longevity & Destiny"}
                                    {key === "yoni" && "Physical & Emotional Intimacy"}
                                    {key === "maitri" && "Friendship & Psychology"}
                                    {key === "gana" && "Temperament & Social Affinity"}
                                    {key === "bhakut" && "Family Harmony & Progeny"}
                                    {key === "nadi" && "Biological & Genetic Sync"}
                                  </td>
                                  <td className="py-6 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-black text-burgundy">{val.received_points}</span>
                                      <span className="text-gray-200">/</span>
                                      <span className="text-xs font-bold text-gray-400">{val.maximum_points}</span>
                                    </div>
                                  </td>
                                  <td className="py-6 px-4 text-right">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${val.received_points > 0 ? "bg-green-100 text-green-700 shadow-sm shadow-green-100" : "bg-red-50 text-red-500"}`}>
                                      {val.description}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Educational Section (Premium Style) */}
      <section className="py-32 bg-[#301118] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fd6410] rounded-full blur-[100px] -ml-64 -mt-64"></div>
          <GiLotus className="absolute bottom-0 right-0 -mr-32 -mb-32 animate-spin-slow" size={600} />
        </div>

        <div className="container relative z-10 px-6">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <span className="inline-block bg-[#fd6410] text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8">
              Cosmic Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">
              Decoding Your <span className="text-[#fd6410]">Compatibility</span>
            </h2>
            <p className="text-lg text-orange-100/60 font-light italic leading-relaxed">
              Explore the layers of cosmic energy that define your relationship stability and future together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Guna Milan",
                icon: <FaBullseye size={32} />,
                desc: "The foundation of Vedic compatibility based on ancient texts like Bhrigu Samhita.",
                accent: "orange"
              },
              {
                title: "Venus Harmony",
                icon: <FaStar size={32} />,
                desc: "Position of Venus in both charts determines the level of romantic resonance.",
                accent: "gold"
              },
              {
                title: "Elemental Link",
                icon: <FaBalanceScale size={32} />,
                desc: "How your basic elements (Fire, Water, Air, Earth) interact and balance each other.",
                accent: "burgundy"
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] h-100 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl">
                  <div className="w-20 h-20 rounded-3xl bg-[#fd6410] flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                  <p className="text-orange-100/40 leading-relaxed font-light italic m-0">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Services (Premium Style) */}
      <section className="py-32 bg-[#fffaf7] relative overflow-hidden">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#fd6410] font-black uppercase tracking-[4px] text-[10px] mb-4 block">Recommended for you</span>
              <h2 className="text-3xl md:text-5xl font-black text-burgundy tracking-tight">
                Unlock Deeper <span className="text-[#fd6410]">Star Guidance</span>
              </h2>
            </div>
            <a href="#" className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-burgundy hover:text-[#fd6410] transition-colors group">
              View All Services
              <div className="bg-white p-3 rounded-full shadow-md group-hover:translate-x-2 transition-transform">
                <FaChevronRight size={14} />
              </div>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Kundali Matching",
                icon: <FaUserFriends size={28} />,
                desc: "Full 36 Guna analysis for matrimonial success.",
                path: "/kundali-matching"
              },
              {
                title: "Wedding Muhurat",
                icon: <FaRing size={28} />,
                desc: "Find the most auspicious time for your union.",
                path: "/wedding-muhurat"
              },
              {
                title: "Life Report",
                icon: <TbCrystalBall size={28} />,
                desc: "Comprehensive 50-page life prediction report.",
                path: "/life-report"
              },
            ].map((s, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="glass-card p-10 rounded-[3rem] border border-orange-100 h-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.05] transition-opacity">
                    {s.icon}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#fd6410]/10 flex items-center justify-center text-[#fd6410] mb-8 group-hover:bg-[#fd6410] group-hover:text-white transition-all duration-500">
                    {s.icon}
                  </div>
                  <h4 className="text-xl font-bold text-burgundy mb-4">{s.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-light italic mb-8">{s.desc}</p>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#fd6410]">
                    Learn More <FaChevronRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default LoveCalculatorPage;
