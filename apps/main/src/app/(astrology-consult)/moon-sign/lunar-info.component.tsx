import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaBriefcase, FaCheck, FaExclamation, FaHeart, FaPhoneAlt, FaStar, FaUserFriends } from "react-icons/fa";

const LunarInfoSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Info Column */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                  <i className="fa-solid fa-moon-cloud text-indigo-600 text-[10px]"></i>
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em]">Lunar Wisdom</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  The <span className="text-indigo-600 italic">Lunar Influence</span>
               </h2>
            </div>
            
            <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-10 md:p-16 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors pointer-events-none"></div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <HiOutlineSparkles size={28} />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      How Moon Sign Affects You?
                   </h3>
                </div>
                
                <p className="text-xl font-bold text-gray-400 italic leading-relaxed border-l-4 border-indigo-500/30 pl-8">
                  &quot;While the Sun sign defines your personality, the Moon sign reveals your essence. It governs how you feel, how you care for others, and how you find comfort in life.&quot;
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: <FaHeart />, lbl: "Emotions", desc: "Internal mood and emotional reactions.", color: "text-rose-500", bg: "bg-rose-50" },
                    { icon: <FaBriefcase />, lbl: "Career Style", desc: "Handle stress and workspace harmony.", color: "text-indigo-600", bg: "bg-indigo-50" },
                    { icon: <FaUserFriends />, lbl: "Relations", desc: "Expectations from a partner emotionally.", color: "text-emerald-500", bg: "bg-emerald-50" },
                  ].map((item, i) => (
                    <div key={i} className="group/item">
                      <div className="h-full bg-slate-50 border border-slate-100 p-6 rounded-2xl transition-all duration-500 group-hover/item:bg-white group-hover/item:shadow-xl group-hover/item:border-indigo-100">
                        <div className={`${item.color} text-xl mb-4 group-hover/item:scale-110 transition-transform`}>{item.icon}</div>
                        <h4 className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-2">
                          {item.lbl}
                        </h4>
                        <p className="text-xs font-bold text-gray-400 italic leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expert Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 text-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden h-full flex flex-col justify-between border border-white/5 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                   <div className="py-2 px-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Celestial Insights</span>
                   </div>
                </div>

                <h3 className="text-3xl md:text-5xl font-black leading-tight italic">
                  Precise <span className="text-indigo-400">Lunar</span> Chart Analysis
                </h3>

                <div className="space-y-6">
                  {[
                    "Understand your Nakshatra",
                    "Auspicious timings based on Moon",
                    "Emotional compatibility check",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-5 group/list">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 group-hover/list:scale-110 transition-transform">
                        <FaCheck size={10} />
                      </div>
                      <span className="text-base font-bold text-slate-300 italic group-hover/list:text-white transition-colors">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden group/tip">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/tip:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <FaExclamation className="text-indigo-400 animate-pulse" size={12} />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                        Did you know?
                      </h4>
                    </div>
                    <p className="text-sm font-bold text-slate-400 italic leading-relaxed pr-4">
                      &quot;The moon changes signs every 2.5 days, making its impact on your daily mood more dynamic than your sun sign.&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12">
                <button className="group relative w-full px-10 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] overflow-hidden shadow-2xl shadow-indigo-500/20 hover:bg-white hover:text-slate-950 transition-all duration-500">
                   <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   <div className="relative flex items-center justify-center gap-4">
                      <FaPhoneAlt className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                      Consult Expert Faculty
                   </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LunarInfoSection;
