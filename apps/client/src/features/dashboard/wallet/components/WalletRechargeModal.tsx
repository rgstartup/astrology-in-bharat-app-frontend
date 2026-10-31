"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/design/shadcn";
import { CreditCard } from "@repo/design/lucide";
import { WalletRechargeForm } from "./WalletRechargeForm";

interface WalletRechargeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultAmount?: number;
  title?: string;
  subtitle?: string;
  banner?: React.ReactNode;
}

export function WalletRechargeModal({
  isOpen,
  onOpenChange,
  onSuccess,
  defaultAmount = 500,
  title = "Recharge Credits",
  subtitle = "Instant credit addition to your consultation wallet",
  banner,
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
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-500">
                {subtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {banner}

        <WalletRechargeForm
          key={rechargeKey}
          defaultAmount={defaultAmount}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
