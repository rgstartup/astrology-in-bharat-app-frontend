import React from "react";
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
} from "react-icons/fa";
const FaHeart = FaH as any;
const FaUser = FaU as any;
const FaUserFriends = FaUf as any;
const FaRing = FaR as any;
const FaArrowRight = FaAr as any;
const FaStar = FaS as any;
const FaBalanceScale = FaBs as any;
const FaBullseye = FaBul as any;

import { TbCrystalBall as TbCb } from "react-icons/tb";
const TbCrystalBall = TbCb as any;
import { MdOutlineFavorite as MdOf } from "react-icons/md";
const MdOutlineFavorite = MdOf as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";

const LoveCalculatorPage = () => {
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
                        Cosmic Compatibility
                      </span>
                      <h1>Love Calculator</h1>
                      <h4 className="card-title">
                        Discover Your Cosmic Connection
                      </h4>
                      <p>
                        Explore the ancient wisdom of Vedic astrology to find
                        out how your stars align. Get a detailed compatibility
                        score and understand the strengths of your relationship.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Authentic
                          Calculation
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Cosmic Sync
                          Check
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Relationship
                          Strengths
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Future
                          Possibilities
                        </li>
                      </ul>
                      <button className="btn-link wfc mt-4 mb-4">
                        Calculate Love Score
                      </button>
                      <div className="inline-flex items-center gap-2 text-[#fd6410] font-bold mt-2">
                        <MdOutlineFavorite className="animate-pulse" /> 100%
                        Private & Accurate
                      </div>
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
                        <FaHeart className="text-[#fd6410] text-7xl animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Love Calculator Tool Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] p-8 md:p-12 shadow-2xl">
            <h2 className="title-line c-1e0b0f mb-5 text-center">
              <span>Find Your Love Score</span>
            </h2>

            <form className="max-w-4xl mx-auto mt-10">
              <div className="row g-4 relative">
                {/* Mid Divider Arrow (Desktop) */}
                <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none opacity-10">
                  <FaHeart size={150} className="text-[#fd6410]" />
                </div>

                {/* Person 1 */}
                <div className="col-md-6">
                  <div className="p-4 bg-[#fdf8f4] rounded-4 border border-[#fd64101a]">
                    <h5 className="flex items-center gap-2 mb-4 text-[#301118]">
                      <FaUser className="text-[#fd6410]" /> Your Details
                    </h5>
                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                        Zodiac Sign
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm">
                        <option>Select Sign</option>
                        {ZodiacSignsData.map((s) => (
                          <option key={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Person 2 */}
                <div className="col-md-6">
                  <div className="p-4 bg-[#fff5ef] rounded-4 border border-[#fd64101a]">
                    <h5 className="flex items-center gap-2 mb-4 text-[#301118]">
                      <FaUserFriends className="text-[#fd6410]" />{" "}
                      Partner&apos;s Details
                    </h5>
                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                        Partner&apos;s Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                        Partner&apos;s Zodiac Sign
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm">
                        <option>Select Sign</option>
                        {ZodiacSignsData.map((s) => (
                          <option key={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <button
                  type="submit"
                  className="btn-link py-4 px-10 shadow-lg inline-flex w-auto hover:scale-105 transition-transform"
                >
                  Calculate Compatibility Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <h2 className="title-line color-light mb-10 text-center">
            <span>How Compatibility Works</span>
          </h2>
          <div className="row g-4">
            {[
              {
                title: "Guna Milan",
                icon: <FaBullseye />,
                desc: "Traditional Vedic matching based on moon signs and nakshatras.",
              },
              {
                title: "Planetary Harmony",
                icon: <FaStar />,
                desc: "Analyzing positions of Venus and Mars for romantic connection.",
              },
              {
                title: "Element Match",
                icon: <FaBalanceScale />,
                desc: "How Fire, Earth, Air and Water signs interact with each other.",
              },
            ].map((item, i) => (
              <div key={i} className="col-md-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-4 text-center h-100 hover:bg-white/10 transition-all group">
                  <div className="w-16 h-16 rounded-3xl bg-[#fd6410] flex items-center justify-center mx-auto mb-4 text-2xl group-hover:rotate-12 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Services */}
      <section className="space-section light-back">
        <div className="container">
          <h2 className="title-line c-1e0b0f mb-10">
            <span>Explore Deeper Insights</span>
          </h2>
          <div className="row g-4">
            {[
              {
                title: "Kundali Matching",
                icon: <FaUserFriends />,
                desc: "Complete 36 points analysis",
              },
              {
                title: "Marriage Timing",
                icon: <FaRing />,
                desc: "Find auspicious dates",
              },
              {
                title: "Relationship Report",
                icon: <TbCrystalBall />,
                desc: "Detailed life analysis",
              },
            ].map((s, i) => (
              <div key={i} className="col-md-4">
                <div className="light-card border border-[#fd64102b] p-6 text-center group cursor-pointer hover:shadow-xl h-100">
                  <div className="w-14 h-14 rounded-2xl bg-[#fdf8f4] flex items-center justify-center mx-auto mb-4 text-[#fd6410] text-xl group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h5 className="font-bold text-[#301118] mb-2">{s.title}</h5>
                  <p className="text-xs text-gray-500 mb-4">{s.desc}</p>
                  <a
                    href="#"
                    className="text-[#fd6410] font-bold text-xs flex items-center justify-center gap-2"
                  >
                    Learn More <FaArrowRight size={10} />
                  </a>
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
