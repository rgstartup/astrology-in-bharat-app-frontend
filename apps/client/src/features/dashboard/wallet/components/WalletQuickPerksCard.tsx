"use client";

import React from "react";
import { Card } from "@/features/dashboard";
import { ShieldCheck, Zap, RefreshCcw, HelpCircle } from "lucide-react";

export function WalletQuickPerksCard() {
  return (
    <Card className="p-4 border border-amber-800 bg-amber-500/25 shadow-xs rounded-2xl space-y-3">
      <div className="flex items-center gap-1.5 text-amber-950">
        <HelpCircle className="w-3.5 h-3.5 text-amber-900" />
        <h3 className="text-xs font-bold font-outfit uppercase tracking-wider text-amber-950">
          Wallet Benefits & Safety
        </h3>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/80 text-amber-950 flex items-center justify-center shrink-0 mt-0.5 border border-amber-800/20 shadow-xs">
            <Zap className="w-3 h-3 text-amber-900" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Zero Delay Connection
            </span>
            <span className="text-[10.5px] text-slate-700 leading-tight block">
              Instant call and chat start with verified astrologers.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/80 text-amber-950 flex items-center justify-center shrink-0 mt-0.5 border border-amber-800/20 shadow-xs">
            <RefreshCcw className="w-3 h-3 text-amber-900" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Instant Refund Guarantee
            </span>
            <span className="text-[10.5px] text-slate-700 leading-tight block">
              Automated reversal if connection fails or drops.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-800/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              Bank-grade 256-bit Security
            </span>
            <span className="text-[10.5px] text-slate-700 leading-tight block">
              Encrypted transactions via RBI-approved payment gateways.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
