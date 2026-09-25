"use client";

import React, { useState, useEffect } from "react";
import { Button, WALLET_RECHARGE_PACKS } from "@/features/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { api, API_ROUTES } from "@/actions";
import { loadRazorpay } from "@/libs/razorpay";
import { getErrorMessage, IClientRechargeInitiateResponse } from "@repo/lib";
import { CreditCard, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletRechargeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultAmount?: number;
}

export function WalletRechargeModal({
  isOpen,
  onOpenChange,
  onSuccess,
  defaultAmount = 500,
}: WalletRechargeModalProps) {
  const { user, updateBalance } = useAuthStore();
  const [rechargeAmount, setRechargeAmount] = useState<number>(defaultAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (defaultAmount && isOpen) {
      setRechargeAmount(defaultAmount);
    }
  }, [defaultAmount, isOpen]);

  const selectedPack = WALLET_RECHARGE_PACKS.find(
    (p) => p.amount === rechargeAmount,
  );
  const bonusAmount = selectedPack?.bonus || 0;
  const totalCredited = (rechargeAmount || 0) + bonusAmount;

  const handleRecharge = async () => {
    if (!rechargeAmount || rechargeAmount < 50) {
      toast.error("Please enter a minimum recharge amount of ₹50");
      return;
    }

    try {
      setIsProcessing(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Please try again.");
        setIsProcessing(false);
        return;
      }

      const [orderRes, orderError] =
        await api.post<IClientRechargeInitiateResponse>(
          API_ROUTES.CLIENT.WALLET.RECHARGE_INITIATE,
          {
            amount: rechargeAmount,
          },
        );

      if (orderError || !orderRes) {
        toast.error(
          getErrorMessage(orderError) || "Failed to create payment order.",
        );

        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "Astrology in Bharat",
        description: "Wallet Recharge",
        order_id: orderRes.id,
        handler: async (response: any) => {
          const [verifyRes, verifyError] = await api.post<{
            balance: number;
          }>(API_ROUTES.CLIENT.WALLET.RECHARGE_VERIFY, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyError || !verifyRes) {
            toast.error(
              getErrorMessage(verifyError) || "Payment verification failed!",
            );
            return;
          }

          updateBalance(verifyRes.balance);
          toast.success(`Successfully recharged ₹${rechargeAmount}!`);

          onSuccess();
          onOpenChange(false);
          setIsProcessing(false);
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#ff6b00" },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch {
      toast.error("Something went wrong with recharge.");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 bg-white rounded-3xl overflow-hidden border border-amber-800 shadow-2xl">
        <DialogHeader className="pb-2.5 border-b border-amber-800/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-950 flex items-center justify-center shrink-0 border border-amber-800/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                Recharge Credits
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-500">
                Instant credit addition to your consultation wallet
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-2 space-y-3.5">
          {/* Recharge Pack Options */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Select Recharge Pack
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Quick Select
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {WALLET_RECHARGE_PACKS.map((pack) => {
                const isSelected = rechargeAmount === pack.amount;
                return (
                  <button
                    key={pack.amount}
                    type="button"
                    onClick={() => setRechargeAmount(pack.amount)}
                    className={`relative p-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-xs"
                        : "bg-slate-50/80 hover:bg-amber-500/10 text-slate-800 border-slate-200 hover:border-amber-800/40"
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-slate-900 text-white shadow-xs tracking-wider whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <span>{pack.label}</span>
                    {pack.bonus && (
                      <span
                        className={`text-[9px] font-semibold mt-0.5 ${
                          isSelected ? "text-white/90" : "text-emerald-700"
                        }`}
                      >
                        +₹{pack.bonus} Free
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Or Custom Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                ₹
              </span>
              <input
                type="number"
                min="50"
                value={rechargeAmount || ""}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs font-bold text-slate-900"
                placeholder="Enter amount (min ₹50)"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-2.5 rounded-xl bg-slate-50/90 border border-amber-800/20 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Recharge Payable
              </span>
              <span className="font-bold text-slate-800 font-outfit">
                ₹{rechargeAmount || 0}
              </span>
            </div>
            {bonusAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-600">
                <span className="font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Promo Bonus Added
                </span>
                <span className="font-bold">+₹{bonusAmount}</span>
              </div>
            )}
            <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Total Wallet Credit</span>
              <span className="text-slate-900 font-outfit text-sm">
                ₹{totalCredited.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Recharge Action Button */}
          <Button
            onClick={handleRecharge}
            disabled={isProcessing}
            className="w-full justify-center font-bold rounded-full h-9 text-xs bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {isProcessing
                ? "Processing..."
                : `Pay ₹${(rechargeAmount || 0).toLocaleString("en-IN")} & Recharge`}
            </span>
          </Button>

          {/* Trust Footer */}
          <div className="flex flex-col items-center justify-center gap-0.5 text-[10px] text-slate-400 pt-0.5">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>100% Encrypted & Safe • Razorpay Secure</span>
            </div>
            <span className="text-[9px] text-slate-400">
              UPI • Credit / Debit Cards • NetBanking
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
