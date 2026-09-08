"use client";

import React from "react";
import {
  FaHeartBroken,
  FaChartLine,
  FaHospital,
  FaChevronRight,
  FaUser,
  FaComments,
  FaPhoneAlt,
} from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";

const EducationalContent = () => {
  return (
    <>
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                <i className="fa-solid fa-book-sparkles text-red-500 text-xs text-orange"></i>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Knowledge Module 02</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Planetary Impact of <br/>
                <span className="text-red-500 italic">Mangal Dosha</span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl font-bold text-gray-400 leading-relaxed italic border-l-4 border-red-500/30 pl-8">
                   &quot;In Vedic Astrology, Mars represents drive, ego, and energy. When malefic, it creates Mangal Dosha, impacting relationship harmony and career stability.&quot;
                </p>
                <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-xl">
                  However, various exceptions like Mangal Dosha Bhanga exist. Our system performs deep algorithmic checks across 12 houses to verify these cancellations before final synthesis.
                </p>
              </div>

              <div className="pt-4">
                <button className="group relative px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-3">
                    Consult For Remedies
                    <FaChevronRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {[
                  {
                    icon: <FaHeartBroken />,
                    title: "Relationship",
                    color: "text-rose-500",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20",
                    desc: "Marital disharmony & delays"
                  },
                  {
                    icon: <FaChartLine />,
                    title: "Career Growth",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                    desc: "Impulsive decision making"
                  },
                  {
                    icon: <FaHospital />,
                    title: "Vitality",
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                    desc: "Fluctuating energy levels"
                  },
                  {
                    icon: <GiMeditation />,
                    title: "Mental Peace",
                    color: "text-purple-500",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20",
                    desc: "Persistent restlessness"
                  },
                ].map((effect, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-2 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 h-full flex flex-col items-center text-center group-hover:-translate-y-2 transition-transform duration-500">
                      <div className={`w-16 h-16 ${effect.bg} ${effect.color} ${effect.border} border rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                        <span className="text-2xl">{effect.icon}</span>
                      </div>
                      <h4 className="text-[12px] font-black text-white uppercase tracking-[0.2em] mb-3">
                        {effect.title}
                      </h4>
                      <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                        {effect.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-full border border-gray-100">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Specialist Consultation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Certified <span className="text-red-500 italic">Dosha</span> Experts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Pandit Sharma", exp: "21 Years", spec: "Vedic | Dosha", ratings: "4.9" },
              { name: "Acharya Priya", exp: "15 Years", spec: "Numerology", ratings: "4.8" },
              { name: "Dr. Rakesh", exp: "25 Years", spec: "Vedic | Prashna", ratings: "5.0" },
              { name: "Meera Devi", exp: "10 Years", spec: "Tarot Expert", ratings: "4.7" },
            ].map((ast, i) => (
              <div key={i} className="group cursor-default">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                     <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                     <div className="relative w-full h-full bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-100 shadow-md group-hover:border-red-500/20 transition-colors">
                        <FaUser className="text-gray-300 text-5xl group-hover:text-red-500/50 transition-colors" />
                     </div>
                     <div className="absolute -bottom-1 -right-1 bg-white px-3 py-1 rounded-full shadow-lg border border-gray-50 flex items-center gap-1.5">
                        <i className="fa-solid fa-star text-[10px] text-orange"></i>
                        <span className="text-[10px] font-black text-gray-900">{ast.ratings}</span>
                     </div>
                  </div>

                  <div className="text-center space-y-1 flex-1">
                    <h4 className="text-xl font-black text-gray-900 group-hover:text-red-500 transition-colors">{ast.name}</h4>
                    <p className="text-[10px] font-black text-red-500 bg-red-50 inline-block px-4 py-1.5 rounded-xl uppercase tracking-widest border border-red-100/50">
                      {ast.spec}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                      Experience: {ast.exp}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-10">
                    <button className="group/btn flex items-center justify-center gap-2 py-4 px-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all duration-300">
                      <FaComments className="text-xs group-hover/btn:scale-125 transition-transform" /> Chat
                    </button>
                    <button className="group/btn flex items-center justify-center gap-2 py-4 px-4 bg-white border border-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-red-500 transition-all duration-300">
                      <FaPhoneAlt className="text-xs group-hover/btn:scale-125 transition-transform" /> Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="group flex items-center gap-4 px-10 py-5 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-100 transition-all mx-auto shadow-sm">
                View Entire Faculty
                <FaChevronRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EducationalContent;
