import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaSearch as FaSe,
  FaBolt as FaBo,
  FaGlobe as FaGl,
  FaTheaterMasks as FaTm,
  FaCheck as FaCh,
  FaTimes as FaTi,
  FaFileAlt as FaFa,
  FaChevronRight as FaCr,
} from "react-icons/fa";
const FaSearch = FaSe as any;
const FaBolt = FaBo as any;
const FaGlobe = FaGl as any;
const FaTheaterMasks = FaTm as any;
const FaCheck = FaCh as any;
const FaTimes = FaTi as any;
const FaFileAlt = FaFa as any;
const FaChevronRight = FaCr as any;

import { GiCrystalBall as GiCb, GiHorseHead as GiHh } from "react-icons/gi";
const GiCrystalBall = GiCb as any;
const GiHorseHead = GiHh as any;

import { HiOutlineSparkles as HiOs } from "react-icons/hi";
const HiOutlineSparkles = HiOs as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";

const NakshatraPage = () => {
  const nakshatras = [
    "1. Ashwini",
    "2. Bharani",
    "3. Krittika",
    "4. Rohini",
    "5. Mrigashirsha",
    "6. Ardra",
    "7. Punarvasu",
    "8. Pushya",
    "9. Ashlesha",
    "10. Magha",
    "11. Purva Phalguni",
    "12. Uttara Phalguni",
    "13. Hasta",
    "14. Chitra",
    "15. Swati",
    "16. Vishakha",
    "17. Anuradha",
    "18. Jyeshtha",
    "19. Mula",
    "20. Purva Ashadha",
    "21. Uttara Ashadha",
    "22. Shravana",
    "23. Dhanishta",
    "24. Shatabhisha",
    "25. Purva Bhadrapada",
    "26. Uttara Bhadrapada",
    "27. Revati",
  ];

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
                        Celestial Lunar Mansions
                      </span>
                      <h1>Nakshatra Details</h1>
                      <h4 className="card-title">
                        Explore the 27 Lunar Mansions
                      </h4>
                      <p>
                        (Nakshatra). Symbols of destiny, each mansion reveals
                        unique life paths and divine traits.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Know Your Birth
                          Star
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Planetary Ruler
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Deity & Symbol
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Personality
                          Traits
                        </li>
                      </ul>
                      <button className="btn-link wfc mt-4 mb-4">
                        Know Your Nakshatra
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
                    <div className="relative z-10 p-5">
                      <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                        <GiCrystalBall className="text-[#fd6410] text-7xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            {/* Sidebar - Nakshatra List */}
            <div className="col-lg-3">
              <div className="light-card border border-[#fd64102b] shadow-xl h-[800px] flex flex-col overflow-hidden p-0">
                <div className="bg-[#301118] text-white p-6">
                  <h3 className="text-lg font-bold mb-1">27 Nakshatras</h3>
                  <div className="relative mt-4">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-3 ps-9 text-xs"
                      placeholder="Search..."
                    />
                    <FaSearch
                      className="absolute left-3 top-3.5 text-gray-400"
                      size={10}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto scroll-modern p-3">
                  <div className="space-y-1">
                    {nakshatras.map((nak, i) => (
                      <button
                        key={i}
                        className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition flex justify-between items-center group ${i === 0 ? "bg-[#fd6410] text-white shadow-md" : "text-gray-600 hover:bg-[#fd64100d] hover:text-[#fd6410]"}`}
                      >
                        {nak}{" "}
                        <FaChevronRight
                          size={8}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-9">
              {/* Nakshatra Detail Card */}
              <div className="light-card border border-[#fd64102b] p-8 md:p-12 shadow-xl mb-12">
                <div className="row g-8 align-items-center">
                  <div className="col-md-4 text-center">
                    <div className="w-48 h-48 rounded-full border-4 border-[#fd6410] shadow-2xl mx-auto flex items-center justify-center bg-gray-50 relative group">
                      <FaBolt
                        size={60}
                        className="text-[#fd6410] animate-pulse"
                      />
                      <div className="absolute -bottom-4 bg-[#301118] text-white text-[9px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest whitespace-nowrap">
                        0° - 13° 20&apos; Aries
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <span className="text-[#fd6410] font-bold text-[10px] uppercase tracking-widest block mb-2">
                      The Star of Transport
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#301118] mb-4">
                      Ashwini
                    </h1>
                    <p className="text-gray-500 italic leading-relaxed mb-6">
                      Ashwini is the first Nakshatra, symbolizing new
                      beginnings, speed, and healing. Ruled by Ketu and
                      associated with horses, it brings vitality.
                    </p>
                    <div className="row g-3">
                      {[
                        { icon: <FaGlobe />, label: "Planet", val: "Ketu" },
                        {
                          icon: <FaTheaterMasks />,
                          label: "Deity",
                          val: "Ashwini Kumars",
                        },
                        {
                          icon: <GiHorseHead />,
                          label: "Symbol",
                          val: "Horse Head",
                        },
                      ].map((item, i) => (
                        <div key={i} className="col-sm-4">
                          <div className="bg-[#fd641008] border border-[#fd64101a] rounded-lg p-3 flex items-center gap-3">
                            <div className="text-[#fd6410]">{item.icon}</div>
                            <div>
                              <p className="text-[8px] text-gray-400 font-bold uppercase mb-0">
                                {item.label}
                              </p>
                              <p className="text-xs font-bold text-[#301118] mb-0">
                                {item.val}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tabs Refactored to Cards */}
              <div className="row g-4 mb-12">
                <div className="col-md-6">
                  <div className="light-card border border-green-100 bg-green-50/20 p-8 h-100">
                    <h3 className="text-lg font-bold text-[#301118] mb-5 flex items-center gap-2">
                      <FaCheck className="text-green-500" /> Core Strengths
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Competent higher performing career.",
                        "Self-sufficient intelligence.",
                        "Natural healing inclination.",
                        "Adventurous exploring spirit.",
                      ].map((t, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-gray-700 font-medium italic"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>{" "}
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="light-card border border-red-100 bg-red-50/20 p-8 h-100">
                    <h3 className="text-lg font-bold text-[#301118] mb-5 flex items-center gap-2">
                      <FaTimes className="text-red-500" /> Shadow Traits
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Impulsive and stubborn nature.",
                        "Unfinished tasks tendency.",
                        "Tendency to be aggressive.",
                        "Satisfaction struggles.",
                      ].map((t, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-gray-700 font-medium italic"
                        >
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></div>{" "}
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="light-card border border-[#fd64102b] p-10 shadow-xl mb-12">
                <h2 className="title-line mb-8">
                  <span>Detailed Analysis</span>
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-4 font-medium italic">
                  <p>
                    People born under Ashwini Nakshatra are known for their
                    spontaneity and enthusiasm. Being the first Nakshatra, they
                    possess the energy of a &quot;starter.&quot; They are quick
                    to act and often pioneers in their fields.
                  </p>
                  <p>
                    However, this speed can translate to impatience. Ashwini
                    natives may struggle with long-term projects that require
                    sustained effort.
                  </p>
                </div>

                <div className="row g-4 mt-8">
                  {[
                    { label: "Gana", val: "Deva (Divine)" },
                    { label: "Varna", val: "Vaishya" },
                    { label: "Element", val: "Earth" },
                    { label: "Color", val: "Blood Red" },
                  ].map((p, i) => (
                    <div key={i} className="col-3">
                      <div className="text-center bg-gray-50 p-4 rounded-3 border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                          {p.label}
                        </p>
                        <p className="text-xs font-bold text-[#301118] mb-0">
                          {p.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Card */}
              <div className="bg-[#301118] rounded-4 p-8 md:p-12 text-white relative overflow-hidden group">
                <HiOutlineSparkles className="absolute top-0 right-0 text-white/5 text-[200px] -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
                <div className="row align-items-center relative z-10">
                  <div className="col-md-8">
                    <span className="text-[#fd6410] font-bold text-[10px] uppercase tracking-widest block mb-2">
                      Premium Content
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      Detailed Personal Report
                    </h2>
                    <p className="text-gray-300 italic mb-0">
                      Get a 50+ page horoscope report analyzing your Nakshatra,
                      Dasha periods, and future predictions.
                    </p>
                  </div>
                  <div className="col-md-4 text-center mt-6 mt-md-0">
                    <button className="btn-link py-4 px-10 shadow-xl block w-full mb-3">
                      Get Report for ₹299
                    </button>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <FaFileAlt /> Instant Download
                    </div>
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

export default NakshatraPage;
