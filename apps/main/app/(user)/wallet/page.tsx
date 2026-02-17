"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import { toast } from "react-toastify";
import apiClient from "@/libs/api-profile";
import * as LucideIcons from "lucide-react";
import { PATHS } from "@repo/routes";

const {
    Wallet, Plus, History, CreditCard, ChevronRight, AlertCircle, TrendingUp, CheckCircle2
} = LucideIcons as any;

export default function UserWalletPage() {
    const { clientBalance, refreshBalance, isClientAuthenticated, clientLoading } = useAuthStore(); // Changed usage
    const [rechargeAmount, setRechargeAmount] = useState<number>(500);
    const [isProcessing, setIsProcessing] = useState(false);

    const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];

    const handleRecharge = async () => {
        if (rechargeAmount < 10) {
            toast.error("Minimum recharge amount is ₹10");
            return;
        }

        setIsProcessing(true);
        try {
            await apiClient.post("/wallet/topup", { amount: rechargeAmount });
            toast.success(`Successfully recharged ₹${rechargeAmount}!`);
            refreshBalance();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Recharge failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (clientLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isClientAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black p-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                    <h1 className="text-2xl font-bold">Please Login to view Wallet</h1>
                    <button
                        onClick={() => window.location.href = PATHS.SIGN_IN}
                        className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg primary-hover transition-all"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-black">
            {/* Header / Hero Section */}
            <div className="bg-[#1a1a1a] text-white pt-32 pb-40 px-4 md:px-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 opacity-5 blur-[80px] -ml-32 -mb-32"></div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                            <Wallet className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Astro-Wallet Balance</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            Available <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Funds</span>
                        </h1>
                        <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
                            Use your wallet balance to book instant consultations with India's top astrologers.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative space-y-2">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Total Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-orange-400">₹</span>
                                <span className="text-6xl font-black tabular-nums">{clientBalance?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="pt-6 flex items-center gap-2 text-green-400 text-xs font-bold">
                                <TrendingUp className="w-4 h-4" />
                                <span>No usage fees applied</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4 -mt-24 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Recharge Section */}
                    <div className="lg:col-span-12">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add Money to Wallet</h2>
                                    <p className="text-gray-400 text-sm font-medium">Select a package or enter custom amount</p>
                                </div>
                                <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[280px]">
                                    <span className="text-2xl font-black text-gray-300">₹</span>
                                    <input
                                        type="number"
                                        value={rechargeAmount}
                                        onChange={(e) => setRechargeAmount(parseInt(e.target.value) || 0)}
                                        className="bg-transparent border-none outline-none text-2xl font-black w-full"
                                        placeholder="Amount"
                                    />
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                                {rechargeOptions.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setRechargeAmount(amt)}
                                        className={`py-5 rounded-2xl font-bold flex flex-col items-center gap-1 transition-all duration-300 ${rechargeAmount === amt
                                            ? 'bg-primary text-white shadow-lg shadow-orange-200 scale-105 border-b-4 border-orange-700'
                                            : 'bg-white border border-gray-100 hover:border-orange-200 hover:bg-orange-50 text-gray-500'
                                            }`}
                                    >
                                        <span className={`text-[10px] uppercase tracking-widest ${rechargeAmount === amt ? 'text-white/70' : 'text-gray-400'}`}>Amount</span>
                                        <span className="text-xl">₹{amt}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleRecharge}
                                disabled={isProcessing}
                                className="w-full py-6 bg-[#1a1a1a] text-white rounded-[2rem] font-black text-xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <>
                                        <Plus className="w-6 h-6" />
                                        <span>RECHARGE NOW</span>
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-40">
                                <div className="flex items-center gap-2 grayscale brightness-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale brightness-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Instant Credits</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale brightness-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features / Info Cards */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center shrink-0">
                                <History className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="space-y-2 text-center md:text-left">
                                <h3 className="text-xl font-bold">Transaction History</h3>
                                <p className="text-sm text-gray-400 font-medium">Keep track of your consultations and recharges. Your history is waiting for you in the dashboard.</p>
                                <button
                                    onClick={() => window.location.href = PATHS.SESSION_HISTORY}
                                    className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all mt-4"
                                >
                                    View Session History <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-xl shadow-orange-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <CreditCard className="w-12 h-12 mb-6" />
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">If you face any issues while recharging, reach out to our dedicated support team via the help section.</p>
                        <button
                            onClick={() => window.location.href = PATHS.HELP}
                            className="bg-white text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:translate-x-1 transition-transform"
                        >
                            Get Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


