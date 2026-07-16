"use client";

import React, { useState } from "react";
import { Wallet, Landmark, Clock, TrendingUp } from "lucide-react";
import { useMerchantFinanceStats, useMerchantTransactions, useRequestWithdrawal } from "@/hooks/useFinance";
import { useMerchantProfile } from "@/hooks/useSettings";
import { StatsCards } from "@repo/ui";
import { WithdrawSection } from "./components/WithdrawSection";
import { TransactionTable } from "./components/TransactionTable";

export default function WalletPage() {
    const [page] = useState(1);
    const [limit] = useState(50);

    const { data: stats, isLoading: statsLoading } = useMerchantFinanceStats();
    const { data: txData, isLoading: txLoading } = useMerchantTransactions({ page, limit });
    const { data: profileData, isLoading: profileLoading } = useMerchantProfile();
    const { mutate: requestWithdrawal, isPending: withdrawLoading } = useRequestWithdrawal();

    const handleWithdrawal = (amount: number, bankAccountId?: string) => {
        requestWithdrawal({ amount, bankAccountId });
    };

    const transactions = txData?.transactions?.map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        amountLabel: tx.amountLabel,
        status: tx.status,
        createdAt: tx.date,
        type: tx.type,
        typeLabel: tx.typeLabel,
        color: tx.color,
        icon: tx.icon,
        info: tx.info,
        remark: tx.remark,
        transactionNo: tx.id
    })) || [];

    const loading = statsLoading || profileLoading;

    return (
        <main className="space-y-8 pb-20 animate-in fade-in duration-700">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wallet</h1>
                    <p className="text-sm font-medium text-gray-500">Manage your shop earnings, track payouts, and withdraw funds.</p>
                </div>

                {/* Top Stat Triplets using shared @repo/ui component */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <StatsCards 
                        stats={[
                            {
                                title: "Available Balance",
                                value: `₹${(stats?.availableBalance || 0).toLocaleString('en-IN')}`,
                                icon: Wallet,
                                iconColor: "text-green-600",
                                iconBgColor: "bg-green-50",
                                trend: {
                                    value: "READY TO WITHDRAW",
                                    isPositive: true,
                                    color: "text-green-600"
                                }
                            },
                            {
                                title: "Total Withdrawn",
                                value: `₹${(stats?.totalPayouts || 0).toLocaleString('en-IN')}`,
                                icon: Landmark,
                                iconColor: "text-gray-900",
                                iconBgColor: "bg-gray-100",
                                trend: {
                                    value: "IN BANK ACCOUNT",
                                    isPositive: true,
                                    color: "text-gray-900"
                                }
                            },
                            {
                                title: "Pending Approval",
                                value: `₹${(stats?.pendingPayout || 0).toLocaleString('en-IN')}`,
                                icon: Clock,
                                iconColor: "text-orange-500",
                                iconBgColor: "bg-orange-50",
                                trend: {
                                    value: "AWAITING ADMIN",
                                    isPositive: true,
                                    color: "text-orange-500"
                                }
                            },
                            {
                                title: "Processing",
                                value: `₹${(stats?.processingAmount || 0).toLocaleString('en-IN')}`,
                                icon: Clock,
                                iconColor: "text-blue-600",
                                iconBgColor: "bg-blue-50",
                                trend: {
                                    value: "TRANSFER IN PROGRESS",
                                    isPositive: true,
                                    color: "text-blue-600"
                                }
                            }
                        ]}
                        columns={4}
                    />
                </div>

                {/* Inline Withdrawal Section */}
                <WithdrawSection 
                    balance={stats?.availableBalance || 0} 
                    onWithdraw={handleWithdrawal} 
                    loading={withdrawLoading}
                    merchantProfile={profileData?.profile}
                />

                {/* Transaction Table */}
                <TransactionTable transactions={transactions} isLoading={txLoading} />
        </main>
    );
}
