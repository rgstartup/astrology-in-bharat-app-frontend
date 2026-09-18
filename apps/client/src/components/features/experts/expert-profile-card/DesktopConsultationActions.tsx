"use client";

import React from "react";
import { Phone, Video, MessageSquare } from "lucide-react";
import { ConsultationActionsProps } from "./types";

export const DesktopConsultationActions: React.FC<ConsultationActionsProps> = ({
  chatPrice,
  callPrice,
  videoCallPrice,
  onChatClick,
  onCallClick,
  onVideoCallClick,
}) => {
  return (
    <div className="hidden lg:grid grid-cols-3 gap-3 pt-0.5">
      {/* 1. Chat CTA Card */}
      <button
        type="button"
        onClick={onChatClick}
        className="group/chat flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-orange-50/70 hover:bg-orange-50/95 border border-orange-200/60 text-gray-900 transition-all cursor-pointer hover:border-orange-300/80 active:scale-[0.99] shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 sm:size-9 rounded-lg bg-orange text-white flex items-center justify-center group-hover/chat:scale-105 transition-transform shrink-0 shadow-2xs">
            <MessageSquare className="size-4 fill-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 truncate">
            Chat
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="bg-white border border-orange-200/60 px-2 py-0.5 rounded-md shadow-2xs">
            <span className="text-xs sm:text-sm font-black text-orange-600">
              ₹{chatPrice}
              <span className="text-[10px] font-normal text-gray-500">
                /min
              </span>
            </span>
          </div>
        </div>
      </button>

      {/* 2. Voice Call CTA Card */}
      <button
        type="button"
        onClick={onCallClick}
        className="group/call flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50/95 border border-emerald-200/60 text-gray-900 transition-all cursor-pointer hover:border-emerald-300/80 active:scale-[0.99] shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 sm:size-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover/call:scale-105 transition-transform shrink-0 shadow-2xs">
            <Phone className="size-4 fill-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 truncate">
            Voice Call
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="bg-white border border-emerald-200/60 px-2 py-0.5 rounded-md shadow-2xs">
            <span className="text-xs sm:text-sm font-black text-emerald-600">
              ₹{callPrice}
              <span className="text-[10px] font-normal text-gray-500">
                /min
              </span>
            </span>
          </div>
        </div>
      </button>

      {/* 3. Video Call CTA Card */}
      <button
        type="button"
        onClick={onVideoCallClick}
        className="group/video flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-50/95 border border-indigo-200/60 text-gray-900 transition-all cursor-pointer hover:border-indigo-300/80 active:scale-[0.99] shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 sm:size-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover/video:scale-105 transition-transform shrink-0 shadow-2xs">
            <Video className="size-4.5 fill-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 truncate">
            Video Call
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="bg-white border border-indigo-200/60 px-2 py-0.5 rounded-md shadow-2xs">
            <span className="text-xs sm:text-sm font-black text-indigo-600">
              ₹{videoCallPrice}
              <span className="text-[10px] font-normal text-gray-500">
                /min
              </span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
