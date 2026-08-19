"use client";

import React from "react";
import { FaMars, FaVenus, FaSpinner, FaChevronRight } from "react-icons/fa";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";

import { MatchFormProps } from "@/lib/types";

const InputForm = ({
  boyDetails,
  girlDetails,
  handleInputChange,
  handleLocationSelect,
  handleMatch,
  loading,
  error,
}: MatchFormProps) => {
  return (
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Boy's Card */}
          <div className="group">
            <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 transition-all duration-500 hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <FaMars size={120} />
              </div>
              
              <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <FaMars size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">
                    Groom&apos;s Profile
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                    Mental & Star Analysis
                  </p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-indigo-500/50">Full Name</label>
                   <input
                     type="text"
                     className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                     placeholder="Enter name"
                     value={boyDetails.name}
                     onChange={(e) => handleInputChange("boy", "name", e.target.value)}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-indigo-500/50">Birth Date</label>
                    <input
                      type="date"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={boyDetails.date}
                      onChange={(e) => handleInputChange("boy", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-indigo-500/50">Birth Time</label>
                    <input
                      type="time"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={boyDetails.time}
                      onChange={(e) => handleInputChange("boy", "time", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-indigo-500/50">Birth Place</label>
                  <LocationAutocomplete
                    placeholder="Search city"
                    onSelect={(val) => handleLocationSelect("boy", val)}
                    initialValue={boyDetails.locationName}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Girl's Card */}
          <div className="group">
            <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 transition-all duration-500 hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <FaVenus size={120} />
              </div>
              
              <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange shadow-sm border border-orange-100/50 group-hover:bg-orange group-hover:text-white transition-all duration-500">
                  <FaVenus size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">
                    Bride&apos;s Profile
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                    Emotional & Star Analysis
                  </p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-orange/50">Full Name</label>
                   <input
                     type="text"
                     className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-orange/30 focus:ring-4 focus:ring-orange/5 transition-all outline-none text-sm font-bold text-gray-900"
                     placeholder="Enter name"
                     value={girlDetails.name}
                     onChange={(e) => handleInputChange("girl", "name", e.target.value)}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-orange/50">Birth Date</label>
                    <input
                      type="date"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-orange/30 focus:ring-4 focus:ring-orange/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={girlDetails.date}
                      onChange={(e) => handleInputChange("girl", "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-orange/50">Birth Time</label>
                    <input
                      type="time"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-orange/30 focus:ring-4 focus:ring-orange/5 transition-all outline-none text-sm font-bold text-gray-900"
                      value={girlDetails.time}
                      onChange={(e) => handleInputChange("girl", "time", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-orange/50">Birth Place</label>
                  <LocationAutocomplete
                    placeholder="Search city"
                    onSelect={(val) => handleLocationSelect("girl", val)}
                    initialValue={girlDetails.locationName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 max-w-xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 justify-center">
              <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</p>
            </div>
          )}
          
          <button
            disabled={loading}
            onClick={handleMatch}
            className="group relative w-full px-12 py-7 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-premium hover:shadow-2xl hover:bg-orange transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center gap-4">
              {loading ? (
                <>
                  <span>Calculating Star Points</span>
                  <FaSpinner className="animate-spin text-orange" />
                </>
              ) : (
                <>
                  <span>Compare Star Harmony</span>
                  <FaChevronRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </div>
          </button>
          
          <div className="flex items-center justify-center gap-4 opacity-30">
             <div className="h-[1px] w-12 bg-gray-300"></div>
             <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">Ancient Vedic Algorithm</span>
             <div className="h-[1px] w-12 bg-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputForm;
