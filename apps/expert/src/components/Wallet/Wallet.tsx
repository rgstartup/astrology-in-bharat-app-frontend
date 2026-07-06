"use client";

import React from "react";
import WalletStats from "./WalletStats";
import WithdrawMoney from "./WithdrawMoney";
import WalletTable from "./WalletTable";
import { useWallet } from "@/hooks/useWallet";
import { WalletSkeleton } from "../dashboard/DashboardSkeletons";

export default function Wallet() {
    const { 
        stats, 
        transactions, 
        bankAccounts, 
        isLoading, 
        handleWithdraw,
        isWithdrawing 
    } = useWallet();

    if (isLoading) {
        return <WalletSkeleton />;
    }

    // Default stats if fetch failed or loading
    const displayStats = stats || {
        availableBalance: 0,
        totalWithdrawn: 0,
        pendingApproval: 0,
        processing: 0,
        totalEarnings: 0
    };

    return (
        <div className="min-h-screen bg-white sm:bg-gray-50/50 p-0 sm:p-6 lg:p-8">
            <header className="px-4 pt-6 sm:px-0 sm:pt-0 mb-6 sm:mb-8 font-outfit">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wallet</h1>
                <p className="text-gray-500 mt-1">Manage your balance and schedule payouts to your bank account.</p>
            </header>

            <div className="max-w-7xl mx-auto flex flex-col sm:gap-8">
                <div className="px-4 sm:px-0 mb-6 sm:mb-0">
                    <WalletStats stats={displayStats} />
                </div>

                <div className="border-t-[8px] border-gray-50 sm:border-none pt-6 sm:pt-0">
                    <WithdrawMoney
                        availableBalance={displayStats.availableBalance}
                        bankAccounts={bankAccounts}
                        onWithdraw={handleWithdraw}
                        isLoading={isWithdrawing}
                    />
                </div>

                <div className="border-t-[8px] border-gray-50 sm:border-none pt-4 sm:pt-0 pb-12">
                    <WalletTable transactions={transactions} />
                </div>
            </div>
        </div>
    );
}


