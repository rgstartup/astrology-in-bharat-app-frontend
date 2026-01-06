"use client";

import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaPray, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";

const OnlinePujaPage = () => {
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
                      Sacred Digital Rituals
                    </span>
                    <h1>Online Puja</h1>
                    <h4 className="card-title">Connect with Divine Energies</h4>
                    <p>
                      Experience the power of Vedic rituals from the comfort of
                      your home. We are establishing sacred digital portals for
                      expert-led spiritual ceremonies.
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
                      <FaPray className="text-[#fd6410] text-7xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd64100d] rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="bg-[#fd6410] w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl">
              <HiOutlineSparkles className="text-white text-4xl animate-spin-slow" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-[#301118] mb-4">
              Under Cosmic Alignment
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
              Expected Reveal: Coming Soon
            </p>

            <p className="text-gray-500 italic max-w-2xl mx-auto mb-12 leading-relaxed">
              Our Vedic priests are preparing the sacred space for your digital
              spiritual journey. Authentic rituals, live streaming, and
              personalized blessings are arriving shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="btn-link py-4 px-12 shadow-xl inline-flex items-center gap-3 no-underline"
              >
                <FaArrowLeft size={12} /> Back to Home
              </Link>
              <button className="bg-[#301118] text-white px-12 py-4 rounded-3 text-sm font-bold hover:bg-[#4a1a25] transition-colors border-0">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default OnlinePujaPage;
