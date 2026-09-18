"use client";

import React from "react";
import { Lock, Clock } from "lucide-react";
import { TrustFooterProps } from "./types";

export const ProfileTrustFooter: React.FC<TrustFooterProps> = ({
  reportPrice,
  horoscopePrice,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-slate-500 shrink-0" />
          <span>100% Private & Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-slate-500 shrink-0" />
          <span>Wait: &lt; 60s</span>
        </div>
      </div>

      {(reportPrice || horoscopePrice) && (
        <div className="flex items-center gap-2">
          {reportPrice ? (
            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-600">Kundli:</span>
              <span className="font-bold text-slate-900">₹{reportPrice}</span>
            </div>
          ) : null}
          {horoscopePrice ? (
            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-600">Horoscope:</span>
              <span className="font-bold text-slate-900">₹{horoscopePrice}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
