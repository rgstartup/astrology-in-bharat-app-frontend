import React, { useState } from "react";
import { Button } from "@repo/ui";
import { X, ArrowUpRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
    balance: number;
    loading: boolean;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    balance,
    loading 
}) => {
    const [amount, setAmount] = useState("");
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 500) return;
        onSubmit(numAmount);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-gray-100 relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F25E0A]">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <h2 className="text-[18px] font-black text-gray-900 uppercase tracking-[0.1em]">Request Payout</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-1000 hover:text-gray-900"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[10px] font-black text-gray-1000 uppercase tracking-[0.4em]">Withdrawal Amount</label>
                                <span className="text-[10px] font-bold text-gray-1000">Available: ₹{balance.toLocaleString()}</span>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300 group-focus-within:text-[#F25E0A] transition-colors">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-16 pr-10 py-8 bg-gray-50 border-2 border-transparent focus:border-[#F25E0A]/10 focus:bg-white rounded-[2rem] text-4xl font-black text-gray-900 tracking-tighter outline-none transition-all placeholder:text-gray-200"
                                    required
                                    min="500"
                                    max={balance}
                                />
                            </div>
                            
                            {parseFloat(amount) < 500 && amount !== "" && (
                                <div className="flex items-center gap-3 text-red-500 px-4">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Minimum withdrawal amount is ₹500</span>
                                </div>
                            )}

                            {parseFloat(amount) > balance && (
                                <div className="flex items-center gap-3 text-red-500 px-4">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Insufficient wallet balance</span>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 space-y-4">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-gray-1000 font-bold leading-relaxed">
                                    Funds will be deposited to your <span className="text-gray-900">Registered Bank Account</span> within 24-48 working hours.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) < 500 || parseFloat(amount) > balance}
                            className="w-full rounded-[1.5rem] bg-[#F25E0A] hover:bg-[#D94E00] shadow-2xl shadow-[#F25E0A]/30 border-none py-8 text-[12px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Confirm & Send Request"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
