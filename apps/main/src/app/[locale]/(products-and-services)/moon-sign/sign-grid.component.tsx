import React from "react";
import Image from "next/image";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";

const SignGridSection = () => {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-12 md:p-20 group relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-50 rounded-full border border-indigo-100">
               <i className="fa-solid fa-moon text-indigo-600 text-[10px]"></i>
               <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em]">Lunar Selection Protocol</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
               Identifty Your <span className="text-indigo-600 italic">Moon Sign</span>
            </h2>
            <p className="text-lg font-bold text-gray-400 italic leading-relaxed max-w-2xl mx-auto">
               &quot;Select your rashi to explore daily emotional forecast and deep-seated lunar insights based on Vedic calculations.&quot;
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {ZodiacSignsData.map((sign) => (
              <div key={sign.id} className="group">
                <button className="relative w-full aspect-square bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-2 group overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative h-full flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-sm">
                      <Image
                        src={sign.image}
                        alt={sign.title}
                        width={80}
                        height={80}
                        className="w-[80%] h-[80%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">
                        {sign.title}
                      </h3>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        {sign.date}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center opacity-30">
         <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-24 bg-gray-300"></div>
            <span className="text-[8px] font-black text-gray-900 uppercase tracking-[0.4em]">Precise Vedic Lunar Chart System</span>
            <div className="h-[1px] w-24 bg-gray-300"></div>
         </div>
      </div>
    </section>
  );
};

export default SignGridSection;
