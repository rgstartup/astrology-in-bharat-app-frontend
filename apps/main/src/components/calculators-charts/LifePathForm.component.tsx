import React from "react";
import { FaArrowRight, FaSpinner, FaRegCalendarAlt as FaCalendar } from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus } from "react-icons/gi";

import { LifePathFormProps } from "@/lib/types/calculator";

const LifePathForm: React.FC<LifePathFormProps> = ({
  dob,
  setDob,
  loading,
  canCalculate,
  handleCalculate,
  t,
  fontStyle,
}) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6">
        <div className="glass-card rounded-[4rem] p-8 md:p-16 shadow-[0_20px_60px_rgba(48,17,24,0.12)] border-t-4 border-t-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
            <GiLotus size={150} />
          </div>

          <div className="text-center mb-10">
            <h2 className="text-xl md:text-3xl font-black text-[#301118] mb-2 tracking-tight" style={fontStyle}>
              {t.title} <span className="text-primary">{t.titleAccent}</span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
          </div>

          <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
            <div className="glass-card rounded-[3rem] p-6 md:p-10 shadow-[0_15px_45px_rgba(48,17,24,0.1)] border border-[#301118]/5 relative overflow-hidden bg-white space-y-6">
              {/* DOB */}
              <div>
                <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                  {t.dobLabel}
                </label>
                <div className="relative mt-2">
                  <input
                    type="date"
                    required
                    style={{ borderRadius: "9999px", ...fontStyle }}
                    className="w-full bg-white border-2 border-[#301118]/5 pl-6 pr-12 py-4 text-[#301118] font-bold focus:border-primary outline-none transition-all shadow-sm text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:p-0"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30 pointer-events-none">
                    <FaCalendar size={14} />
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading || !canCalculate}
                  style={{ borderRadius: "9999px" }}
                  className="relative group inline-flex justify-center items-center gap-2 md:gap-3 bg-orange-600 text-white w-full md:w-auto px-4 py-4 md:px-12 md:py-4 font-black uppercase tracking-[1px] md:tracking-[2px] text-[10px] sm:text-xs text-center hover:bg-orange-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin shrink-0" />
                  ) : (
                    <TbCrystalBall size={18} className="shrink-0" />
                  )}
                  <span style={fontStyle} className="text-center">
                    {loading ? t.calculating : t.calculate}
                  </span>
                  <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="w-full h-2 bg-orange-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LifePathForm;

