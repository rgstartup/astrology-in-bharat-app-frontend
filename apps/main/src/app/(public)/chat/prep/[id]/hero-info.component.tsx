"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

const { MessageSquare, User, Calendar } = LucideIcons as any;

type Props = {
  expertName?: string;
};

const HeroInfo = ({ expertName }: Props) => {
  return (
    <div className="order-2 lg:order-1 lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
      <div className="space-y-4">
        <span className="px-4 py-1.5 bg-orange/10 text-orange text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-orange/20 inline-block">
          Preparing Connection
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-100 leading-[1.1] tracking-tight">
          Talk to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange">
            {expertName}
          </span>
        </h1>
        <p className="text-white text-lg md:text-xl font-medium max-w-lg leading-relaxed">
          Get deep cosmic insights about your career, marriage, and future. Your
          session is 100% private.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-[#1A1A1A] hover:bg-[#242424] border-2 border-orange shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange/20 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
            <MessageSquare className="w-6 h-6 text-orange" />
          </div>
          <h3 className="font-bold text-gray-100 mb-1">Live Chat</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Real-time answers from verified experts.
          </p>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-[#1A1A1A] hover:bg-[#242424] border-2 border-orange shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-orange/20 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
            <Calendar className="w-6 h-6 text-orange" />
          </div>
          <h3 className="font-bold text-gray-100 mb-1">Instant Access</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            No appointments needed. Connect now.
          </p>
        </div>
      </div>

      {/* Consultation Checklist */}
      <div className="p-8 rounded-[3rem] bg-[#1a1a1a] text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange opacity-10 blur-[80px] -mr-32 -mt-32"></div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          Session Checklist
        </h3>
        <ul className="space-y-4">
          {[
            "Keep your Birth Date & Time ready",
            "Ask specific questions for clearer answers",
            "Your session is 256-bit encrypted",
            "Expert is live and awaiting your message",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">
                {i + 1}
              </div>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeroInfo;
