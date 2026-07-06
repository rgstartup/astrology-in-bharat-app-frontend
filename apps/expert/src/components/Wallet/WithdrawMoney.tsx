import React, { useState } from "react";
import { Landmark, ArrowRight, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { BankAccount } from "@/types/wallet";
import Button from "../ui/Button";

interface WithdrawMoneyProps {
    availableBalance: number;
    bankAccounts: BankAccount[];
    onWithdraw: (amount: number, bankAccountId: string) => void;
    isLoading?: boolean;
}

export default function WithdrawMoney({ availableBalance, bankAccounts, onWithdraw, isLoading }: WithdrawMoneyProps) {
    const [amount, setAmount] = useState<string>("");
    const [selectedBankId, setSelectedBankId] = useState<string>(
        bankAccounts.find(b => b.is_primary)?.id || bankAccounts[0]?.id || ""
    );

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 500 || numAmount > availableBalance) return;
        onWithdraw(numAmount, selectedBankId);
        setAmount("");
    };

    return (
        <div className="group bg-white p-6 sm:p-10 rounded-none sm:rounded-[1.5rem] border-none sm:border-solid border-gray-100 shadow-none sm:shadow-sm space-y-6 sm:space-y-8 relative overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] sm:hover:-translate-y-1 sm:mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-100/50 transition-colors duration-700" />
            
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl group-hover:rotate-[360deg] transition-transform duration-1000">
                    {/* @ts-ignore */}
                    <Landmark className="w-6 h-6 text-orange" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Withdraw Funds</h3>
                    <p className="text-sm font-medium text-gray-400">Transfer your earnings directly to your registered bank account.</p>
                </div>
            </div>

            <form onSubmit={handleWithdraw} className="flex flex-col lg:flex-row items-end gap-6">
                <div className="w-full lg:w-1/3 space-y-2.5">
                    <label className="text-[10px] font-black text-orange uppercase tracking-widest ml-1">Amount to Withdraw</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full pl-10 pr-4 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-bold outline-none focus:border-orange/20 focus:bg-white transition-all"
                            required
                        />
                    </div>
                    <p className="text-[10px] text-gray-300 font-medium ml-1 flex items-center gap-1">
                        {/* @ts-ignore */}
                        <Info className="w-3 h-3" /> Min. withdrawal ₹500
                    </p>
                </div>

                <div className="w-full lg:w-1/3 space-y-2.5">
                    <label className="text-[10px] font-black text-orange uppercase tracking-widest ml-1">Select Bank Account</label>
                    {bankAccounts.length === 0 ? (
                        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500">
                            {/* @ts-ignore */}
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-tight italic">Please add a bank account first</p>
                        </div>
                    ) : (
                        <select
                            value={selectedBankId}
                            onChange={(e) => setSelectedBankId(e.target.value)}
                            className="w-full px-4 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-bold outline-none focus:border-orange/20 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            {bankAccounts.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.bank_name} - ••••{bank.account_number.slice(-4)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
                    <Button
                        type="submit"
                        disabled={isLoading || !amount || bankAccounts.length === 0 || parseFloat(amount) < 500 || parseFloat(amount) > availableBalance}
                        className="whitespace-nowrap flex-1 sm:flex-none w-full sm:w-auto rounded-[1.5rem] bg-[#F25E0A] hover:bg-[#d45209] text-white font-black uppercase tracking-widest text-[12px] px-10 py-5 h-auto transition-all duration-300 shadow-lg shadow-orange/20 disabled:opacity-50 disabled:grayscale active:scale-95 border-none"
                    >
                        {isLoading ? "Processing..." : "Withdraw Now"}
                    </Button>

                    <div className="whitespace-nowrap flex-1 sm:flex-none w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                        {/* @ts-ignore */}
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">Secure Payout System</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
