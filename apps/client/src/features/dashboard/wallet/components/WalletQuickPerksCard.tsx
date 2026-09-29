"use client";

import React from "react";
import { Card } from "@/features/dashboard";
import { ShieldCheck, Zap, RefreshCcw, HelpCircle } from "lucide-react";

export function WalletQuickPerksCard() {
  return (
    <Card className="p-4 border border-slate-200 bg-white shadow-sm rounded-2xl space-y-3">
      <div className="flex items-center gap-1.5 text-slate-800">
        <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
        <h3 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-800">
          Wallet Benefits & Safety
        </h3>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
            <Zap className="w-3 h-3 text-slate-700" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Zero Delay Connection
            </span>
            <span className="text-[10.5px] text-slate-500 leading-tight block">
              Instant call and chat start with verified astrologers.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
            <RefreshCcw className="w-3 h-3 text-slate-700" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Instant Refund Guarantee
            </span>
            <span className="text-[10.5px] text-slate-500 leading-tight block">
              Automated reversal if connection fails or drops.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Bank-grade 256-bit Security
            </span>
            <span className="text-[10.5px] text-slate-500 leading-tight block">
              Encrypted transactions via RBI-approved payment gateways.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
