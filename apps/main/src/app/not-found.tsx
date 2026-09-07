import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaSkullCrossbones } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Visual Element */}
        <div className="relative group">
           <div className="absolute -inset-8 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
             <Image
               src="/images/Expert.png"
               alt="Stars Hidden"
               fill
               sizes="(max-width: 768px) 256px, 320px"
               className="object-contain drop-shadow-[0_20px_50px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform duration-700"
             />
           </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
             <HiOutlineSparkles className="text-orange text-xs animate-pulse" />
             <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Lost in the Cosmos</span>
          </div>

          <h1 className="text-8xl md:text-[12rem] font-black text-white leading-none tracking-tighter opacity-10 blur-[1px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
            404
          </h1>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              Stars are <span className="text-orange italic">Hidden</span>
            </h2>
            <p className="text-lg md:text-xl font-bold text-slate-400 italic max-w-lg mx-auto leading-relaxed border-l-4 border-orange/20 pl-8 lg:border-l-0 lg:pl-0">
              &quot;Looks like the stars couldn’t guide you here. The page you are looking for does not exist in our current galaxy.&quot;
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/" className="group relative inline-flex items-center justify-center gap-6 bg-white text-slate-950 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-orange hover:text-white hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <FaHome className="relative z-10" />
            <span className="relative z-10">Return to Earth</span>
          </Link>
        </div>

        {/* Security / System Badge */}
        <div className="pt-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
           <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 rounded-full border border-white/10">
              <FaSkullCrossbones className="text-orange text-[10px]" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Redirect Protocol Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
