"use client";

import React, { useRef } from "react";
import CalculatorHero from "./common/hero";
import ZodiacCompatibilityForm from "./ZodiacCompatibilityForm";
import ZodiacCompatibilityResult from "./ZodiacCompatibilityResult";
import { useZodiacCompatibility } from "./useZodiacCompatibility";

const premiumCardStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(48, 17, 24, 0.1);
  }
  .text-burgundy { color: #301118; }
  .bg-burgundy { background-color: #301118; }
  .border-burgundy { border-color: #301118; }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
`;

const ZodiacSignCompatibility: React.FC = () => {
  const {
    yourSign,
    setYourSign,
    partnerSign,
    setPartnerSign,
    loading,
    result,
    handleSwap,
    calculate,
  } = useZodiacCompatibility();

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculate();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      <CalculatorHero
        badgeText="Sign Based Compatibility"
        titleMain="Zodiac"
        titleAccent="Compatibility"
        paragraph="Choose both zodiac signs to get a deterministic compatibility percentage, category, and mini love scores."
      />

      <ZodiacCompatibilityForm
        yourSign={yourSign}
        partnerSign={partnerSign}
        loading={loading}
        setYourSign={setYourSign}
        setPartnerSign={setPartnerSign}
        handleSwap={handleSwap}
        handleCalculate={handleCalculate}
      />

      <div ref={resultsRef}>
        {result && (
          <ZodiacCompatibilityResult
            result={result}
            yourSign={yourSign}
            partnerSign={partnerSign}
          />
        )}
      </div>
    </div>
  );
};

export default ZodiacSignCompatibility;
