"use client";

import React from "react";
import {
  FaArrowRight,
  FaSpinner,
  FaExchangeAlt,
} from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus } from "react-icons/gi";
import { ZodiacCompatibilityFormProps, ZodiacSign } from "@/lib/types/calculator";
import { SIGNS, signToElement } from "./useZodiacCompatibility";

const ZodiacCompatibilityForm: React.FC<ZodiacCompatibilityFormProps> = ({
  yourSign,
  partnerSign,
  loading,
  setYourSign,
  setPartnerSign,
  handleSwap,
  handleCalculate,
}) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6">
        <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
            <GiLotus size={150} />
          </div>

          <div className="text-center mb-10">
            <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
              Zodiac Sign <span className="text-primary">Compatibility</span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
          </div>

          <form onSubmit={handleCalculate} className="max-w-4xl mx-auto">
            <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white">
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
                {/* Your sign */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Your Zodiac Sign
                  </label>
                  <select
                    value={yourSign}
                    onChange={(e) => setYourSign(e.target.value as ZodiacSign)}
                    style={{ borderRadius: "9999px" }}
                    className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-black focus:border-primary outline-none transition-all shadow-sm text-sm"
                  >
                    {SIGNS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <p className="m-0 mt-3 text-xs text-gray-400 italic">
                    Element: <span className="font-black">{signToElement(yourSign)}</span>
                  </p>
                </div>

                {/* Swap */}
                <div className="flex justify-center md:justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    style={{ borderRadius: "9999px" }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] border border-orange-100 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <FaExchangeAlt size={14} />
                    Swap
                  </button>
                </div>

                {/* Partner sign */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Partner Zodiac Sign
                  </label>
                  <select
                    value={partnerSign}
                    onChange={(e) => setPartnerSign(e.target.value as ZodiacSign)}
                    style={{ borderRadius: "9999px" }}
                    className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-black focus:border-primary outline-none transition-all shadow-sm text-sm"
                  >
                    {SIGNS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <p className="m-0 mt-3 text-xs text-gray-400 italic">
                    Element: <span className="font-black">{signToElement(partnerSign)}</span>
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className="text-center mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  style={{ borderRadius: "9999px" }}
                  className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <TbCrystalBall size={18} />}
                  {loading ? "Calculating..." : "Check Compatibility"}
                  <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ZodiacCompatibilityForm;
