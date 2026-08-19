import React from "react";
import { FaUser, FaHeart, FaArrowRight, FaSpinner } from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus } from "react-icons/gi";

import { LoveCompatibilityFormProps } from "@/lib/types/calculator";

const LoveCompatibilityForm: React.FC<LoveCompatibilityFormProps> = ({
  maleName,
  setMaleName,
  femaleName,
  setFemaleName,
  loading,
  canCalculate,
  handleCalculate,
  t,
  fontStyle,
}) => {
  return (
    <form onSubmit={handleCalculate} className="w-full">
      <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-[#301118]/5 relative overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 relative">
          {/* Male */}
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                {t.form.maleName}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  style={{ borderRadius: "9999px", ...fontStyle }}
                  className="w-full bg-white border-2 border-orange-500 pl-5 pr-12 py-3.5 text-[#301118] font-bold focus:border-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400 shadow-sm text-sm"
                  placeholder={t.form.malePlaceholder}
                  value={maleName}
                  onChange={(e) => setMaleName(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none">
                  <FaUser size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-end px-4 pb-2">
            <div className="w-9 h-9 bg-white rounded-full shadow-md border border-orange-200 flex items-center justify-center">
              <FaHeart className="text-red-500 animate-pulse" size={16} />
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center py-6">
            <div className="w-9 h-9 bg-white rounded-full shadow-md border border-orange-200 flex items-center justify-center">
              <FaHeart className="text-red-500 animate-pulse" size={14} />
            </div>
          </div>

          {/* Female */}
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                {t.form.femaleName}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  style={{ borderRadius: "9999px", ...fontStyle }}
                  className="w-full bg-white border-2 border-orange-500 pl-5 pr-12 py-3.5 text-[#301118] font-bold focus:border-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400 shadow-sm text-sm"
                  placeholder={t.form.femalePlaceholder}
                  value={femaleName}
                  onChange={(e) => setFemaleName(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none">
                  <FaUser size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            type="submit"
            disabled={loading || !canCalculate}
            style={{ borderRadius: "9999px" }}
            className="relative group inline-flex items-center justify-center gap-2 md:gap-3 bg-orange-600 text-white w-full md:w-auto px-4 py-4 md:px-12 md:py-4 font-black uppercase tracking-[1px] md:tracking-[2px] text-[10px] sm:text-xs hover:bg-orange-700 transition-all duration-500 shadow-xl disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-orange-600 cursor-pointer"
          >
            {loading ? (
              <FaSpinner className="animate-spin shrink-0" />
            ) : (
              <TbCrystalBall size={18} className="shrink-0" />
            )}
            <span style={fontStyle} className="text-center">
              {loading ? t.form.calculating : t.form.calculateBtn}
            </span>
            <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="w-full h-2 bg-orange-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
      </div>
    </form>
  );
};

export default LoveCompatibilityForm;

