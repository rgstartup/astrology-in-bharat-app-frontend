"use client";

import React from "react";
import { Card, Button, Skeleton } from "@/features/dashboard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Receipt, PlusCircle, RefreshCw } from "lucide-react";
import { WalletTransactionItem } from "./WalletTransactionItem";
import type { TabFilterType, TabDataState } from "../hooks/useWalletTransactions";

interface WalletTransactionHistoryProps {
  tabFilter: TabFilterType;
  onTabChange: (tab: TabFilterType) => void;
  currentTab: TabDataState;
  isFetchingTx: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onOpenRecharge: () => void;
}

export function WalletTransactionHistory({
  tabFilter,
  onTabChange,
  currentTab,
  isFetchingTx,
  isLoadingMore,
  onLoadMore,
  onOpenRecharge,
}: WalletTransactionHistoryProps) {
  const currentTransactions = currentTab.items;

  return (
    <Card className="p-5 sm:p-6 border border-amber-800 bg-amber-500/25 shadow-xs rounded-2xl">
      {/* History Header & Sub-Tabs */}
      <Tabs
        value={tabFilter}
        onValueChange={(val) => onTabChange(val as TabFilterType)}
        className="w-full gap-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-800/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/80 text-amber-950 flex items-center justify-center shrink-0 border border-amber-800/20 shadow-xs">
              <History className="w-4 h-4 text-amber-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                Transaction History
              </h2>
              <p className="text-[11px] text-slate-700">
                Wallet credits, consultation debits, and recharges
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <TabsList className="p-1 bg-white/70 rounded-full border border-amber-800/30 self-start sm:self-auto shrink-0 h-auto gap-0.5">
            <TabsTrigger
              value="all"
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                tabFilter === "all"
                  ? "bg-[#ff6b00] text-white shadow-xs"
                  : "text-slate-800 hover:text-slate-950 hover:bg-white/80"
              }`}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="recharge"
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                tabFilter === "recharge"
                  ? "bg-[#ff6b00] text-white shadow-xs"
                  : "text-slate-800 hover:text-slate-950 hover:bg-white/80"
              }`}
            >
              Recharges
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* History List */}
      <div className="mt-3">
        {!currentTab.loaded && isFetchingTx ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-amber-800/20 flex items-center justify-between gap-3 bg-white/40"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0 bg-white/70" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-36 bg-white/70" />
                    <Skeleton className="h-3 w-20 bg-white/70" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-3.5 w-16 ml-auto bg-white/70" />
                  <Skeleton className="h-3 w-12 ml-auto bg-white/70" />
                </div>
              </div>
            ))}
          </div>
        ) : currentTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/80 text-amber-950 flex items-center justify-center mx-auto mb-3 border border-amber-800/20 shadow-xs">
              <Receipt className="w-6 h-6 text-amber-900" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 font-outfit mb-1">
              {tabFilter === "recharge"
                ? "No Recharge History Found"
                : "No Transactions Found"}
            </h4>
            <p className="text-xs text-slate-700 max-w-xs mx-auto mb-4">
              {tabFilter === "recharge"
                ? "Recharge your wallet to see payment records and invoices here."
                : "All deductions, consultations, and recharges will appear here."}
            </p>
            <Button
              onClick={onOpenRecharge}
              size="sm"
              className="rounded-full font-bold bg-[#ff6b00] text-white text-xs shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              <span>Recharge Now</span>
            </Button>
          </div>
        ) : (
          <div
            className={`space-y-1 ${
              isFetchingTx ? "opacity-75 transition-opacity" : ""
            }`}
          >
            <div className="divide-y divide-amber-800/15">
              {currentTransactions.map((tx: any, idx: number) => (
                <WalletTransactionItem
                  key={tx.id || tx._id || idx}
                  tx={tx}
                />
              ))}
            </div>

            {/* Load More Button */}
            {currentTab.hasMore && (
              <div className="pt-3 border-t border-amber-800/20 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-full font-bold text-xs h-8 bg-white/80 hover:bg-white text-slate-800 border-amber-800/30"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Transactions</span>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
