"use client";

import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";

const sarpTypes = [
  { id: 1, name: "Anant", desc: "Affects personality and general health." },
  { id: 2, name: "Kulik", desc: "Impacts wealth and family life." },
  { id: 3, name: "Vasuki", desc: "Influences siblings and courage." },
  { id: 4, name: "Shankhpal", desc: "Related to mother and property." },
  { id: 5, name: "Padam", desc: "Affects children and education." },
  { id: 6, name: "Mahapadham", desc: "Impacts health and enemies." },
  { id: 7, name: "Takshak", desc: "Influences marriage and partnership." },
  { id: 8, name: "Karkotak", desc: "Related to unexpected events." },
  { id: 9, name: "Shankachood", desc: "Affects luck and father." },
  { id: 10, name: "Ghatak", desc: "Impacts career and profession." },
  { id: 11, name: "Vishdhar", desc: "Influences gains and elder siblings." },
  { id: 12, name: "Sheshnag", desc: "Related to expenses and afterlife." },
];

const DoshTypesSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      
      <HiOutlineSparkles className="absolute top-0 left-0 text-white/[0.02] text-[40rem] -ml-40 -mt-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 space-y-6">
            <div className="inline-block px-5 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Ancient Classification</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tight uppercase">
                12 Types of <span className="text-orange-500 italic block lg:inline underline underline-offset-8 decoration-orange-500/20">Kaal Sarp Dosh</span>
            </h2>
            <div className="w-24 h-2 bg-orange-500/20 mx-auto rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-orange-500 animate-[shimmer_2s_infinite_linear]"></div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {sarpTypes.map((type) => (
            <div key={type.id} className="group h-full">
              <div className="bg-white/5 border border-white/10 p-8 lg:p-10 rounded-[2.5rem] text-center h-full transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 relative overflow-hidden cursor-default group-hover:border-orange-500/30">
                {/* ID Badge */}
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 text-white text-lg font-black italic border-2 border-white/10">
                  {type.id}
                </div>
                
                <div className="space-y-4">
                    <h4 className="text-white group-hover:text-slate-900 font-black text-xl lg:text-2xl tracking-tighter uppercase transition-colors">
                    {type.name}
                    </h4>
                    <div className="w-10 h-1 bg-orange-500/30 mx-auto rounded-full group-hover:w-16 group-hover:bg-orange-500 transition-all"></div>
                    <p className="text-[10px] text-white/40 group-hover:text-slate-400 font-black uppercase tracking-[0.2em] transition-colors">
                    Vedic Mansion
                    </p>
                    <p className="text-[12px] text-white/60 group-hover:text-slate-600 font-bold italic leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                        {type.desc}
                    </p>
                </div>

                {/* Decorative bits */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
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

export default DoshTypesSection;
