"use client";

import React from "react";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import { Expert } from "@/lib/types";

const Image = NextImage as any;
const { MessageSquare, MapPin, Sparkles, ArrowRight } = LucideIcons as any;

type Props = {
  expert: Expert | null;
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: any;
  setSomeoneElseData: (val: any) => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
};

const ExpertPreview = ({
  expert,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
}: Props) => {
  return (
    <div className="order-1 lg:order-2 lg:col-span-5 relative">
      <div className="sticky top-28">
        <div className="p-2 bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Expert Image Section */}
          <div className="relative h-[380px] rounded-[3rem] overflow-hidden group">
            <Image
              src={expert?.image || "/images/dummy-expert.jpg"}
              alt={expert?.name || "Expert"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Availability Badge */}
            <div
              className={`absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-full border shadow-sm flex items-center gap-2 ${
                expert?.is_available
                  ? "bg-orange border-white/20"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  expert?.is_available
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                    : "bg-gray-400"
                }`}
              ></div>
              <span
                className={`${
                  expert?.is_available ? "text-white" : "text-gray-400"
                } text-[10px] font-black uppercase tracking-widest`}
              >
                {expert?.is_available ? "Available Now" : "Offline"}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-orange rounded-full shadow-lg flex items-center gap-2">
              <span className="text-white text-xs font-black uppercase tracking-widest">
                ₹{expert?.chat_price || expert?.price || 0} / min
              </span>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-[2rem] p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">
                      Expertise
                    </span>
                    <span className="text-white font-bold text-sm line-clamp-1 truncate" title={expert?.expertise}>
                      {expert?.expertise || "Astrology, Vastu, Palmistry"}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-white/20 flex-shrink-0"></div>
                  <div className="flex flex-col flex-shrink-0">
                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1 text-right">
                      Experience
                    </span>
                    <span className="text-white font-bold text-right text-sm">
                      {expert?.experience}+ Years
                    </span>
                  </div>
                </div>
                
                <div className="h-[1px] w-full bg-white/10"></div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange" />
                  <span className="text-white/80 text-xs font-medium">
                    Verified Astro Expert • Bharat
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Option to toggle who is asking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Consulting for
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {askSomeoneElse ? "Myself" : "Someone Else"}
                  </span>
                </div>
                <button
                  onClick={() => setAskSomeoneElse(!askSomeoneElse)}
                  className="px-4 py-2 text-[10px] font-black text-orange uppercase tracking-widest hover:bg-orange/5 rounded-xl transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Someone Else Form */}
              {!askSomeoneElse && (
                <div className="p-6 rounded-[2rem] bg-orange/5 border border-orange/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-orange/60 uppercase tracking-widest ml-1 mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Name"
                        value={someoneElseData.name}
                        onChange={(e) =>
                          setSomeoneElseData({
                            ...someoneElseData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white rounded-xl border border-orange/10 focus:border-orange/30 outline-none text-sm font-bold text-gray-900 shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-orange/60 uppercase tracking-widest ml-1 mb-1.5 block">
                          Gender
                        </label>
                        <select
                          value={someoneElseData.gender}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              gender: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-orange/10 focus:border-orange/30 outline-none text-sm font-bold text-gray-900 shadow-sm appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-orange/60 uppercase tracking-widest ml-1 mb-1.5 block">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          value={someoneElseData.dob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              dob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-orange/10 focus:border-orange/30 outline-none text-sm font-bold text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-orange/60 uppercase tracking-widest ml-1 mb-1.5 block">
                          Birth Time
                        </label>
                        <input
                          type="time"
                          value={someoneElseData.tob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              tob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-orange/10 focus:border-orange/30 outline-none text-sm font-bold text-gray-900 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-orange/60 uppercase tracking-widest ml-1 mb-1.5 block">
                          Birth Place
                        </label>
                        <input
                          type="text"
                          placeholder="City, Country"
                          value={someoneElseData.pob}
                          onChange={(e) =>
                            setSomeoneElseData({
                              ...someoneElseData,
                              pob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white rounded-xl border border-orange/10 focus:border-orange/30 outline-none text-sm font-bold text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Big CTA */}
            <div className="pt-6 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange to-orange/80 rounded-[45px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

              <button
                onClick={handleStartConsultation}
                disabled={actionLoading}
                className={`group relative w-full py-4 md:py-5 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-[2rem] md:rounded-[2.5rem] font-extrabold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(255,85,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,85,0,0.4)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.98] transition-all duration-300 border-b-[5px] border-[#CC4400] overflow-hidden cursor-pointer ${
                  actionLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {/* 3D Depth overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                {/* Hover shine effect */}
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] group-hover:animate-[none] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
                
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 relative z-10 group-hover:scale-125 transition-transform duration-300" fill="currentColor" />
                <span className="tracking-wide relative z-10">
                  {actionLoading ? "CONNECTING..." : "START CONSULTATION"}
                </span>
                <ArrowRight className="w-5 h-5 text-white/70 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </button>


            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpertPreview;
