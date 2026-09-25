"use client";

import React from "react";
import { Card, Button } from "@/features/dashboard";
import { Wallet, PlusCircle, ShieldCheck, Zap } from "lucide-react";

interface WalletBalanceCardProps {
  balance?: number;
  onOpenRecharge: (amount?: number) => void;
}

const QUICK_TOPUP_AMOUNTS = [100, 500, 1000];

export function WalletBalanceCard({
  balance = 0,
  onOpenRecharge,
}: WalletBalanceCardProps) {
  return (
    <Card className="p-4 sm:p-5 border border-amber-800 bg-amber-500/25 shadow-xs rounded-2xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-amber-900 border border-amber-800/30">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider font-outfit text-amber-950 block leading-none">
              Available Balance
            </span>
            <span className="text-[11px] font-medium text-amber-900/80">Consultation Wallet</span>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-white/80 text-amber-950 px-2 py-0.5 rounded-full uppercase border border-amber-800/30">
          INR (₹)
        </span>
      </div>

      <div className="pt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 tracking-tight">
            ₹{balance?.toLocaleString("en-IN") || 0}
          </span>
          <span className="text-xs font-semibold text-slate-600">.00</span>
        </div>
      </div>

      {/* Quick Top-up Shortcuts */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-amber-950 font-semibold">
          <span>Quick Add</span>
          <span className="flex items-center gap-0.5 text-emerald-800 text-[10px] font-bold">
            <Zap className="w-2.5 h-2.5" />
            Instant
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {QUICK_TOPUP_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onOpenRecharge(amt)}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-white/80 hover:bg-white text-slate-900 border border-amber-800/30 hover:border-amber-800 transition-colors cursor-pointer text-center shadow-xs"
            >
              +₹{amt}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onOpenRecharge()}
        className="w-full justify-center font-bold rounded-full bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90 shadow-xs h-9 text-xs cursor-pointer"
      >
        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
        <span>Recharge Credits</span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-amber-950 pt-1 border-t border-amber-800/20">
        <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
        <span>100% Encrypted & Safe Payments</span>
      </div>
    </Card>
  );
}
