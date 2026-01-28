import React from "react";
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle, Landmark } from "lucide-react";
import { WalletTransaction } from "./types";

interface WalletTableProps {
    transactions: WalletTransaction[];
}

export default function WalletTable({ transactions }: WalletTableProps) {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'failed': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'processing': return <Clock className="w-3 h-3 animate-pulse" />;
            case 'failed': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-gray-900">Transaction History</h2>
                    <p className="text-xs text-gray-400 font-medium">Detailed log of all credits and withdrawals</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Info</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{tx.description}</p>
                                            {tx.bankAccount && (
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Bank: {tx.bankAccount}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${tx.type === 'credit' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-800'}`}>
                                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(tx.status)}`}>
                                        <StatusIcon status={tx.status} />
                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-gray-500">
                                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/20">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <ArrowUpRight className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-bold">No transactions found</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                <button className="text-amber-600 text-xs font-black uppercase tracking-widest hover:text-amber-700 transition-colors">
                    Load More Transactions
                </button>
            </div>
        </div>
    );
}
