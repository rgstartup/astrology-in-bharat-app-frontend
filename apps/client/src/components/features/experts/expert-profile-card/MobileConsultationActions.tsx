"use client";

import React from "react";
import { Phone, Video, MessageSquare } from "lucide-react";
import { ConsultationActionsProps } from "./types";

export const MobileConsultationActions: React.FC<ConsultationActionsProps> = ({
  chatPrice,
  callPrice,
  videoCallPrice,
  onChatClick,
  onCallClick,
  onVideoCallClick,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 lg:hidden pt-0.5">
      {/* Top Row: Voice Call & Video Call */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {/* Voice Call */}
        <button
          type="button"
          onClick={onCallClick}
          aria-label={`Voice Call (₹${callPrice}/min)`}
          className="group/call flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50/95 active:scale-95 border border-emerald-200/60 text-slate-900 transition-all cursor-pointer shadow-2xs"
        >
          <div className="size-7 sm:size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs group-hover/call:scale-105 transition-transform shrink-0">
            <Phone className="size-3.5 sm:size-4 fill-white" />
          </div>
          <div className="text-right shrink-0">
            <div className="bg-white border border-emerald-200/60 px-2 py-0.5 rounded-md shadow-2xs">
              <span className="text-xs font-extrabold text-emerald-600">
                ₹{callPrice}
                <span className="text-[9px] font-medium text-slate-500 ml-0.5">/min</span>
              </span>
            </div>
          </div>
        </button>

        {/* Video Call */}
        <button
          type="button"
          onClick={onVideoCallClick}
          aria-label={`Video Call (₹${videoCallPrice}/min)`}
          className="group/video flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-50/95 active:scale-95 border border-indigo-200/60 text-slate-900 transition-all cursor-pointer shadow-2xs"
        >
          <div className="size-7 sm:size-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs group-hover/video:scale-105 transition-transform shrink-0">
            <Video className="size-3.5 sm:size-4 fill-white" />
          </div>
          <div className="text-right shrink-0">
            <div className="bg-white border border-indigo-200/60 px-2 py-0.5 rounded-md shadow-2xs">
              <span className="text-xs font-extrabold text-indigo-600">
                ₹{videoCallPrice}
                <span className="text-[9px] font-medium text-slate-500 ml-0.5">/min</span>
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Row: Chat Full Width */}
      <button
        type="button"
        onClick={onChatClick}
        className="w-full group/chat flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-orange-50/70 hover:bg-orange-50/95 active:scale-95 border border-orange-200/60 text-slate-900 transition-all cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="size-7 sm:size-8 rounded-lg bg-orange text-white flex items-center justify-center shadow-2xs group-hover/chat:scale-105 transition-transform shrink-0">
            <MessageSquare className="size-3.5 sm:size-4 fill-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            Chat Now
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="bg-white border border-orange-200/60 px-2 py-0.5 rounded-md shadow-2xs">
            <span className="text-xs sm:text-sm font-extrabold text-orange-600">
              ₹{chatPrice}
              <span className="text-[10px] font-medium text-slate-500 ml-0.5">/min</span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
