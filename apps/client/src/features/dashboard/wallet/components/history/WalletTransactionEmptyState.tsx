import React from "react";
import { Button } from "@/features/dashboard";
import { Receipt, PlusCircle } from "lucide-react";
import type { TabFilterType } from "../../hooks/useWalletTransactions";

interface WalletTransactionEmptyStateProps {
  tabFilter: TabFilterType;
  onOpenRecharge: () => void;
}

export function WalletTransactionEmptyState({
  tabFilter,
  onOpenRecharge,
}: WalletTransactionEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 border border-slate-200 shadow-xs">
        <Receipt className="w-6 h-6 text-slate-600" />
      </div>
      <h4 className="text-sm font-bold text-slate-900 font-outfit mb-1">
        {tabFilter === "recharge"
          ? "No Recharge History Found"
          : "No Transactions Found"}
      </h4>
      <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
        {tabFilter === "recharge"
          ? "Recharge your wallet to see payment records and invoices here."
          : "All deductions, consultations, and recharges will appear here."}
      </p>
      <Button
        onClick={onOpenRecharge}
        size="sm"
        className="rounded-full font-bold bg-[#ff6b00] text-white text-xs shadow-xs hover:bg-[#ff6b00]/90 cursor-pointer"
      >
        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
        <span>Recharge Now</span>
      </Button>
    </div>
  );
}
