"use client";

import React from "react";
import { FaChevronRight, FaComments, FaPhoneAlt, FaUser, FaStar } from "react-icons/fa";

const ExpertConsultationSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 space-y-6">
            <div className="inline-block px-5 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Expert Guidance</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight uppercase">
                Talk to <span className="text-orange-500 italic block lg:inline underline underline-offset-8 decoration-orange-500/10">Dosh Nivaran</span> Experts
            </h2>
            <div className="w-24 h-2 bg-orange-500/10 mx-auto rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-orange-500 animate-[shimmer_2s_infinite_linear]"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Acharya Sanjay",
              exp: "18 Years",
              spec: "Vedic | Rahu-Ketu",
              rating: "4.9",
            },
            { 
              name: "Dr. Anjali", 
              exp: "12 Years", 
              spec: "Lal Kitab | Dosh",
              rating: "4.8",
            },
            { 
              name: "Pandit Dixit", 
              exp: "22 Years", 
              spec: "Rituals | Puja",
              rating: "5.0",
            },
            { 
              name: "Meera Ji", 
              exp: "14 Years", 
              spec: "Remedial Expert",
              rating: "4.7",
            },
          ].map((ast, i) => (
            <div key={i} className="group">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center transition-all duration-500 hover:shadow-premium hover:-translate-y-2 relative overflow-hidden h-full">
                {/* Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                </div>

                <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute -inset-2 bg-orange-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-full h-full bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-orange-500/20 group-hover:border-orange-500/50 group-hover:scale-105 transition-all duration-500 overflow-hidden">
                        <FaUser className="text-slate-300 text-5xl group-hover:text-orange-500/50 transition-colors" />
                    </div>
                    {/* Rating Badge */}
                    <div className="absolute -bottom-2 right-0 bg-white shadow-xl rounded-xl px-3 py-1 flex items-center gap-1 border border-gray-100">
                        <FaStar className="text-orange-500 text-[10px]" />
                        <span className="text-[10px] font-black text-slate-900">{ast.rating}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors">{ast.name}</h4>
                        <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        {ast.spec}
                        </p>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold italic">Experience: {ast.exp}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-orange-600 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg shadow-black/10">
                    <FaComments className="inline me-2" /> Chat
                  </button>
                  <button className="flex-1 bg-white text-slate-950 border border-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 hover:-translate-y-1 active:scale-95 shadow-sm">
                    <FaPhoneAlt className="inline me-2" /> Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 pt-8 border-t border-slate-50 relative">
          <button className="group relative inline-flex items-center justify-center gap-4 bg-transparent text-orange-600 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all hover:text-slate-950 hover:-translate-y-1 active:scale-95 no-underline">
            <span className="relative z-10">View All Experts</span>
            <FaChevronRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={10} />
            <div className="absolute inset-0 bg-orange-500 rounded-2xl opacity-0 blur-xl group-hover:opacity-10 transition-opacity"></div>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};

export default ExpertConsultationSection;
