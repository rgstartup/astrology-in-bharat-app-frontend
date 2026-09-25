"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  WalletBalanceCard,
  WalletQuickPerksCard,
  WalletTransactionHistory,
  WalletRechargeModal,
  useWalletTransactions,
} from "@/features/dashboard";

export default function MyWalletDashboardPage() {
  const { balance } = useAuthStore();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeInitialAmount, setRechargeInitialAmount] = useState<number>(500);

  const {
    tabFilter,
    currentTab,
    isFetchingTx,
    isLoadingMore,
    handleFilterChange,
    handleLoadMore,
    resetAndRefresh,
  } = useWalletTransactions();

  const handleOpenRecharge = (amount = 500) => {
    setRechargeInitialAmount(amount);
    setIsRechargeModalOpen(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 2-Column Grid: Left (Available Balance & Desktop Perks) & Right (Transaction History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column on Desktop / Top on Mobile */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          <WalletBalanceCard
            balance={balance}
            onOpenRecharge={handleOpenRecharge}
          />
          {/* Desktop Only: Benefits Card in Left Sidebar */}
          <div className="hidden lg:block">
            <WalletQuickPerksCard />
          </div>
        </div>

        {/* Right Column on Desktop / Directly Under Balance on Mobile */}
        <div className="lg:col-span-8 xl:col-span-8">
          <WalletTransactionHistory
            tabFilter={tabFilter}
            onTabChange={handleFilterChange}
            currentTab={currentTab}
            isFetchingTx={isFetchingTx}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            onOpenRecharge={() => handleOpenRecharge(500)}
          />
        </div>
      </div>

      {/* Mobile Only: Benefits Card at the very bottom below transactions */}
      <div className="lg:hidden block pt-2">
        <WalletQuickPerksCard />
      </div>

      {/* Recharge Credits Dialog Modal */}
      <WalletRechargeModal
        isOpen={isRechargeModalOpen}
        onOpenChange={setIsRechargeModalOpen}
        defaultAmount={rechargeInitialAmount}
        onSuccess={resetAndRefresh}
      />
    </div>
  );
}
