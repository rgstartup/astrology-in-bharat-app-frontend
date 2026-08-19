"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StatsCards } from "@repo/ui";
import { PayoutSkeleton } from "../../components/Skeleton";
import type { StatConfig } from "@repo/ui";
import { 
    Wallet, 
    ArrowUpCircle, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    IndianRupee,
    ArrowRight,
    RefreshCw,
    TrendingUp
} from "lucide-react";
import { toast } from "react-toastify";
import { 
    getAgentWalletBalance, 
    getAgentWithdrawals, 
    requestAgentWithdrawal,
    getAgentProfile,
    settleAgentCommissions,
    getAgentDashboardStats
} from "@/services/agent.service";
import { getErrorMessage } from "@repo/lib";

interface PayoutRequest {
    id: string;
    amount: number;
    status: "pending" | "completed" | "rejected" | "failed" | "cancelled";
    created_at: string;
    remark?: string;
    merchant_bank_name?: string;
    merchant_account_number?: string;
}

const STATUS_COLOR: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
};

const MIN_PAYOUT = 100;

let cachedPayoutData: any = null;

export default function PayoutPage() {
    const [balance, setBalance] = useState<number>(cachedPayoutData?.balance || 0);
    const [totalEarned, setTotalEarned] = useState<number>(cachedPayoutData?.totalEarned || 0);
    const [withdrawals, setWithdrawals] = useState<PayoutRequest[]>(cachedPayoutData?.withdrawals || []);
    const [profile, setProfile] = useState<any>(cachedPayoutData?.profile || null);
    const [loading, setLoading] = useState(!cachedPayoutData);
    const [submitting, setSubmitting] = useState(false);
    const [settling, setSettling] = useState(false);
    const [amount, setAmount] = useState<string>("");

    const fetchData = async () => {
        if (!cachedPayoutData) setLoading(true);
        try {
            const [
                [balData, balErr],
                [wdData, wdErr],
                [profData, profErr],
                [statsData, statsErr]
            ] = await Promise.all([
                getAgentWalletBalance(),
                getAgentWithdrawals(),
                getAgentProfile(),
                getAgentDashboardStats()
            ]);

            if (balErr) toast.error(getErrorMessage(balErr) || "Failed to load balance");
            if (wdErr) toast.error(getErrorMessage(wdErr) || "Failed to load payouts");
            
            if (balData) setBalance(Number(balData.balance || 0));
            if (wdData) setWithdrawals(wdData);
            if (profData) setProfile(profData);
            if (statsData) setTotalEarned(Number(statsData.commissionEarned || 0));
            
            cachedPayoutData = {
                balance: Number(balData?.balance || 0),
                totalEarned: Number(statsData?.commissionEarned || 0),
                withdrawals: wdData || [],
                profile: profData || null
            };
        } catch (error) {
            console.error("Error fetching payout data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const unclaimedAmount = useMemo(() => {
        const totalAlreadyPaidOut = balance + 
            withdrawals.filter(w => w.status === 'completed' || w.status === 'pending').reduce((sum, w) => sum + Number(w.amount), 0);
        return Math.max(0, totalEarned - totalAlreadyPaidOut);
    }, [balance, withdrawals, totalEarned]);

    const stats: StatConfig[] = useMemo(() => {
        const totalWithdrawn = withdrawals
            .filter(w => w.status === "completed")
            .reduce((sum, w) => sum + Number(w.amount), 0);
        
        const pendingPayout = withdrawals
            .filter(w => w.status === "pending")
            .reduce((sum, w) => sum + Number(w.amount), 0);

        return [
            { 
                title: "Available to Withdraw", 
                value: `₹${balance.toLocaleString("en-IN")}`, 
                icon: IndianRupee, 
                iconColor: "text-emerald-600", 
                iconBgColor: "bg-emerald-100", 
                valueColor: "text-emerald-700" 
            },
            { 
                title: "Total Earnings", 
                value: `₹${totalEarned.toLocaleString("en-IN")}`, 
                icon: TrendingUp, 
                iconColor: "text-blue-600", 
                iconBgColor: "bg-blue-100", 
                valueColor: "text-blue-700" 
            },
            { 
                title: "Pending Payout", 
                value: `₹${pendingPayout.toLocaleString("en-IN")}`, 
                icon: Clock, 
                iconColor: "text-orange-600", 
                iconBgColor: "bg-orange-100", 
                valueColor: "text-orange-700" 
            },
            { 
                title: "Total Withdrawn", 
                value: `₹${totalWithdrawn.toLocaleString("en-IN")}`, 
                icon: CheckCircle, 
                iconColor: "text-purple-600", 
                iconBgColor: "bg-purple-100", 
                valueColor: "text-purple-700" 
            },
        ];
    }, [balance, withdrawals, totalEarned]);

    const handleSettleCommissions = async () => {
        setSettling(true);
        try {
            const [res, err] = await settleAgentCommissions();
            if (err) {
                toast.error(getErrorMessage(err) || "Settlement failed");
            } else {
                toast.success(res.message || "Earnings settled into wallet");
                setBalance(prev => prev + unclaimedAmount);
            }
        } catch (error) {
            toast.error(getErrorMessage(error) || "An error occurred during settlement");
        } finally {
            setSettling(false);
        }
    };

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(amount);
        
        if (isNaN(amt) || amt < MIN_PAYOUT) {
            toast.error(`Minimum payout amount is ₹${MIN_PAYOUT}`);
            return;
        }

        if (amt > balance) {
            toast.error("Insufficient available balance");
            return;
        }

        if (!profile?.bank_name || !profile?.account_number) {
            toast.error("Please update your bank details in profile first");
            return;
        }

        setSubmitting(true);
        try {
            const [res, err] = await requestAgentWithdrawal(amt);
            if (err) {
                toast.error(getErrorMessage(err) || "Failed to request payout");
            } else {
                toast.success("Payout request submitted successfully");
                setBalance(prev => prev - amt);
                const newWithdrawal: PayoutRequest = {
                    id: Date.now().toString(),
                    amount: amt,
                    status: "pending",
                    created_at: new Date().toISOString(),
                    merchant_bank_name: profile?.bank_name,
                    merchant_account_number: profile?.account_number
                };
                setWithdrawals(prev => [newWithdrawal, ...prev]);
                setAmount("");
                
                cachedPayoutData = {
                    balance: balance - amt,
                    totalEarned: totalEarned,
                    withdrawals: [newWithdrawal, ...withdrawals],
                    profile: profile
                };
            }
        } catch (error) {
            toast.error(getErrorMessage(error) || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <PayoutSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Stats Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                    <StatsCards stats={stats} columns={4} />
                </div>
            </div>

            {unclaimedAmount > 10 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <RefreshCw className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                                <TrendingUp className="w-8 h-8" />
                                Unsettled Earnings Ready!
                            </h2>
                            <p className="text-white/80 font-medium">
                                You have <span className="text-white font-black text-xl">₹{unclaimedAmount.toLocaleString("en-IN")}</span> in accrued commissions that can be moved to your withdrawable balance.
                            </p>
                        </div>
                        <button
                            onClick={handleSettleCommissions}
                            disabled={settling}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg active:scale-95 ${
                                settling 
                                    ? "bg-white/20 text-white cursor-not-allowed" 
                                    : "bg-white text-blue-700 hover:bg-blue-50 hover:shadow-white/20"
                            }`}
                        >
                            {settling ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            {settling ? "Settling..." : "Claim & Add to Wallet"}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Payout Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden sticky top-24">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                <ArrowUpCircle className="w-5 h-5 text-primary" />
                                Initiate Payout
                            </h3>
                            <p className="text-gray-1000 text-[10px] mt-1 font-bold uppercase tracking-tight">Withdraw to Bank Account</p>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleRequestPayout} className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] font-black text-gray-1000 uppercase tracking-widest">
                                            Amount
                                        </label>
                                        <span className="text-[10px] font-bold text-primary">Available: ₹{balance.toFixed(2)}</span>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-1000 font-black">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={`Min. ${MIN_PAYOUT}`}
                                            className="block w-full pl-10 pr-12 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl text-gray-900 font-black text-lg focus:bg-white focus:border-primary/20 focus:ring-0 transition-all placeholder:text-gray-300 group-hover:bg-gray-100/50"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <button 
                                                type="button"
                                                onClick={() => setAmount(balance.toFixed(0))}
                                                className="text-[10px] font-black text-primary uppercase hover:bg-primary/5 px-2 py-1 rounded-lg"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-[10px] text-gray-1000 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                                        <AlertCircle className="w-3.3 h-3.3" />
                                        Processed within 24-48 hours
                                    </p>
                                </div>

                                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 -mr-2 -mt-2 group-hover:rotate-12 transition-transform">
                                        < IndianRupee className="w-12 h-12" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Target Bank Account</h4>
                                    {profile?.bank_name ? (
                                        <div className="space-y-1.5 relative z-10">
                                            <p className="text-sm font-black text-gray-900">{profile.bank_name}</p>
                                            <p className="text-xs text-gray-1000 font-bold tracking-wider">A/C: {profile.account_number.replace(/.(?=.{4})/g, '*')}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-gray-100 text-gray-1000 font-black uppercase tracking-widest">{profile.ifsc_code}</span>
                                                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-2 relative z-10">
                                            <p className="text-xs text-red-500 font-bold mb-3">No bank details added</p>
                                            <button 
                                                type="button"
                                                onClick={() => window.location.href = '/dashboard/profile'}
                                                className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors"
                                            >
                                                Add Details in Profile
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || balance < MIN_PAYOUT}
                                    className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.97] ${
                                        submitting || balance < MIN_PAYOUT
                                            ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                                            : "bg-primary text-white hover:bg-primary-hover hover:shadow-primary/30"
                                    }`}
                                >
                                    {submitting ? "Initiating..." : balance < MIN_PAYOUT ? `Min ₹${MIN_PAYOUT} required` : "Withdraw Now"}
                                    {!submitting && balance >= MIN_PAYOUT && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Payout History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-300" />
                                Payout History
                            </h3>
                            <div className="flex gap-2">
                                {["all", "pending", "completed"].map(f => (
                                    <span key={f} className="text-[9px] font-black uppercase tracking-widest text-gray-1000 hover:text-primary cursor-pointer transition-colors px-2 py-1 rounded-md bg-white border border-gray-100">{f}</span>
                                ))}
                            </div>
                        </div>

                        {withdrawals.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100/50">
                                    <IndianRupee className="w-12 h-12 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">No History Yet</h3>
                                <p className="text-gray-1000 text-xs max-w-xs mx-auto mt-2 font-medium">
                                    Your future payout requests will appear here with detailed status tracking.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/30">
                                            {["Transaction Date", "Payout Amount", "Status"].map((h) => (
                                                <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-gray-1000 uppercase tracking-widest border-b border-gray-50">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {withdrawals.map((w) => (
                                            <tr key={w.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                                            <Clock className="w-5 h-5 text-gray-300" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-sm">
                                                                {new Date(w.created_at).toLocaleDateString("en-IN", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric"
                                                                })}
                                                            </p>
                                                            <p className="text-[10px] text-gray-1000 font-black uppercase tracking-widest mt-0.5">
                                                                {new Date(w.created_at).toLocaleTimeString("en-IN", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-black text-gray-900">
                                                            ₹{Number(w.amount).toLocaleString("en-IN")}
                                                        </span>
                                                        <span className="text-[9px] text-gray-1000 font-bold uppercase tracking-tight mt-0.5">
                                                            TO: {w.merchant_bank_name || 'REGISTER_ACC'} ({w.merchant_account_number?.slice(-4).padStart(8, '•')})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit shadow-sm ${STATUS_COLOR[w.status] || "bg-gray-100"}`}>
                                                            {w.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                                            {w.status === 'pending' && <Clock className="w-3 h-3" />}
                                                            {(w.status === 'rejected' || w.status === 'failed') && <XCircle className="w-3 h-3" />}
                                                            {w.status}
                                                        </span>
                                                        {w.remark && (
                                                            <p className="text-[10px] text-gray-1000 font-bold italic max-w-[180px] leading-tight" title={w.remark}>
                                                                {w.remark}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

