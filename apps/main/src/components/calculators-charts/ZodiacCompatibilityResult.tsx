"use client";

import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";
import { ZodiacCompatibilityResultProps } from "@/lib/types/calculator";

const ZodiacCompatibilityResult: React.FC<ZodiacCompatibilityResultProps> = ({
  result,
  yourSign,
  partnerSign,
}) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <GiLotus size={300} className="animate-spin-slow" />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                  Compatibility Result
                </span>

                <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                  {yourSign} <span className="text-primary">+</span> {partnerSign}
                </h2>

                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"></div>

                <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest bg-burgundy text-white shadow-lg">
                  {result.category}
                  <FaChevronRight size={12} className="opacity-60" />
                  <span className="text-[#d4af37]">
                    {result.yourElement} + {result.partnerElement}
                  </span>
                </div>
              </div>

              {/* Main Ring */}
              <div className="flex flex-col items-center mb-14">
                <div className="relative mb-10">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                    <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                    <div className="text-center">
                      <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                        {result.percentage}
                        <span className="text-4xl text-primary">%</span>
                      </span>
                      <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                        Compatibility
                      </span>
                    </div>

                    <GiSparkles className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                  </div>
                </div>

                {/* Message */}
                <div className="max-w-3xl text-center">
                  <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                      <TbCrystalBall size={28} />
                    </div>

                    <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                      "{result.message}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Scores */}
              <div className="grid md:grid-cols-3 gap-8 mb-14">
                {[
                  { label: "Trust", value: result.trust },
                  { label: "Romance", value: result.romance },
                  { label: "Communication", value: result.communication },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#fff9f6] rounded-[2.5rem] p-8 border border-orange-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                        {item.label}
                      </p>
                      <p className="m-0 text-sm font-black text-burgundy">{item.value}%</p>
                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>

                    <p className="m-0 mt-4 text-xs text-gray-500 italic">
                      Balanced score based on your compatibility range.
                    </p>
                  </div>
                ))}
              </div>

              {/* Strengths & Challenges */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                  <h3 className="text-xl font-black text-burgundy mb-6">
                    Strengths
                  </h3>
                  <ul className="space-y-3 m-0 p-0 list-none">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="italic">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                  <h3 className="text-xl font-black text-burgundy mb-6">
                    Challenges
                  </h3>
                  <ul className="space-y-3 m-0 p-0 list-none">
                    {result.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-1 w-2 h-2 rounded-full bg-burgundy flex-shrink-0" />
                        <span className="italic">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-14 flex justify-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-orange-100">
                  <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">
                    Deterministic Result • Same Signs = Same Output
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZodiacCompatibilityResult;
