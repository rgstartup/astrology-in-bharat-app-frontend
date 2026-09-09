"use client";

import React, { useState } from "react";
import { Card, CardContent, Button, WALLET_RECHARGE_PACKS } from "@/features/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/actions";
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

export default function MyWalletDashboardPage() {
  const { balance, refreshBalance } = useAuthStore();
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async () => {
    if (!rechargeAmount || rechargeAmount < 50) {
      toast.error("Please enter a minimum recharge amount of ₹50");
      return;
    }

    try {
      setIsProcessing(true);
      const [res, err] = await api.post<any>("/wallet/recharge", {
        amount: rechargeAmount,
      });

      if (err) {
        toast.error(err.message || "Failed to initiate recharge");
        return;
      }

      if (res?.payment_url) {
        window.location.href = res.payment_url;
      } else {
        toast.success("Wallet recharged successfully!");
        refreshBalance();
      }
    } catch {
      toast.error("Something went wrong with recharge.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-orange-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
          My Wallet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Manage your consultation credits and instant recharge balance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-8 border-orange-200/90 bg-gradient-to-br from-[#301118] to-[#4a1d1f] text-white shadow-lg shadow-rose-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-2 mb-3 text-amber-300">
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider font-outfit">
                Available Credits
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl sm:text-5xl font-black font-outfit text-white">
                ₹{balance?.toLocaleString("en-IN") || 0}
              </span>
              <span className="text-xs font-bold text-amber-200/70">INR</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Used automatically for chat, audio, and video consultations with our verified Vedic experts.
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-amber-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Secure Encrypted Transactions</span>
            </div>
          </Card>
        </div>

        {/* Quick Recharge Card */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 border-orange-200/80 bg-white">
            <h3 className="text-lg font-bold text-slate-900 font-outfit mb-4">
              Recharge Credits
            </h3>

            <div className="mb-5">
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Select Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {WALLET_RECHARGE_PACKS.map((pack) => (
                  <button
                    key={pack.amount}
                    type="button"
                    onClick={() => setRechargeAmount(pack.amount)}
                    className={`relative py-2.5 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      rechargeAmount === pack.amount
                        ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-xs"
                        : "bg-orange-50/50 text-slate-800 border-orange-100 hover:bg-orange-100/60"
                    }`}
                  >
                    <span>{pack.label}</span>
                    {pack.bonus && (
                      <span className={`text-[10px] font-semibold ${rechargeAmount === pack.amount ? "text-amber-200" : "text-emerald-600"}`}>
                        +₹{pack.bonus} extra
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Or Enter Custom Amount (₹)
              </label>
              <input
                type="number"
                min="50"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-sm font-bold text-slate-900"
                placeholder="Enter amount (min ₹50)"
              />
            </div>

            <Button
              onClick={handleRecharge}
              disabled={isProcessing}
              className="w-full justify-center font-bold"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>{isProcessing ? "Processing..." : `Recharge ₹${rechargeAmount} Now`}</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
