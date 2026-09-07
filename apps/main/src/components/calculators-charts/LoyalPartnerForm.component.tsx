import React from "react";
import { FaUser, FaArrowRight, FaSpinner, FaRegCalendarAlt as FaCalendar, FaShieldAlt } from "react-icons/fa";
import { GiLotus } from "react-icons/gi";
import { LoyalPartnerFormProps } from "@/lib/types/calculator";

const LoyalPartnerForm: React.FC<LoyalPartnerFormProps> = ({
  yourName,
  setYourName,
  partnerName,
  setPartnerName,
  yourDob,
  setYourDob,
  partnerDob,
  setPartnerDob,
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

          <form onSubmit={handleCalculate} className="max-w-4xl mx-auto">
            <div className="glass-card rounded-[3rem] p-6 md:p-10 shadow-[0_15px_45px_rgba(48,17,24,0.1)] border border-[#301118]/5 relative overflow-hidden bg-white space-y-6">
              {/* Names */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                    {t.yourName}
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      style={{ borderRadius: "9999px", ...fontStyle }}
                      className="w-full bg-[#fdf2f2] border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                      placeholder={t.yourPlaceholder}
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                      <FaUser size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                    {t.partnerName}
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      style={{ borderRadius: "9999px", ...fontStyle }}
                      className="w-full bg-[#fdf2f2] border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                      placeholder={t.partnerPlaceholder}
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                      <FaUser size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* DOBs (required but not used) */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                    {t.yourDob}
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      required
                      style={{ borderRadius: "9999px", ...fontStyle }}
                      className="w-full bg-white border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                      value={yourDob}
                      onChange={(e) => setYourDob(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                      <FaCalendar size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1" style={fontStyle}>
                    {t.partnerDob}
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      required
                      style={{ borderRadius: "9999px", ...fontStyle }}
                      className="w-full bg-white border-2 border-[#301118]/5 px-6 py-4 text-[#301118] font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                      value={partnerDob}
                      onChange={(e) => setPartnerDob(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#301118]/30">
                      <FaCalendar size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading || !canCalculate}
                  style={{ borderRadius: "9999px" }}
                  className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-12 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaShieldAlt size={16} />
                  )}
                  <span style={fontStyle}>
                    {loading ? t.calculating : t.calculate}
                  </span>
                  <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="m-0 text-center text-xs text-gray-400 italic" style={fontStyle}>
                {t.disclaimer}
              </p>
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

export default LoyalPartnerForm;

