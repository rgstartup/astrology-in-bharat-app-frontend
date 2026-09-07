"use client";

import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gray-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      
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
                <i className="fa-solid fa-fire-flame-curved text-red-500 text-xs animate-pulse"></i>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Advanced Vedic Mars Analysis</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Mangal <span className="text-red-500 italic">Dosha</span> <br/>
                <span className="text-gray-400">Analysis System</span>
              </h1>
              
              <p className="text-xl font-bold text-gray-400 leading-relaxed max-w-2xl italic border-l-4 border-red-500/30 pl-8">
                &quot;Get accurate analysis of Mars Affliction in your birth chart. Understand its impact on marriage, career, and life stability with effective Vedic remedies.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: "Instant Dosha Calculation", icon: "fa-bolt-lightning" },
                { text: "Detailed Impact Analysis", icon: "fa-chart-pyramid" },
                { text: "Personalized Remedies", icon: "fa-hand-sparkles" },
                { text: "Marriage Timing Insights", icon: "fa-calendar-heart" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-lg">
                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                  </div>
                  <span className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-wrap gap-6 items-center">
              <button
                className="group relative px-12 py-6 bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-red-600/20 hover:bg-orange transition-all duration-500 active:scale-[0.98] overflow-hidden"
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-4">
                  <span>Start Free Analysis</span>
                  <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
                </div>
              </button>
              
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                 <i className="fa-solid fa-user-shield text-red-500"></i>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Privacy Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-r from-red-600/20 to-orange/20 rounded-[4rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-sm p-8 shadow-2xl overflow-hidden group-hover:-translate-y-4 transition-transform duration-700">
                <Image
                  src="/images/mangal-dosha-hero.png"
                  alt="Mangal Dosha Analysis"
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-12 right-12 px-6 py-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-bounce">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg">M</div>
                      <div>
                         <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none">Power Level</p>
                         <p className="text-xs font-black text-white uppercase tracking-widest mt-1">Mars Influenced</p>
                      </div>
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
