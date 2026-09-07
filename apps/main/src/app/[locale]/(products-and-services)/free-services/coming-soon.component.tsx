import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const ComingSoonSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden max-w-4xl mx-auto group">
          {/* Decorative Aura */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-orange-500/10 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-orange-500/10 transition-colors duration-700"></div>

          <div className="relative z-10 space-y-8 flex flex-col items-center">
            {/* Pulsing Icon */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/20 transform group-hover:rotate-12 transition-transform duration-500">
              <HiOutlineSparkles className="text-white text-5xl animate-pulse" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Under Cosmic <span className="text-orange-500">Alignment</span>
              </h2>
              <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] bg-orange-500/5 py-2 px-6 rounded-full inline-block">
                Expected Reveal: Coming Soon
              </p>
            </div>

            <p className="text-slate-500 italic text-lg leading-relaxed max-w-2xl font-medium">
              &quot;Our team is developing free calculators and reports including daily panchang, 
              auspicious timings, and basic kundli analysis for everyone.&quot;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 w-full sm:w-auto">
              <Link
                href="/"
                className="group w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 no-underline flex items-center justify-center gap-3"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" /> 
                Back to Home
              </Link>
              
              <button className="w-full sm:w-auto px-10 py-5 border-2 border-orange-500 text-orange-500 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
