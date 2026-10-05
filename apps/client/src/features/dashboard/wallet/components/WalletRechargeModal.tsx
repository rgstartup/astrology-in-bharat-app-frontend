"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { WalletRechargeForm } from "./WalletRechargeForm";

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
  const [rechargeKey, setRechargeKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRechargeKey((k) => k + 1);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        <DialogHeader className="pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
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

        <WalletRechargeForm
          key={rechargeKey}
          defaultAmount={defaultAmount}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
