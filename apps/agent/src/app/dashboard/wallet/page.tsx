"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAgentWalletBalance, getAgentWithdrawals, requestAgentWithdrawal, getAgentDashboardStats } from "@/services/agent.service";
import { useAgentAuthStore } from "@/store/useAgentAuthStore";
import { getErrorMessage } from "@repo/lib/utils/error";

// Components
import { WalletSkeleton } from "../../components/Skeleton";
import { Wallet, Landmark, Clock } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { WithdrawSection } from "./components/WithdrawSection";
import { TransactionTable } from "./components/TransactionTable";

let cachedWalletData: any = null;

export default function WalletPage() {
    const [loading, setLoading] = useState(!cachedWalletData);
    const [balance, setBalance] = useState(cachedWalletData?.balance || 0);
    const [totalWithdrawn, setTotalWithdrawn] = useState(cachedWalletData?.totalWithdrawn || 0);
    const [processing, setProcessing] = useState(cachedWalletData?.processing || 0);
    const [pendingPayout, setPendingPayout] = useState(cachedWalletData?.pendingPayout || 0);
    const [transactions, setTransactions] = useState<any[]>(cachedWalletData?.transactions || []);

    const [requestLoading, setRequestLoading] = useState(false);
    const { agent } = useAgentAuthStore() as any;

    const fetchData = async (isMounted: boolean) => {
        if (!cachedWalletData) setLoading(true);
        try {
            const [balanceRes, balanceErr] = await getAgentWalletBalance();
            const [txRes, txErr] = await getAgentWithdrawals();
            const [statsRes, statsErr] = await getAgentDashboardStats();

            if (balanceRes) setBalance(balanceRes.balance || 0);

            if (statsRes) {
                setTotalWithdrawn(statsRes.totalWithdrawn || 0);
                setProcessing(statsRes.processingWithdrawals || 0);
                setPendingPayout(statsRes.pendingPayout || 0);
            }


            if (txRes) {
                const formattedTxs = txRes.map((tx: any) => ({
                    id: tx.id || tx._id,
                    amount: tx.amount,
                    status: tx.status,
                    createdAt: tx.created_at || tx.createdAt,
                    type: tx.type || (Number(tx.amount) < 0 ? 'debit' : 'withdrawal'),
                    info: tx.description || (tx.status === 'rejected' ? 'Withdrawal (Rejected)' : 'Withdrawal Request'),
                    remark: tx.remark,
                    transactionNo: tx.withdrawal_no || tx.transaction_no

                }));


                setTransactions(formattedTxs);

                cachedWalletData = {
                    balance: balanceRes?.balance || 0,
                    totalWithdrawn: statsRes?.totalWithdrawn || 0,
                    processing: statsRes?.processingWithdrawals || 0,
                    pendingPayout: statsRes?.pendingPayout || 0,
                    transactions: formattedTxs
                };
            }
            if (!isMounted) return;
        } catch (error) {
            if (!isMounted) return;
            const msg = getErrorMessage(error).toLowerCase();
            if (!msg.includes("abort") && !msg.includes("cancel")) {
                console.error("Failed to fetch wallet data", getErrorMessage(error));
                toast.error(getErrorMessage(error) || "Failed to load wallet details");
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => { isMounted = false; };
    }, []);

    const handleWithdrawalRequest = async (amount: number, bankAccountId?: string) => {
        setRequestLoading(true);
        try {
            const [res, err] = await requestAgentWithdrawal(amount, bankAccountId);

            if (err) {
                toast.error(getErrorMessage(err) || "Failed to submit request");
            } else {

                toast.success("Withdrawal request submitted successfully!");
                setBalance((prev: number) => prev - amount);
                setPendingPayout((prev: number) => prev + amount);
                const newTx = {
                    id: Date.now().toString(),
                    amount: amount,
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    type: "withdrawal",
                    info: "Withdrawal Request",
                    remark: "",
                    transactionNo: "REQ" + Date.now().toString().slice(-6)
                };
                setTransactions((prev: any[]) => [newTx, ...prev] as any);
            }
        } catch (error) {
            toast.error(getErrorMessage(error) || "An error occurred during request");
        } finally {
            setRequestLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-transparent">
            <WalletSkeleton />
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wallet</h1>
                <p className="text-sm font-medium text-gray-1000">Manage your balance and schedule payouts to your bank account.</p>
            </div>

            {/* Top Stat Triplets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Available Balance"
                    value={balance}
                    sub="Ready to Withdraw"
                    subColor="text-green-500"
                    icon={Wallet}
                    iconBg="bg-green-50"
                    iconColor="text-green-500"
                />
                <StatCard
                    label="Total Withdrawn"
                    value={totalWithdrawn}
                    sub="In Bank Account"
                    subColor="text-primary"
                    icon={Landmark}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                />
                <StatCard
                    label="Pending Approval"
                    value={pendingPayout}
                    sub="Awaiting Admin"
                    subColor="text-amber-500"
                    icon={Clock}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-500"
                />
                <StatCard
                    label="Processing"
                    value={processing}
                    sub="Transfer in Progress"
                    subColor="text-blue-500"
                    icon={Clock}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-500"
                />
            </div>


            {/* Inline Withdrawal Section */}
            <WithdrawSection
                balance={balance}
                onWithdraw={handleWithdrawalRequest}
                loading={requestLoading}
                agent={agent}
            />

            {/* Transaction Table */}
            <TransactionTable transactions={transactions} />
        </div>
    );
}


