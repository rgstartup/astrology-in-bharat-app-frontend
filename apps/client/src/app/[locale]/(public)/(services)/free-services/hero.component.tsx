import React from "react";
import Image from "next/image";
import { FaGift, FaCheckCircle } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#FFF9F4]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -ml-32 -mb-32 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-full backdrop-blur-sm">
                <FaGift className="text-sm" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Complimentary Vedic Tools
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Services</span>
              </h1>
              
              <h4 className="text-xl md:text-2xl font-bold text-slate-700 italic border-l-4 border-orange/30 pl-6">
                Insights at Your Fingertips
              </h4>
            </div>

            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-medium">
              We are crafting a suite of complimentary Vedic tools to help you navigate your destiny. 
              Stay tuned for personalized insights at zero cost.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Daily Horoscope",
                "Panchang & Muhurat",
                "Free Kundali Matching",
                "Blogs & Articles"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-bold group">
                  <div className="w-6 h-6 bg-orange/10 rounded-full flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors">
                    <FaCheckCircle className="text-[10px]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center gap-3">
                Get Free Insights
                <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
              </span>
            </button>
          </div>

          {/* Right Column - Illustration */}
          <div className="lg:col-span-5 relative flex justify-center animate-in fade-in slide-in-from-right duration-1000 delay-200">
            <div className="relative w-full max-w-[450px]">
              {/* Rotating Zodiac Wheel */}
              <div className="absolute inset-0 z-0 animate-[spin_60s_linear_infinite] opacity-10 blur-[2px]">
                <Image
                  src="/images/horoscope-round2.png"
                  alt="Zodiac"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Center Highlight */}
              <div className="relative z-10 p-12 lg:p-20">
                <div className="relative group">
                  <div className="absolute inset-0 bg-orange-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-full aspect-square bg-white rounded-full flex items-center justify-center border-[12px] border-orange-50/50 shadow-[0_30px_60px_rgba(249,115,22,0.15)] transform transition-transform group-hover:scale-105 duration-500">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-orange-200 animate-[spin_20s_linear_infinite] absolute inset-[10px]"></div>
                    <FaGift className="text-orange-500 text-7xl md:text-9xl animate-bounce-slow relative z-10 drop-shadow-2xl" />
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
