"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-indigo-950">
      {/* Celestial Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      
      {/* Decorative Spinning Zodiac */}
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none z-0">
        <Image
          src="/images/horoscope-round2.png"
          alt="Zodiac"
          width={600}
          height={600}
          className="w-full h-full animate-[spin_60s_linear_infinite]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                <i className="fa-solid fa-sparkles text-orange text-xs animate-pulse"></i>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Celestial Vedic Audit</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Nakshatra <span className="text-orange italic">Milan</span> <br/>
                <span className="text-gray-400 text-6xl">Star Harmony</span>
              </h1>
              
              <p className="text-xl font-bold text-gray-400 leading-relaxed max-w-2xl italic border-l-4 border-orange/30 pl-8">
                &quot;Analyze the birth stars of both partners to determine emotional, mental, and spiritual compatibility based on ancient Vedic algorithms.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: "Birth Star Analysis", icon: "fa-star-shooting" },
                { text: "Chandra Rashi Check", icon: "fa-moon-stars" },
                { text: "Mental Compatibility", icon: "fa-brain-circuit" },
                { text: "Spiritual Alignment", icon: "fa-hands-pray" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-all duration-500 shadow-lg">
                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                  </div>
                  <span className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-wrap gap-6 items-center">
              <button
                className="group relative px-12 py-6 bg-orange text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-orange/20 hover:bg-white hover:text-indigo-950 transition-all duration-500 active:scale-[0.98] overflow-hidden"
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-4">
                  <span>Audit Star Points</span>
                  <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
                </div>
              </button>
              
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                 <i className="fa-solid fa-certificate text-orange"></i>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Certified Vedic Analysis</span>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-r from-orange/20 to-purple-500/20 rounded-[4rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-sm p-16 shadow-2xl overflow-hidden group-hover:-translate-y-4 transition-transform duration-700 flex flex-col items-center justify-center min-h-[400px]">
                
                 {/* Decorative Star Element */}
                 <div className="relative">
                    <div className="absolute inset-0 bg-orange/40 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="relative w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-4 border-orange shadow-[0_0_60px_rgba(218,162,62,0.4)] animate-slow-float">
                       <FaStar className="text-orange text-8xl animate-pulse" />
                    </div>
                    
                    {/* Floating Orbits */}
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/10 rounded-full animate-[spin_${20 + (i * 10)}s_linear_infinite]`} style={{ transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg)` }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange rounded-full shadow-lg"></div>
                      </div>
                    ))}
                 </div>

                {/* Floating Badge */}
                <div className="absolute bottom-12 right-12 px-6 py-4 bg-indigo-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-bounce">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg">N</div>
                      <div>
                         <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none"> नक्षत्र</p>
                         <p className="text-xs font-black text-white uppercase tracking-widest mt-1">Star Aligned</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-slow-float {
          animation: slow-float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
