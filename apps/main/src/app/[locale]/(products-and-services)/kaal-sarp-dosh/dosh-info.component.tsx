"use client";

import React from "react";
import { FaExclamationTriangle, FaLeaf, FaSkull } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const DoshInfoSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-premium border border-gray-100 relative group overflow-hidden">
            {/* Sparkle Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <HiOutlineSparkles className="text-[12rem] text-orange-500" />
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-orange-500/30"></div>
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Vedic Wisdom</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                    What is <span className="text-orange-500 italic block lg:inline underline underline-offset-8 decoration-orange-500/10">Kaal Sarp Dosh?</span>
                </h2>
              </div>

              <div className="text-2xl text-slate-500 italic leading-[1.8] font-medium border-l-8 border-orange-500/10 pl-10 lg:pl-16 py-4">
                <p>
                  &quot;Kaal Sarp Dosh is formed when all seven planets come between
                  Rahu and Ketu in a horoscope. A person with this dosh may
                  struggle and face obstacles in life despite hard work.
                  However, this dosh is not always malefic and can also bring
                  immense success if remedied correctly.&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group/symptom">
                  <div className="bg-rose-50/50 p-10 lg:p-14 rounded-[2.5rem] border border-rose-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group-hover/symptom:border-rose-500/20">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 border border-rose-50">
                            <FaExclamationTriangle size={20} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            Common Symptoms
                        </h4>
                    </div>
                    <ul className="space-y-6">
                      {[
                        "Frequent nightmares involving snakes.",
                        "Delay in marriage or marital discord.",
                        "Instability in career or business losses.",
                        "Health issues without clear diagnosis.",
                      ].map((item, i) => (
                        <li key={i} className="text-[15px] text-slate-700 font-bold italic flex items-start gap-4 group/li">
                          <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(251,113,113,0.5)] group-hover/li:scale-150 transition-transform"></div>{" "}
                          &quot;{item}&quot;
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="group/remedy">
                  <div className="bg-emerald-50/50 p-10 lg:p-14 rounded-[2.5rem] border border-emerald-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group-hover/remedy:border-emerald-500/20">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-50">
                            <FaLeaf size={20} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            Effective Remedies
                        </h4>
                    </div>
                    <ul className="space-y-6">
                      {[
                        "Chant the Maha Mrityunjaya Mantra.",
                        "Perform Kaal Sarp Dosh Nivaran Puja.",
                        "Worship Lord Shiva regularly.",
                        "Offer water to a Peepal tree on Saturdays.",
                      ].map((item, i) => (
                        <li key={i} className="text-[15px] text-slate-700 font-bold italic flex items-start gap-4 group/li2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover/li2:scale-150 transition-transform"></div>{" "}
                          &quot;{item}&quot;
                        </li>
                      ))}
                    </ul>
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

export default DoshInfoSection;
