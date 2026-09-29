"use client";

import React from "react";
import { Card } from "@/features/dashboard";
import type { TabFilterType, TabDataState } from "../hooks/useWalletTransactions";
import {
  WalletTransactionHistoryHeader,
  WalletTransactionTable,
  WalletTransactionSkeleton,
  WalletTransactionEmptyState,
  WalletTransactionLoadMore,
} from "./history";

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
    <Card className="p-5 sm:p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      {/* Header & Filter Tabs */}
      <WalletTransactionHistoryHeader
        tabFilter={tabFilter}
        onTabChange={onTabChange}
      />

      {/* Content Area */}
      <div className="mt-2">
        {!currentTab.loaded && isFetchingTx ? (
          <WalletTransactionSkeleton />
        ) : currentTransactions.length === 0 ? (
          <WalletTransactionEmptyState
            tabFilter={tabFilter}
            onOpenRecharge={onOpenRecharge}
          />
        ) : (
          <div className="space-y-3">
            <WalletTransactionTable transactions={currentTransactions} />
            <WalletTransactionLoadMore
              hasMore={currentTab.hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={onLoadMore}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
