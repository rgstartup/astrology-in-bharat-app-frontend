"use client";

import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";

import { ResultsSectionProps } from "@/lib/types";

const ResultsSection = ({
  resultsRef,
  results,
  boyName,
  girlName,
}: ResultsSectionProps) => {
  return (
    <section ref={resultsRef} className="py-24 bg-white relative overflow-hidden">
      {/* Celestial Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-16 lg:p-24">
            {/* Header */}
            <div className="text-center mb-20 space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                 <i className="fa-solid fa-sparkles text-indigo-500 text-xs"></i>
                 <span className="text-[12px] font-black text-indigo-500 uppercase tracking-[.2em]">Star Compatibility Final Analysis</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                Celestial <span className="text-indigo-600 italic">Alignment</span>
              </h2>
            </div>

            {/* Matching Score Dashboard */}
            {results.match?.guna_milan && (
              <div className="mb-20 bg-gray-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-500/10 to-transparent opacity-30"></div>
                
                <div className="relative z-10 space-y-10">
                   <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Vedic Guna Matching</span>
                   </div>

                   <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="flex items-baseline gap-4">
                        <span className="text-8xl md:text-9xl font-black text-white tracking-tighter animate-in zoom-in-50 duration-700">
                          {results.match.guna_milan.total_points}
                        </span>
                        <span className="text-4xl font-black text-indigo-500/50">/ {results.match.guna_milan.maximum_points}</span>
                      </div>
                      
                      <div className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 border shadow-2xl transition-all ${
                        results.match.guna_milan.total_points >= 18
                          ? "bg-emerald-500 text-white border-emerald-400"
                          : "bg-red-600 text-white border-red-500"
                      }`}>
                         {results.match.guna_milan.total_points >= 18 ? (
                           <i className="fa-solid fa-circle-check text-white animate-pulse"></i>
                         ) : (
                           <i className="fa-solid fa-circle-exclamation text-white"></i>
                         )}
                         {results.match.guna_milan.total_points >= 25
                            ? "Celestial Synchrony"
                            : results.match.guna_milan.total_points >= 18
                              ? "Auspicious Pairing"
                              : "Remedial Measures Recommended"}
                      </div>
                   </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch pt-10">
              {/* Boy's Result */}
              <div className="group">
                <div className="h-full bg-white rounded-[3rem] p-10 shadow-premium border border-gray-100 transition-all duration-500 hover:shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <FaMars size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 leading-none">
                        {boyName || "Groom"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                        Birth Star Profile
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Nakshatra", value: results.boy.nakshatra?.name, planet: results.boy.nakshatra?.lord?.name },
                      { label: "Chandra Rashi", value: results.boy.chandra_rasi?.name, lord: results.boy.chandra_rasi?.lord?.name },
                      { label: "Deity", value: results.boy.additional_info?.deity },
                      { label: "Gana", value: results.boy.additional_info?.ganam },
                      { label: "Animal Sign", value: results.boy.additional_info?.animal_sign },
                      { label: "Nadi", value: results.boy.additional_info?.nadi },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-indigo-500/20 transition-all">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] block mb-2">{item.label}</span>
                        <span className="text-base font-black text-gray-900 italic block">{item.value || "Calculating..."}</span>
                        {(item.lord || item.planet) && (
                          <div className="mt-4 pt-4 border-t border-gray-100/50 flex justify-between items-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lord/Planet</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.lord || item.planet}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Girl's Result */}
              <div className="group">
                <div className="h-full bg-white rounded-[3rem] p-10 shadow-premium border border-gray-100 transition-all duration-500 hover:shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange shadow-sm border border-orange-100/50 group-hover:bg-orange group-hover:text-white transition-all duration-500">
                      <FaVenus size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 leading-none">
                        {girlName || "Bride"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                        Birth Star Profile
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Nakshatra", value: results.girl.nakshatra?.name, planet: results.girl.nakshatra?.lord?.name },
                      { label: "Chandra Rashi", value: results.girl.chandra_rasi?.name, lord: results.girl.chandra_rasi?.lord?.name },
                      { label: "Deity", value: results.girl.additional_info?.deity },
                      { label: "Gana", value: results.girl.additional_info?.ganam },
                      { label: "Animal Sign", value: results.girl.additional_info?.animal_sign },
                      { label: "Nadi", value: results.girl.additional_info?.nadi },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-orange/20 transition-all">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] block mb-2">{item.label}</span>
                        <span className="text-base font-black text-gray-900 italic block">{item.value || "Calculating..."}</span>
                        {(item.lord || item.planet) && (
                          <div className="mt-4 pt-4 border-t border-gray-100/50 flex justify-between items-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lord/Planet</span>
                            <span className="text-[10px] font-black text-orange uppercase tracking-widest">{item.lord || item.planet}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final Synthesis CTA */}
              <div className="col-span-1 lg:col-span-2 pt-12">
                <div className="bg-gray-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl group">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                         <i className="fa-solid fa-user-robot text-orange"></i>
                         <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Expert Star Analysis Synthesis</span>
                      </div>
                      
                      <div className="max-w-4xl mx-auto space-y-8">
                        <h4 className="text-3xl md:text-5xl font-black text-white italic leading-tight">
                          &quot;The alignment of your birth stars influences relationship <span className="text-orange">harmony</span> & spiritual growth.&quot;
                        </h4>
                      </div>

                      <div className="flex flex-wrap justify-center gap-6">
                        <button className="group relative px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all duration-300">
                           <span className="relative z-10 flex items-center gap-3">
                              <i className="fa-solid fa-arrow-down-to-bracket text-sm group-hover:text-indigo-600 transition-colors"></i>
                              Download Star Protocol
                           </span>
                        </button>
                        <button className="group relative px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                           <span className="relative z-10 flex items-center gap-3">
                              <i className="fa-solid fa-comment-dots text-sm group-hover:text-orange transition-colors"></i>
                              Consult Expert Faculty
                           </span>
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-opacity duration-700">
           <div className="flex items-center justify-center gap-3">
              <i className="fa-solid fa-shield-check text-indigo-500"></i>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.5em]">CERTIFIED ACCURATE ANALYSIS BY ASTROLOGY IN BHARAT</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
