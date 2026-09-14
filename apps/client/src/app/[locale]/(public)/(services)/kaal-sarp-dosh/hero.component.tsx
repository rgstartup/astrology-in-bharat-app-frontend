"use client";

import React from "react";
import Image from "next/image";
import { GiSnake } from "react-icons/gi";

const HeroComponent = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32 bg-slate-950 text-white font-display">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Vedic Astrology Analysis</span>
              </div>
              
              <h1 className="text-5xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tighter uppercase">
                Kaal Sarp <span className="text-orange-500 italic block lg:inline">Dosh</span>
              </h1>
              
              <div className="space-y-4">
                <h4 className="text-xl lg:text-3xl font-bold text-white/90 tracking-tight">
                  Unlock Secrets & Overcome Hurdles
                </h4>
                <p className="text-lg text-gray-400 max-w-2xl leading-relaxed italic border-l-4 border-orange-500/30 pl-8 font-medium">
                  An accurate analysis of Rahu and Ketu&apos;s positions. Effective Vedic remedies 
                  can help you navigate life&apos;s obstacles and achieve immense success.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Analyze Rahu-Ketu Position",
                "Identify 12 Dosh Types",
                "Life Impact Report",
                "Powerful Remedies"
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 border border-white/5 px-6 py-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all group cursor-default"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/90">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="group relative inline-flex items-center justify-center gap-4 bg-orange-600 text-white px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl shadow-orange-500/20 hover:bg-white hover:text-slate-950 hover:-translate-y-1 active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Check Dosh Now</span>
                <i className="fa-solid fa-arrow-right-long relative z-10 group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <div className="relative group">
              {/* Animated Glow */}
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative aspect-square max-w-md mx-auto p-12 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl shadow-black/50 overflow-hidden transform transition-transform duration-700 group-hover:-translate-y-4">
                <Image
                  src="/images/horoscope-round2.png"
                  alt="Zodiac"
                  fill
                  className="animate-[spin_60s_linear_infinite] opacity-20 object-contain p-8"
                />
                <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center p-16">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border-4 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.6)] group-hover:scale-110 transition-transform duration-700">
                        <GiSnake className="text-orange-500 text-7xl lg:text-8xl animate-pulse" />
                    </div>
                </div>
              </div>

              {/* Float Points */}
              <div className="absolute top-1/4 right-0 w-3 h-3 bg-orange-500 rounded-full blur-[1px] animate-pulse"></div>
              <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-indigo-400 rounded-full blur-[1px] animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
