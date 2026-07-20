import React from "react";
import { Button } from "@repo/ui";
import { Wallet, ArrowUpRight, TrendingUp, ShieldCheck } from "lucide-react";

interface WalletBalanceCardProps {
    balance: number;
    onWithdrawClick: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance, onWithdrawClick }) => {
    return (
        <div className="bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(242,94,10,0.1)] border border-gray-100 overflow-hidden relative">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F25E0A]/10 to-transparent" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#F25E0A]/5 rounded-full blur-[80px]" />
            
            <div className="p-10 md:p-14 relative flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-gray-900 flex items-center justify-center text-white shadow-2xl shadow-black/20 group hover:scale-105 transition-transform duration-500">
                        <Wallet className="w-10 h-10 text-[#F25E0A]" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[12px] font-black text-gray-1000 uppercase tracking-[0.4em]">Current Liquidity</p>
                        <h1 className="text-7xl font-black text-gray-900 tracking-tighter flex items-start gap-2">
                            <span className="text-3xl text-[#F25E0A] mt-2">₹</span>
                            {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h1>
                        <div className="flex items-center gap-3 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Available for immediate settlement</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6">
                    <Button
                        onClick={onWithdrawClick}
                        className="rounded-2xl shadow-2xl shadow-[#F25E0A]/30 font-black uppercase tracking-[0.25em] text-[11px] bg-[#F25E0A] hover:bg-[#D94E00] border-none px-12 py-8 h-auto transition-all hover:scale-105 active:scale-95 group"
                    >
                        <span className="flex items-center gap-3">
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Request Payout
                        </span>
                    </Button>
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                        <ShieldCheck className="w-4 h-4 text-[#F25E0A]" />
                        <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest">Bank Verified Account</span>
                    </div>
                </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-gray-50/50 border-t border-gray-100 px-14 py-6 flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F25E0A]" />
                    <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest">Min. Payout: ₹500</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest">T+1 Settlement Cycle</span>
                </div>
            </div>
        </div>
    );
};
