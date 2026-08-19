"use client";
import React, { useState } from "react";
import Image from "next/image";

import { ZodiacSignsData } from "@/components/features/services/homePagaData";
import { CharacteristicsGrid } from "./characteristics-grid";
import { SidebarStats } from "./sidebar-stats";
import { TbCrystalBall } from "react-icons/tb";
import HeroSection from "./hero.component";
import SignSelector from "./sign-selector.component";

const SunSignPage = () => {
  const [selectedSign, setSelectedSign] = useState(ZodiacSignsData[0]);

  if (!selectedSign) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection selectedSign={selectedSign} />

      {/* Zodiac Selection Slider */}
      <SignSelector
        selectedSign={selectedSign}
        setSelectedSign={setSelectedSign}
      />

      {/* Main Details Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Celestial Background */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden group">
                <div className="p-10 md:p-16">
                  <div className="flex flex-col md:flex-row items-center gap-10 mb-16 pb-12 border-b border-gray-100">
                    <div className="relative group/img">
                      <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-2xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative w-32 h-32 bg-yellow-50 border border-yellow-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-center group-hover/img:scale-105 group-hover/img:rotate-6 transition-all duration-700">
                        <Image
                          src={selectedSign.image}
                          alt={selectedSign.title}
                          width={120}
                          height={120}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left space-y-3">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-yellow-50 rounded-full border border-yellow-100">
                         <i className="fa-solid fa-sun-bright text-yellow-600 text-[10px]"></i>
                         <span className="text-[10px] font-black text-yellow-800 uppercase tracking-widest">The {selectedSign.nature} Influence</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter">
                        {selectedSign.title}
                      </h2>
                    </div>
                  </div>

                  {/* Characteristics Grid */}
                  <CharacteristicsGrid />

                  {/* Extra Details */}
                  <div className="pt-10">
                    <div className="bg-gray-950 rounded-[2.5rem] p-12 relative overflow-hidden group/card shadow-2xl">
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 group-hover/card:bg-yellow-500/20 transition-colors"></div>
                      <TbCrystalBall className="absolute -right-8 -bottom-8 text-white/5 text-9xl group-hover/card:scale-125 group-hover/card:rotate-12 transition-transform duration-1000" />
                      
                      <div className="relative z-10 space-y-6">
                        <h3 className="text-2xl font-black text-white italic flex items-center gap-4">
                          <div className="w-2 h-8 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"></div>
                          Vedic Perspective
                        </h3>
                        <p className="text-xl font-bold text-gray-400 italic leading-relaxed max-w-2xl">
                          &quot;In Vedic astrology, the Sun represents the Soul, the King, and the Father. Your sun sign placement determines the inner light and core vitality you bring to the world. Analysis of {selectedSign.title}&apos;s ruling planet and element provides deep insight into your spiritual purpose.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Footer */}
              <div className="text-center py-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                 <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm">
                   <i className="fa-solid fa-shield-halved text-indigo-500 text-xs"></i>
                   <span className="text-[9px] font-black text-gray-900 uppercase tracking-[0.4em]">Proprietary Vedic Calculation System v4.2</span>
                 </div>
              </div>
            </div>

            {/* Sidebar Stats Column */}
            <div className="lg:col-span-4 self-start sticky top-[180px]">
              <SidebarStats />
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default SunSignPage;
