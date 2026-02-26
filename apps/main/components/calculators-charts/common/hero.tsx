"use client";

import React from "react";
import {
  GiLotus as GiL,
  GiFlowerEmblem as GiFe,
  GiStarShuriken as GiSs,
} from "react-icons/gi";

const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiFlowerEmblem = GiFe as unknown as React.FC<{ size?: number; className?: string }>;
const GiStarShuriken = GiSs as unknown as React.FC<{ size?: number; className?: string }>;

type CalculatorHeroProps = {
  badgeText: string;
  titleMain: string;     // Example: "Love"
  titleAccent: string;   // Example: "Compatibility"
  paragraph: string;
};

const premiumStyles = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-soft {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
`;

const CalculatorHero: React.FC<CalculatorHeroProps> = ({
  badgeText,
  titleMain,
  titleAccent,
  paragraph,
}) => {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#301118] via-[#4a1c26] to-[#301118] text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#fd6410] opacity-[0.05] rounded-full blur-[100px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#d4af37] opacity-[0.03] rounded-full blur-[100px] animate-pulse-soft"></div>

        {/* Floating Vedic Symbols */}
        <div className="absolute top-[18%] right-[10%] opacity-10 animate-float">
          <GiLotus size={180} className="text-white" />
        </div>

        <div className="absolute bottom-[15%] left-[8%] opacity-5 animate-spin-slow">
          <GiFlowerEmblem size={250} className="text-white font-thin" />
        </div>

        <div
          className="absolute top-[45%] left-[15%] opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <GiStarShuriken size={80} className="text-[#d4af37]" />
        </div>
      </div>

      <div className="container relative z-10 px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="inline-block bg-[#fd6410] text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8">
            {badgeText}
          </span>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none overflow-visible py-2">
            {titleMain}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fd6410] via-[#ff8c42] to-[#fd6410]">
              {titleAccent}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-orange-100/60 leading-relaxed font-light italic mb-12">
            {paragraph}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculatorHero;


