import React from "react";
import { FaUser, FaHeart, FaArrowRight, FaSpinner, FaFire } from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus } from "react-icons/gi";
import { FlamesFormProps } from "@/lib/types/calculator";

const FlamesForm: React.FC<FlamesFormProps> = ({
  boyName,
  setBoyName,
  girlName,
  setGirlName,
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
            <div className="glass-card rounded-[3rem] p-6 md:p-10 shadow-[0_15px_45px_rgba(48,17,24,0.1)] border border-[#301118]/5 relative overflow-hidden bg-white">
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 relative">
                {/* Boy */}
                <div className="flex-1 w-full space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                      {t.boyNameLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px", ...fontStyle }}
                        className="w-full bg-[#fdf2f2] border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder={t.boyNamePlaceholder}
                        value={boyName}
                        onChange={(e) => setBoyName(e.target.value)}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-4 relative h-full self-stretch">
                  <div className="w-px bg-gray-100 h-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-9 h-9 bg-white rounded-full shadow-md border border-[#301118]/5 flex items-center justify-center">
                      <FaHeart className="text-red-500" size={16} />
                    </div>
                  </div>
                </div>

                <div className="md:hidden flex items-center justify-center py-6">
                  <div className="w-9 h-9 bg-white rounded-full shadow-md border border-[#301118]/5 flex items-center justify-center">
                    <FaHeart className="text-red-500" size={14} />
                  </div>
                </div>

                {/* Girl */}
                <div className="flex-1 w-full space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                      {t.girlNameLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px", ...fontStyle }}
                        className="w-full bg-[#fdf2f2] border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder={t.girlNamePlaceholder}
                        value={girlName}
                        onChange={(e) => setGirlName(e.target.value)}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="text-center mt-10">
                <button
                  type="submit"
                  disabled={loading || !canCalculate}
                  style={{ borderRadius: "9999px" }}
                  className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-12 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <TbCrystalBall size={18} />
                  )}
                  <span style={fontStyle}>
                    {loading ? t.calculating : t.calculate}
                  </span>
                  <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FlamesForm;

