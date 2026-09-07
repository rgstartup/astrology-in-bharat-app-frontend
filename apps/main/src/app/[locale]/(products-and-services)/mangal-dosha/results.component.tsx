"use client";

import React from "react";
import {
  FaMars,
  FaCheckCircle,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";

type Props = {
  resultsRef: React.RefObject<HTMLDivElement | null>;
  result: any;
};

// Helper inside component to maintain parity with original code
const renderContent = (content: any): React.ReactNode => {
  if (content === null || content === undefined) return "";
  if (typeof content === "string" || typeof content === "number")
    return content;
  if (Array.isArray(content)) {
    return content.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && ", "}
        {renderContent(item)}
      </React.Fragment>
    ));
  }
  if (typeof content === "object") {
    if (content.description) return content.description;
    if (content.name) return content.name;
    if (content.title) return content.title;
    return JSON.stringify(content);
  }
  return String(content);
};

const ResultsSection = ({ resultsRef, result }: Props) => {
  return (
    <section ref={resultsRef} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-16 lg:p-24">
            {/* Result Header */}
            <div className="text-center mb-20 space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 rounded-full border border-red-100">
                 <i className="fa-solid fa-sparkles text-red-500 text-xs text-orange"></i>
                 <span className="text-[12px] font-black text-red-500 uppercase tracking-[.2em]">Mars Affliction Final Report</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                Dosha <span className="text-red-500 italic">Audit</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20">
              {/* Status Gauge Area */}
              <div className="lg:col-span-5">
                <div className={`h-full rounded-[3rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl transition-all duration-700 ${
                  result.has_dosha 
                  ? "bg-gray-950 border border-gray-900" 
                  : "bg-emerald-500 border border-emerald-400"
                }`}>
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/5 to-transparent opacity-30"></div>
                  
                  <div className={`w-32 h-32 rounded-3xl flex items-center justify-center mb-8 relative z-10 shadow-2xl ${
                    result.has_dosha ? "bg-red-600 text-white" : "bg-white text-emerald-600"
                  }`}>
                    {result.has_dosha ? (
                      <FaMars size={56} className="animate-pulse" />
                    ) : (
                      <FaCheckCircle size={56} />
                    )}
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <h3 className={`text-3xl font-black uppercase tracking-wider ${
                      result.has_dosha ? "text-white" : "text-white"
                    }`}>
                      {result.has_dosha ? "Dosha Detected" : "Pure Chart"}
                    </h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                      result.has_dosha ? "text-red-500" : "text-emerald-100"
                    }`}>
                      {result.has_dosha ? "Level: High Intensity" : "Level: Favorable"}
                    </p>
                    {result.type && (
                      <div className="pt-6">
                        <span className="px-6 py-2 bg-white/5 backdrop-blur-md rounded-xl text-[10px] font-black text-white/50 border border-white/10 uppercase tracking-widest">
                          Variation: {renderContent(result.type)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Textual Breakdown */}
              <div className="lg:col-span-7">
                <div className="bg-gray-50/50 rounded-[3rem] p-12 md:p-16 border border-gray-100 h-full flex flex-col justify-center">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                    Expert Synopsis
                  </h4>
                  
                  <div className="space-y-8">
                    <p className="text-xl md:text-2xl font-black text-gray-900 leading-relaxed italic pr-8">
                      &quot;{renderContent(result.description)}&quot;
                    </p>

                    <div className={`p-8 rounded-[2rem] border flex gap-6 items-start transition-all ${
                      result.has_dosha 
                      ? "bg-red-50 border-red-100 text-red-900" 
                      : "bg-emerald-50 border-emerald-100 text-emerald-900"
                    }`}>
                      {result.has_dosha ? <FaExclamationTriangle className="text-red-500 text-2xl shrink-0" /> : <FaCheckCircle className="text-emerald-500 text-2xl shrink-0" />}
                      <p className="text-sm font-bold leading-relaxed italic">
                        {result.has_dosha 
                          ? "Since Mangal Dosha is present, it is highly recommended to consult with our specialized faculty for Kumbh Vivah or other specific neutralizing rituals before marriage."
                          : "Your chart demonstrates auspicious planetary alignment. Mars remains balanced, ensuring life-long harmony in professional and domestic spheres."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exceptions & Remedies Grid */}
            {(result.exceptions?.length > 0 || result.remedies?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                {result.exceptions?.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 leading-none">Cancellations Found</h3>
                    <div className="space-y-4">
                      {result.exceptions.map((ex: any, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                           <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                              <FaCheckCircle size={14} />
                           </div>
                           <span className="text-sm font-bold text-gray-600 italic">{renderContent(ex)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.remedies?.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 leading-none">Neutralizing Measures</h3>
                    <div className="space-y-4">
                      {result.remedies.map((rem: any, idx: number) => (
                        <div key={idx} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl flex items-center gap-6 group hover:bg-red-600 transition-all">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-white group-hover:text-red-600 transition-all shadow-sm">
                              <GiMeditation size={16} />
                           </div>
                           <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{renderContent(rem)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conclusion CTA */}
            <div className="bg-gray-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                     <i className="fa-solid fa-user-robot text-red-500"></i>
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Expert Report Synthesis</span>
                  </div>
                  
                  <div className="max-w-3xl mx-auto space-y-6">
                    <h4 className="text-3xl md:text-5xl font-black text-white italic leading-tight">&quot;The stars reflect a path of <span className="text-red-500">balance</span> & spiritual growth.&quot;</h4>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 pt-10">
                    <button onClick={() => window.print()} className="group/btn relative px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all duration-300">
                       <span className="relative z-10 flex items-center gap-3">
                          <i className="fa-solid fa-print text-sm group-hover/btn:text-red-600 transition-colors"></i>
                          Print Expert Certificate
                       </span>
                    </button>
                    <button className="group/btn relative px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                       <span className="relative z-10 flex items-center gap-3">
                          <i className="fa-solid fa-arrow-down-to-bracket text-sm group-hover/btn:text-red-600 transition-colors"></i>
                          Download as JSON (Data)
                       </span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-opacity duration-700">
           <div className="flex items-center justify-center gap-3">
              <i className="fa-solid fa-shield-check text-red-500"></i>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.5em]">CERTIFIED ACCURATE ANALYSIS BY ASTROLOGY IN BHARAT</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
