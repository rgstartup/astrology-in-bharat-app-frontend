import React, { useState } from "react";
import { Landmark, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { BankAccount } from "./types";
import { toast } from "react-toastify";
import { Button } from "../../../shared/components/Button";

interface WithdrawMoneyProps {
    availableBalance: number;
    bankAccounts: BankAccount[];
    onWithdraw: (amount: number, bankAccountId: string) => void;
}

export default function WithdrawMoney({ availableBalance, bankAccounts, onWithdraw }: WithdrawMoneyProps) {
    const [amount, setAmount] = useState<string>("");
    const [selectedBankId, setSelectedBankId] = useState<string>(
        bankAccounts.find(b => b.is_primary)?.id || bankAccounts[0]?.id || ""
    );

    const handleWithdraw = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (numAmount > availableBalance) {
            toast.error("Amount exceeds available balance");
            return;
        }
        if (!selectedBankId) {
            toast.error("Please select a bank account");
            return;
        }

        onWithdraw(numAmount, selectedBankId);
        setAmount("");
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                <div className="flex-1 w-full">
                    <h2 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
                        {/* @ts-ignore */}
                        <Landmark className="w-5 h-5 text-amber-600" /> Withdraw Funds
                    </h2>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Transfer your earnings directly to your registered bank account.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1.5 ml-1">Amount to Withdraw</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter Amount"
                                    className={`w-full pl-8 pr-4 py-3 bg-gray-50 border ${parseFloat(amount) > availableBalance ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gray-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500'} rounded-2xl outline-none transition-all font-bold text-gray-800`}
                                />
                            </div>
                            <div className="mt-2 ml-1 flex flex-col gap-1">
                                {parseFloat(amount) > availableBalance && (
                                    <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                        {/* @ts-ignore */}
                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                        Insufficient Balance! You only have ₹{availableBalance.toLocaleString('en-IN')}
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                    {/* @ts-ignore */}
                                    <AlertCircle className="w-3 h-3" /> Min. withdrawal ₹500
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1.5 ml-1">Select Bank Account</label>
                            {bankAccounts.length > 0 ? (
                                <select
                                    value={selectedBankId}
                                    onChange={(e) => setSelectedBankId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                                >
                                    {bankAccounts.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.bank_name} - ••••{bank.account_number.slice(-4)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2 underline cursor-pointer">
                                    {/* @ts-ignore */}
                                    <AlertCircle className="w-4 h-4" /> Please add a bank account first
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleWithdraw}
                    disabled={!amount || bankAccounts.length === 0 || parseFloat(amount) > availableBalance}
                    variant="primary"
                    className="w-full lg:w-48 font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-200 active:scale-95 flex items-center justify-center gap-2"
                >
                    Withdraw Now <ArrowRight className="w-4 h-4" />
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-100">
                    {/* @ts-ignore */}
                    <ShieldCheck className="w-3 h-3" /> Secure Payout System
                </div>
            </div>
        </div>
    );
}
