"use client";

import React from "react";
import { FaComments, FaHeart, FaChartLine, FaLock, FaCertificate, FaUsers, FaCheckCircle } from "react-icons/fa";

const EducationalContent = () => {
  return (
    <div className="bg-transparent pb-8 pt-2">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Unified Educational Card */}
        <div className="bg-[#fffdfa] border-2 border-orange-500 shadow-[0_4px_24px_rgb(0,0,0,0.02)] rounded-[2.5rem] p-8 lg:p-12">
          
          {/* Top: What This Means Section */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 mb-10">
            
            <div className="lg:w-1/3">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-orange-500">✦</span> What This Means?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Your score is above <strong className="text-slate-800">18</strong> which is considered a <strong className="text-slate-800">good match</strong>. Higher the score, stronger will be your bond.
            </p>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex gap-4 bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-200">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <FaComments />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Communication</h4>
                <p className="text-xs text-slate-700 leading-relaxed">You both understand each other well.</p>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-200">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <FaHeart />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Emotional Bond</h4>
                <p className="text-xs text-slate-700 leading-relaxed">Strong emotional connection indicated.</p>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-200">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <FaChartLine />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Future Prospects</h4>
                <p className="text-xs text-slate-700 leading-relaxed">Positive signs for a happy married life.</p>
              </div>
            </div>
          </div>
          </div>

          {/* Bottom: Trust Badges */}
          <div className="border-t border-gray-100 pt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="text-2xl text-orange-300">
              <FaLock />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">100% Secure & Private</h4>
              <p className="text-xs text-slate-700">Your data is encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="text-2xl text-orange-300">
              <FaCertificate />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Verified Astrology</h4>
              <p className="text-xs text-slate-700">As per Vedic Scriptures</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="text-2xl text-orange-300">
              <FaUsers />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Trusted by 1M+</h4>
              <p className="text-xs text-slate-700">Happy customers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="text-2xl text-orange-300">
              <FaCheckCircle />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Accurate Matching</h4>
              <p className="text-xs text-slate-700">36 Point Analysis</p>
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;
