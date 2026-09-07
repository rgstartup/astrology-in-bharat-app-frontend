import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const ComingSoonSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-10 md:p-20 text-center relative overflow-hidden max-w-4xl mx-auto group">
          {/* Animated Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange/10 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/5 rounded-full blur-2xl -ml-24 -mb-24 group-hover:bg-orange/10 transition-colors duration-700"></div>

          <div className="bg-orange w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 mx-auto shadow-2xl shadow-orange/30 transform group-hover:rotate-12 transition-transform duration-500">
            <HiOutlineSparkles className="text-white text-5xl animate-[spin_8s_linear_infinite]" />
          </div>

          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#301118] leading-tight">
              Under <span className="text-orange">Cosmic</span> Alignment
            </h2>
            
            <div className="inline-block px-6 py-2 bg-gray-900 text-white rounded-full">
               <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] m-0">
                Expected Reveal: Coming Soon
              </p>
            </div>

            <p className="text-gray-500 italic max-w-2xl mx-auto pt-4 text-lg leading-relaxed">
              &quot;We are sourcing the finest, ethically mined gemstones and
              authenticating ancient remedies. Our marketplace for
              high-vibration spiritual tools will be open for you very soon.&quot;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link
                href="/"
                className="group/btn relative px-10 py-5 bg-white border border-gray-200 text-[#301118] rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline"
              >
                <div className="flex items-center gap-3">
                  <FaArrowLeft className="group-hover/btn:-translate-x-2 transition-transform" />
                  Back to Home
                </div>
              </Link>
              
              <button className="group/btn relative px-10 py-5 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 border-0">
                <span className="relative z-10 flex items-center gap-3">
                  Notify Me
                  <i className="fa-solid fa-bell animate-bounce"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
