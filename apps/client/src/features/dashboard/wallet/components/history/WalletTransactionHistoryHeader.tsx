import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History } from "lucide-react";
import type { TabFilterType } from "../../hooks/useWalletTransactions";

interface WalletTransactionHistoryHeaderProps {
  tabFilter: TabFilterType;
  onTabChange: (tab: TabFilterType) => void;
}

export function WalletTransactionHistoryHeader({
  tabFilter,
  onTabChange,
}: WalletTransactionHistoryHeaderProps) {
  return (
    <Tabs
      value={tabFilter}
      onValueChange={(val) => onTabChange(val as TabFilterType)}
      className="w-full gap-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
            <History className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
              Transaction History
            </h2>
            <p className="text-[11px] text-slate-500">
              Wallet credits, consultation debits, and recharges
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <TabsList className="p-1 bg-slate-100 rounded-full border border-slate-200 self-start sm:self-auto shrink-0 h-auto gap-0.5">
          <TabsTrigger
            value="all"
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
              tabFilter === "all"
                ? "bg-[#ff6b00] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="recharge"
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
              tabFilter === "recharge"
                ? "bg-[#ff6b00] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Recharges
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
