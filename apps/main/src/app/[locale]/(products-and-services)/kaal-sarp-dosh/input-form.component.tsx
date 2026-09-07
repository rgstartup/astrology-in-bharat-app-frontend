"use client";

import React from "react";
import { FaCalendarAlt, FaChevronRight, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaUser } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const InputFormSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          {/* Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-8 lg:p-14 shadow-premium border border-gray-100 relative group overflow-hidden h-full">
              {/* Sparkle Decoration */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <HiOutlineSparkles className="text-9xl text-orange-500" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-gray-100 pb-8">
                <div className="w-16 h-16 bg-slate-950 text-orange-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <FaCalendarAlt size={24} />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">
                    Enter Birth Details
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                        Free Personal Analysis
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                        <FaUser className="text-orange-500/50" /> Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                      Gender
                    </label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500/50" /> Birth Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm appearance-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                        <FaClock className="text-orange-500/50" /> Birth Time
                    </label>
                    <input
                      type="time"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm appearance-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                      Am/Pm
                    </label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500/50" /> Birth Place
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all shadow-sm"
                      placeholder="Enter city name"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within/input:text-orange-500 transition-colors">
                        <FaMapMarkerAlt />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                    <button className="group relative w-full inline-flex items-center justify-center gap-6 bg-slate-950 text-white px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl hover:bg-orange-600 hover:-translate-y-1 active:scale-95 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">Analyze Dosh Now</span>
                        <FaChevronRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={10} />
                    </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-slate-950 text-white p-12 lg:p-14 rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/5 h-full flex flex-col justify-center group/card">
                {/* Background Decor */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none group-hover/card:bg-orange-500/20 transition-all duration-700"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="w-16 h-1 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                        <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase">
                        Confused about your Kundli?
                        </h3>
                    </div>
                    
                    <p className="text-gray-400 text-lg font-bold leading-relaxed italic border-l-4 border-orange-500/20 pl-8">
                        &quot;Talk to our premium experts and get instant remedies for
                        Kaal Sarp Dosh. Understand the placement of Rahu and Ketu in
                        your chart.&quot;
                    </p>
                    
                    <div className="space-y-4">
                        <button className="group/btn relative w-full bg-orange-600 text-white py-6 px-10 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 border-0 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-slate-950 hover:-translate-y-1 active:scale-95 overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            <FaPhoneAlt className="relative z-10 animate-shake" />
                            <span className="relative z-10">Call Now @ ₹20/min</span>
                        </button>
                        
                        <div className="flex items-center justify-center gap-3 text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live Now
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default InputFormSection;
