import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui";
import { Landmark, Info, AlertCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WithdrawSectionProps {
    balance: number;
    onWithdraw: (amount: number, bankAccountId?: string) => void;
    loading: boolean;
    merchantProfile: any;
}

export const WithdrawSection: React.FC<WithdrawSectionProps> = ({ 
    balance, 
    onWithdraw, 
    loading,
    merchantProfile
}) => {
    const [amount, setAmount] = useState("");
    const [showBankList, setShowBankList] = useState(false);
    const [selectedBank, setSelectedBank] = useState<any>(null);

    // Get all accounts (new array or legacy single fields)
    const accounts = React.useMemo(() => {
        if (merchantProfile?.bank_accounts && Array.isArray(merchantProfile.bank_accounts) && merchantProfile.bank_accounts.length > 0) {
            return merchantProfile.bank_accounts;
        } else if (merchantProfile?.bankName || merchantProfile?.accountNumber) {
            return [{
                id: 'legacy',
                bank_name: merchantProfile.bankName,
                account_number: merchantProfile.accountNumber,
                ifsc_code: merchantProfile.ifsc,
                account_holder: merchantProfile.accountHolder || 'Merchant',
                is_primary: true
            }];
        }
        return [];
    }, [merchantProfile]);

    const hasBankDetails = accounts.length > 0;

    useEffect(() => {
        if (accounts.length > 0 && !selectedBank) {
            const primary = accounts.find((a: any) => a.is_primary) || accounts[0];
            setSelectedBank(primary);
        }
    }, [accounts, selectedBank]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 500 || numAmount > balance) return;
        onWithdraw(numAmount, selectedBank?.id);
        setAmount("");
    };

    return (
        <div className="group bg-white p-10 rounded-[1.5rem] border-2 border-orange-600 shadow-sm space-y-8 relative transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-100/50 transition-colors duration-700" />
            
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl group-hover:rotate-[360deg] transition-transform duration-1000">
                    <Landmark className="w-6 h-6 text-[#fd6410]" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Withdraw Funds</h3>
                    <p className="text-sm font-medium text-gray-600">Transfer your shop earnings directly to your registered bank account.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-end gap-6 relative z-10">
                <div className="flex-1 w-full space-y-2.5 relative">
                    <label className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest ml-1">Amount to Withdraw</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full h-16 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-bold outline-none focus:border-[#fd6410]/20 focus:bg-white transition-all"
                            required
                        />
                    </div>
                    <p className="absolute -bottom-5 text-[11px] text-gray-700 font-black tracking-tight ml-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-gray-500" /> Min. withdrawal ₹500
                    </p>
                </div>

                <div className="flex-1 w-full space-y-2.5 relative">
                    <label className="text-[10px] font-black text-[#fd6410] uppercase tracking-widest ml-1">Select Bank Account</label>
                    {!hasBankDetails ? (
                        <div className="flex items-center gap-3 px-5 h-16 bg-red-50 border border-red-100 rounded-2xl text-red-500">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-tight italic">Please add a bank account first</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setShowBankList(!showBankList)}
                                className="w-full flex items-center justify-between gap-3 px-5 h-16 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-700 hover:bg-emerald-50 transition-all group/bank"
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
                                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showBankList ? 'rotate-180' : '')} />
                            </button>

                            {showBankList && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Account</p>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto no-scrollbar">
                                        {accounts.map((acc: any) => (
                                            <button
                                                key={acc.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBank(acc);
                                                    setShowBankList(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0",
                                                    selectedBank?.id === acc.id ? "bg-emerald-50/30" : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Landmark className={cn("w-4 h-4", selectedBank?.id === acc.id ? "text-emerald-600" : "text-gray-400")} />
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-black uppercase text-gray-900">{acc.bank_name}</p>
                                                        <p className="text-[9px] font-bold text-gray-400">•••• {acc.account_number.slice(-4)}</p>
                                                    </div>
                                                </div>
                                                {selectedBank?.id === acc.id && (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full space-y-2.5">
                    <label className="text-[10px] font-black opacity-0 uppercase tracking-widest ml-1 block select-none pointer-events-none">Action</label>
                    <div className="w-full">
                        <Button
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) < 500 || parseFloat(amount) > balance || !hasBankDetails}
                            className="w-full h-16 rounded-[1.5rem] bg-[#fd6410] hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[12px] px-10 transition-all duration-300 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:grayscale active:scale-95 border-none"
                        >
                            {loading ? "Processing..." : "Withdraw Now"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
