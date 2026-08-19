"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  X, 
  Wallet, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Building2,
  Lock
} from "lucide-react";
import { useMerchantProfile } from "@/hooks/useSettings";
import { useRequestWithdrawal } from "@/hooks/useFinance";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({ 
  isOpen, 
  onClose, 
  availableBalance 
}) => {
  const [amount, setAmount] = useState<string>("");
  const { data: profileData, isLoading: isProfileLoading, refetch } = useMerchantProfile();
  const requestWithdrawal = useRequestWithdrawal();
  
  // Force refresh data when modal opens to ensure we have the latest bank details
  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const profile = profileData?.profile;
  const minAmount = 500;
  const isAmountValid = Number(amount) >= minAmount && Number(amount) <= availableBalance;

  const handleSubmit = async () => {
    if (!isAmountValid) return;
    try {
      await requestWithdrawal.mutateAsync({ amount: Number(amount) });
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl border border-white"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#fd6410]">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Withdraw Funds</h2>
                  <p className="text-[10px] font-bold text-gray-400">Paisa Nikaalein</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Balance Card */}
              <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <p className="text-white/50 text-[10px] font-bold">Available Balance</p>
                  <p className="text-3xl font-bold mt-1">₹{availableBalance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 pl-1">
                  Withdrawal Amount (Min ₹500)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fd6410] transition-colors">
                    <span className="font-bold text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all"
                  />
                </div>
                {amount && Number(amount) < minAmount && (
                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1.5 pl-1 animate-in fade-in slide-in-from-left-2">
                        <AlertCircle className="w-3 h-3" /> Minimum withdrawal is ₹500
                    </p>
                )}
                {amount && Number(amount) > availableBalance && (
                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1.5 pl-1">
                        <AlertCircle className="w-3 h-3" /> Insufficient balance
                    </p>
                )}
              </div>

              {/* Bank Details Snippet */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-5 space-y-3">
                 <div className="flex items-center gap-2 text-[#fd6410]">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Payout Destination</span>
                 </div>
                 
                 {isProfileLoading ? (
                    <div className="space-y-2 py-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                 ) : (
                    <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold">Bank Name</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{profile?.bankName || "Not Set"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold">Account Number</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{profile?.accountNumber || "Not Set"}</p>
                        </div>
                    </div>
                    {!profile?.bankName && (
                        <div className="pt-2 border-t border-orange-100 flex items-center justify-between">
                            <p className="text-[9px] text-orange-600 font-bold italic">* Please set bank details in Profile settings first.</p>
                            <Link 
                                href="/profile" 
                                onClick={onClose}
                                className="text-[9px] font-bold text-[#fd6410] hover:underline flex items-center gap-1"
                            >
                                Set Now <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                        </div>
                    )}
                    </>
                 )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
               <div className="flex items-center gap-2 text-gray-400 px-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-[9px] font-bold leading-none">Secure payout processing</span>
               </div>
               <button
                  onClick={handleSubmit}
                  disabled={!isAmountValid || requestWithdrawal.isPending || !profile?.bankName}
                  className={cn(
                    "w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm  transition-all shadow-xl active:scale-[0.98]",
                    isAmountValid && profile?.bankName
                        ? "bg-[#301118] text-white shadow-maroon-900/20 hover:bg-[#4a1a25] hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  )}
               >
                  {requestWithdrawal.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                      <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span>{requestWithdrawal.isPending ? "Confirming Request..." : "Request Payout"}</span>
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
