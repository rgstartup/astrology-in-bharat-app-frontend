import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui";
import { Landmark, Info, AlertCircle, ChevronDown, CheckCircle2 } from "lucide-react";

interface WithdrawSectionProps {
    balance: number;
    onWithdraw: (amount: number, bankAccountId?: string) => void;
    loading: boolean;
    agent: any;
}

export const WithdrawSection: React.FC<WithdrawSectionProps> = ({
    balance,
    onWithdraw,
    loading,
    agent
}) => {
    const [amount, setAmount] = useState("");
    const [showBankList, setShowBankList] = useState(false);
    const [selectedBank, setSelectedBank] = useState<any>(null);

    const bankAccounts = agent?.bank_accounts || [];
    const hasBankDetails = bankAccounts.length > 0 || !!agent?.bank_name;

    // Initialize with primary bank
    useEffect(() => {
        if (bankAccounts.length > 0) {
            const primary = bankAccounts.find((a: any) => a.is_primary) || bankAccounts[0];
            setSelectedBank(primary);
        } else if (agent?.bank_name) {
            setSelectedBank({
                bank_name: agent.bank_name,
                account_number: agent.account_number,
                is_primary: true
            });
        }
    }, [agent, bankAccounts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 500 || numAmount > balance) return;
        onWithdraw(numAmount, selectedBank?.id);
        setAmount("");
    };

    // Debugging why button is disabled
    console.log("[WithdrawSection] Debug:", {
        amount,
        numAmount: parseFloat(amount),
        balance,
        hasBankDetails,
        loading,
        isDisabled: loading || !amount || parseFloat(amount) < 500 || parseFloat(amount) > balance || !hasBankDetails,
        reason: {
            loading,
            noAmount: !amount,
            tooLow: parseFloat(amount) < 500,
            insufficient: parseFloat(amount) > balance,
            noBank: !hasBankDetails
        }
    });


    return (
        <div className="group bg-white p-6 md:p-10 rounded-[1.5rem] shadow-sm space-y-8 relative transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1 border-2 border-[#F25E0A]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-100/50 transition-colors duration-700" />

            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl group-hover:rotate-[360deg] transition-transform duration-500">
                    <Landmark className="w-6 h-6 text-[#F25E0A]" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-1000 tracking-tight uppercase">Withdraw Funds</h3>
                    <p className="text-sm font-medium text-gray-1000">Transfer your earnings directly to your registered bank account.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-6 relative z-10 md:flex-row md:items-end">
                <div className="w-full lg:w-1/3 space-y-2.5">
                    <label className="text-[10px] font-black text-[#F25E0A] uppercase tracking-widest ml-1">Amount to Withdraw</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-1000 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full pl-10 pr-4 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-bold outline-none focus:border-[#F25E0A]/20 focus:bg-white transition-all"
                            required
                        />
                    </div>
                    <p className="text-[10px] text-gray-1000 font-medium ml-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Min. withdrawal ₹500
                    </p>
                </div>

                <div className="w-full lg:w-1/3 space-y-2.5 relative">
                    <label className="text-[10px] font-black text-[#F25E0A] uppercase tracking-widest ml-1">Select Bank Account</label>
                    {!hasBankDetails ? (
                        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-tight italic">Please add a bank account first</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowBankList(!showBankList)}
                                className="w-full flex items-center justify-between gap-3 p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-700 hover:bg-emerald-50 transition-all group/bank"
                            >
                                <div className="flex items-center gap-3">
                                    <Landmark className="w-4 h-4 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase tracking-tight">
                                            {selectedBank?.bank_name}
                                        </p>
                                        <p className="text-[9px] font-bold opacity-60">
                                            •••• {selectedBank?.account_number?.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showBankList ? 'rotate-180' : ''}`} />
                            </button>

                            {showBankList && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    {bankAccounts.length > 0 ? (
                                        bankAccounts.map((acc: any) => (
                                            <button
                                                key={acc.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBank(acc);
                                                    setShowBankList(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 ${selectedBank?.id === acc.id ? 'bg-emerald-50/30' : ''}`}
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <Landmark className={`w-4 h-4 ${selectedBank?.id === acc.id ? 'text-emerald-500' : 'text-gray-1000'}`} />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[11px] font-black uppercase text-gray-800">{acc.bank_name}</p>
                                                            {acc.is_primary && (
                                                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded border border-emerald-100">
                                                                    PRIMARY
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[9px] font-bold text-gray-1000 uppercase">•••• {acc.account_number.slice(-4)}</p>
                                                    </div>
                                                </div>
                                                {selectedBank?.id === acc.id && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center">
                                            <p className="text-[10px] font-bold text-gray-1000 uppercase">Primary Account Only</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={loading || !amount || parseFloat(amount) < 500 || parseFloat(amount) > balance || !hasBankDetails}
                        className="rounded-[1.5rem] bg-[#F25E0A] hover:bg-[#d45209] text-white font-black uppercase tracking-widest text-[12px] px-10 py-5 h-auto transition-all duration-300 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:grayscale active:scale-95 border-none"
                    >
                        {loading ? "Processing..." : "Withdraw"}
                    </Button>

                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Payout</span>
                    </div>
                </div>
            </form>
        </div>
    );
};
