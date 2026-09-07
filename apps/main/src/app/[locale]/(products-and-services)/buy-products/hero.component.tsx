import React from "react";
import Image from "next/image";
import { FaGem } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#FFF9F4]">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-7/12 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/10 text-orange font-bold text-xs uppercase tracking-[0.2em] rounded-full border border-orange/20 shadow-sm">
                <i className="fa-solid fa-sparkles"></i>
                Authentic Vedic Remedies
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-[#301118] leading-[1.1] tracking-tight">
                Astro <span className="text-orange">Marketplace</span>
              </h1>
              <h4 className="text-xl md:text-2xl font-bold text-orange/80 italic">
                Energize Your Life with Sacred Gems
              </h4>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Discover a curated collection of lab-certified gemstones, energized yantras, 
                and authentic spiritual products to enhance your cosmic well-being.
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "100% Lab Certified Gemstones",
                "Energized Vedic Yantras",
                "Premium Rudraksha Beads",
                "Pan India Delivery"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700 group hover:text-orange transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-orange/10 text-orange flex items-center justify-center border border-orange/20 shadow-sm group-hover:bg-orange group-hover:text-white transition-all">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button className="group relative px-10 py-5 bg-[#301118] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:bg-orange transition-all duration-300 transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center gap-3">
                  Explore Products
                  <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Illustration Content */}
          <div className="w-full lg:w-5/12 relative animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="relative aspect-square max-w-[500px] mx-auto">
              {/* Spinning Zodiac Background */}
              <div className="absolute inset-0 opacity-20 transform scale-110">
                <Image
                  src="/images/horoscope-round2.png"
                  alt="Zodiac"
                  fill
                  className="animate-[spin_40s_linear_infinite]"
                />
              </div>
              
              {/* Premium Gem Illustration */}
              <div className="relative h-full flex items-center justify-center p-12">
                <div className="relative group">
                  <div className="absolute inset-0 bg-orange/20 rounded-full blur-3xl group-hover:bg-orange/40 transition-all duration-500"></div>
                  <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border-8 border-white shadow-premium overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000"></div>
                    <FaGem className="text-orange text-8xl md:text-9xl transform -rotate-12 drop-shadow-2xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
