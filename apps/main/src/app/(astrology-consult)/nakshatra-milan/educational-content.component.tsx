"use client";

import React, { useState } from "react";
import { FaRegCheckCircle, FaStar, FaChevronDown } from "react-icons/fa";

const EducationalContent = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is a good Nakshatra Matching score?",
      a: "In Vedic Astrology, a score of 18 or above out of 36 is considered acceptable for marriage. A score above 25 is considered excellent compatibility, while below 18 requires careful consideration and expert consultation.",
    },
    {
      q: "Can Nakshatra Milan predict a happy marriage?",
      a: "Nakshatra Milan provides deep insights into psychological and emotional compatibility. While a high score is a positive sign, a happy marriage also depends on mutual respect, understanding, and the overall strength of individual horoscopes.",
    },
    {
      q: "How serious is Nadi Dosha in matching?",
      a: "Nadi Dosha is one of the most significant aspects of Guna Milan, as it relates to genetic compatibility and progeny. However, Vedic Astrology also provides specific cancellations (Nadi Dosha Parihar) based on various planetary alignments.",
    },
    {
      q: "What are the remedies for Gana Dosha?",
      a: "Gana Dosha relates to temperament differences. If Guna Milan shows a Gana Dosha, experts often recommend specific mantras, charity, or 'Maha-Mrityunjaya' jaap to mitigate the effects and improve mutual harmony.",
    },
  ];

  return (
    <>
      {/* Info Section */}
      <section className="py-24 bg-indigo-950 relative overflow-hidden">
        {/* Celestial Overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  <i className="fa-solid fa-moon-cloud text-orange text-xs"></i>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Star Knowledge 03</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  The Power of <br/>
                  <span className="text-orange italic text-5xl">Vedic Constellations</span>
                </h2>
                <p className="text-xl font-bold text-gray-400 leading-relaxed italic border-l-4 border-orange/30 pl-8">
                  &quot;In Vedic Astrology, the Nakshatras (lunar mansions) are even more significant than the solar zodiac signs. They determine temperament and behaviors at a fundamental level.&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "Padas & Quarters", icon: "fa-chess-king" },
                  { text: "Gana (Temperament)", icon: "fa-masks-theater" },
                  { text: "Yoni Compatibility", icon: "fa-dna" },
                  { text: "Nadi / Bloodline", icon: "fa-droplet-degree" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 group transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-all shadow-sm">
                       <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-orange/20 to-purple-500/20 rounded-[5rem] blur-2xl opacity-50 transition-opacity"></div>
                <div className="relative bg-white/5 p-12 lg:p-16 rounded-[4rem] border border-white/10 backdrop-blur-md shadow-2xl text-center group-hover:-translate-y-2 transition-transform duration-700">
                  <div className="absolute -top-12 -right-6 w-32 h-32 bg-orange rounded-full flex flex-col items-center justify-center -rotate-12 shadow-[0_0_50px_rgba(218,162,62,0.4)] border-4 border-white/10">
                    <FaStar className="text-white text-5xl animate-pulse" />
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-5xl font-black text-white leading-none">
                      27 <span className="text-orange">Stars</span>
                    </h3>
                    <p className="text-gray-400 font-bold italic leading-relaxed text-lg max-w-sm mx-auto">
                      &quot;Every individual is born under one of the 27 constellations that define their unique life path.&quot;
                    </p>
                    
                    <div className="pt-10 grid grid-cols-2 gap-8 text-left border-t border-white/10">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-orange uppercase tracking-[0.3em]">
                          Alpha Group
                        </span>
                        <p className="text-xs font-bold text-gray-200 uppercase tracking-widest leading-relaxed">
                          Ashwini, Bharani, <br/>Krittika, Rohini
                        </p>
                      </div>
                      <div className="space-y-2 text-right">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                          Delta Group
                        </span>
                        <p className="text-xs font-bold text-gray-200 uppercase tracking-widest leading-relaxed">
                          Pushya, Ashlesha, <br/>Magha, Purva
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                <i className="fa-solid fa-circle-question text-indigo-600 text-[10px]"></i>
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em]">Common Queries</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Star Compatibility <span className="text-orange italic italic">Insights</span>
             </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`group bg-white rounded-[2rem] border transition-all duration-500 ${
                  openFaq === i
                    ? "border-orange/20 shadow-premium scale-[1.02]"
                    : "border-gray-100 hover:border-gray-200 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 flex justify-between items-center text-left"
                >
                  <span
                    className={`text-lg font-black tracking-tight leading-none transition-colors ${openFaq === i ? "text-orange" : "text-gray-900"}`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${openFaq === i ? "bg-orange text-white border-orange rotate-180 shadow-lg shadow-orange/20" : "bg-gray-50 text-gray-400 border-gray-100"}`}
                  >
                    <FaChevronDown size={12} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-8 pt-0 border-t border-gray-50 mt-1">
                    <p className="text-lg font-bold text-gray-500 leading-relaxed italic pr-12">
                      &quot;{faq.a}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="group relative px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <span className="relative z-10 flex items-center gap-3">
                  Consult With Star Experts
                  <i className="fa-solid fa-arrow-right-long text-orange group-hover:translate-x-2 transition-transform"></i>
               </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EducationalContent;
