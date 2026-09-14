"use client";

import React from "react";
import Image from "next/image";
import { FaCalendarAlt, FaChevronRight, FaSpinner, FaCheck } from "react-icons/fa";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";

type Props = {
  details: any;
  handleInputChange: (field: string, value: any) => void;
  handleLocationSelect: (location: any) => void;
  handleAnalyze: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
};

const InputForm = ({
  details,
  handleInputChange,
  handleLocationSelect,
  handleAnalyze,
  loading,
  error,
}: Props) => {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form Area */}
          <div className="lg:col-span-7">
            <div className="h-full bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-8 md:p-12 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100/50 italic font-black text-2xl">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">
                    Birth Details
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                    Start Your Free Planetary Audit
                  </p>
                </div>
              </div>

              <form className="space-y-8" onSubmit={handleAnalyze}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                      placeholder="Enter your name"
                      value={details.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                    <select
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm font-bold text-gray-900 appearance-none cursor-pointer"
                      value={details.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Birth Date</label>
                    <input
                      type="date"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={details.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Birth Time</label>
                    <input
                      type="time"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={details.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Birth Place</label>
                    <LocationAutocomplete
                      placeholder="Search city"
                      onSelect={handleLocationSelect}
                      initialValue={details.locationName}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                    <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-12 py-6 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-premium hover:shadow-2xl hover:bg-red-600 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-4">
                    {loading ? (
                      <>
                        <span>Analyzing Astral Charts</span>
                        <FaSpinner className="animate-spin text-red-500" />
                      </>
                    ) : (
                      <>
                        <span>Analyze Mangal Dosha Now</span>
                        <FaChevronRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-[2.5rem] overflow-hidden relative h-72 group shadow-premium border border-white">
              <Image
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
                alt="Meditation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent p-10 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="w-10 h-1bg-orange rounded-full"></div>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    Understanding <br/><span className="text-red-500">Mars Affliction</span>
                  </h3>
                  <p className="text-sm font-bold text-gray-300 italic max-w-xs leaing-relaxed">
                    &quot;Occurs when Mars occupies key positions in your birth chart, impacting harmony.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-50 flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Analysis Benefits</h3>
                <span className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-red-100">Why now?</span>
              </div>
              
              <ul className="space-y-5">
                {[
                  "Check marriage compatibility issues.",
                  "Find effective Vedic remedies.",
                  "Clarity on career hurdles.",
                  "Plan auspicious life events.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100/50">
                      <FaCheck size={10} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputForm;
