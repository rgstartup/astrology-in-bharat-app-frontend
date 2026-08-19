"use client";

import React from "react";
import { FaBolt, FaCheck, FaFileAlt, FaGlobe, FaTheaterMasks, FaTimes, FaArrowRight, FaStar } from "react-icons/fa";
import { GiHorseHead } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";

const NakshatraDetailSection = () => {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Nakshatra Spotlight Card */}
      <div className="bg-white rounded-[3.5rem] p-10 lg:p-20 shadow-premium border border-gray-100 relative group overflow-hidden">
        {/* Sparkle Decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
          <HiOutlineSparkles className="text-[12rem] text-orange-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Visual Side */}
          <div className="md:col-span-4 text-center">
            <div className="relative group/visual inline-block">
                <div className="absolute -inset-4 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover/visual:opacity-100 transition-opacity"></div>
                
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-[10px] border-slate-50 shadow-2xl mx-auto flex items-center justify-center bg-white group-hover/visual:scale-105 transition-transform duration-700 ring-4 ring-orange-500/5 group-hover/visual:ring-orange-500/10">
                    <div className="text-orange-500 group-hover/visual:scale-110 group-hover/visual:rotate-12 transition-transform duration-700">
                        <FaBolt size={80} className="animate-pulse" />
                    </div>
                    
                    <div className="absolute -bottom-6 bg-slate-950 text-white text-[10px] px-6 py-2.5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10 group-hover/visual:-translate-y-2 transition-transform">
                        0° - 13° 20&apos; Aries
                    </div>
                </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-12 h-[1px] bg-orange-500/30"></div>
                The Star of Transport
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-[0.9]">
                Ashwini <span className="text-orange-500 italic">Mansion</span>
              </h1>
              <p className="text-xl text-slate-500 italic leading-relaxed border-l-4 border-orange-500/10 pl-8 font-medium">
                &quot;Ashwini is the first Nakshatra, symbolizing new beginnings, speed,
                and healing. Ruled by Ketu and associated with horses, it brings
                vitality.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <FaGlobe />, label: "Ruling Planet", val: "Ketu", color: "text-indigo-500" },
                {
                  icon: <FaTheaterMasks />,
                  label: "Guardian Deity",
                  val: "Ashwini Kumars",
                  color: "text-rose-500"
                },
                {
                  icon: <GiHorseHead />,
                  label: "Sacred Symbol",
                  val: "Horse Head",
                  color: "text-emerald-500"
                },
              ].map((item, i) => (
                <div key={i} className="group/item bg-slate-50/50 border border-slate-100 rounded-3xl p-6 transition-all hover:bg-white hover:shadow-2xl hover:border-orange-500/10 hover:-translate-y-1">
                  <div className={`p-4 bg-white rounded-2xl shadow-sm w-fit mb-5 ${item.color} group-hover/item:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 leading-none">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-slate-900 leading-tight">
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Traits Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="group/traits h-full">
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-[3rem] p-10 lg:p-14 h-full relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 group-hover/traits:border-emerald-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaCheck className="text-[10rem] text-emerald-500" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-tight">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-50">
                <FaCheck size={14} />
              </div>
              Core Strengths
            </h3>
            
            <ul className="space-y-6">
              {[
                "Competent higher performing career.",
                "Self-sufficient intelligence.",
                "Natural healing inclination.",
                "Adventurous exploring spirit.",
              ].map((t, i) => (
                <li key={i} className="flex gap-6 text-[15px] text-slate-700 font-bold italic group/li">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover/li:scale-150 transition-transform"></div>{" "}
                  &quot;{t}&quot;
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="group/shadow h-full">
          <div className="bg-rose-50/30 border border-rose-100 rounded-[3rem] p-10 lg:p-14 h-full relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 group-hover/shadow:border-rose-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaTimes className="text-[10rem] text-rose-500" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-tight">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500 border border-rose-50">
                <FaTimes size={14} />
              </div>
              Shadow Traits
            </h3>
            
            <ul className="space-y-6">
              {[
                "Impulsive and stubborn nature.",
                "Unfinished tasks tendency.",
                "Tendency to be aggressive.",
                "Satisfaction struggles.",
              ].map((t, i) => (
                <li key={i} className="flex gap-6 text-[15px] text-slate-700 font-bold italic group/li2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(251,113,113,0.5)] group-hover/li2:scale-150 transition-transform"></div>{" "}
                  &quot;{t}&quot;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-[3.5rem] p-12 lg:p-20 shadow-premium border border-gray-100 relative group overflow-hidden">
        <h2 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-6">
            Detailed Cosmic Analysis
            <div className="flex-1 h-[1px] bg-orange-500/10"></div>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-slate-600 text-xl font-medium leading-[1.8] italic space-y-8 border-l-8 border-orange-500/10 pl-12 lg:pl-16">
                <p>
                    People born under Ashwini Nakshatra are known for their spontaneity
                    and enthusiasm. Being the first Nakshatra, they possess the energy
                    of a &quot;starter.&quot; They are quick to act and often pioneers
                    in their fields.
                </p>
                <p>
                    However, this speed can translate to impatience. Ashwini natives may
                    struggle with long-term projects that require sustained effort.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {[
                    { label: "Spiritual Gana", val: "Deva (Divine)", icon: "✨" },
                    { label: "Castal Varna", val: "Vaishya", icon: "💎" },
                    { label: "Cosmic Element", val: "Earth", icon: "🌱" },
                    { label: "Soul Color", val: "Blood Red", icon: "🔴" },
                ].map((p, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100/50 p-8 rounded-[2rem] text-center hover:bg-white hover:shadow-2xl hover:border-orange-500/20 transition-all hover:-translate-y-2 group/prop">
                        <div className="text-2xl mb-4 group-hover/prop:scale-125 transition-transform duration-500">{p.icon}</div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 leading-none">
                            {p.label}
                        </p>
                        <p className="text-sm font-black text-slate-900 leading-tight">{p.val}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Premium CTA Banner */}
      <div className="bg-slate-950 rounded-[4rem] p-10 lg:p-20 text-white relative overflow-hidden group shadow-2xl shadow-black/40 border border-white/5">
        {/* Animated Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/20 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <HiOutlineSparkles className="absolute -top-20 -right-20 text-white/[0.03] text-[30rem] -mr-20 -mt-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Premium Destiny Guide</span>
                </div>
                <h2 className="text-4xl lg:text-7xl font-black mb-0 tracking-tight leading-tight uppercase">
                Detailed <span className="text-orange-500 italic">Personal</span> Report
                </h2>
            </div>
            <p className="text-xl text-white/60 font-bold italic border-l-8 border-orange-500/20 pl-10 max-w-2xl">
              &quot;Get a 50+ page horoscope report analyzing your Nakshatra, Dasha
              periods, and profound future predictions.&quot;
            </p>
          </div>
          
          <div className="lg:col-span-4 space-y-8 text-center">
            <button className="group relative w-full inline-flex items-center justify-center gap-6 bg-orange-600 hover:bg-white text-white hover:text-slate-950 px-10 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] no-underline transition-all shadow-2xl hover:scale-105 overflow-hidden active:scale-95">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Get Report for ₹299</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center gap-4 text-white/30 group-hover:text-white/60 transition-colors">
                <FaFileAlt size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Instant PDF Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NakshatraDetailSection;
