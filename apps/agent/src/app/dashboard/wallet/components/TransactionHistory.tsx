import React from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    type: 'earning' | 'withdrawal';
    remark?: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    return (
        <div className="bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="space-y-1">
                    <h3 className="text-[15px] font-black text-gray-900 uppercase tracking-[0.2em]">Settlement Ledger</h3>
                    <p className="text-[10px] font-bold text-gray-1000 uppercase tracking-widest">Recent Financial Activity</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-5 py-2 bg-white rounded-xl border border-gray-200 text-[10px] font-black text-gray-1000 uppercase tracking-widest">All Types</span>
                </div>
            </div>

            <div className="flex-grow overflow-auto max-h-[600px]">
                {transactions.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                            <Clock className="w-8 h-8" />
                        </div>
                        <p className="text-[12px] font-black uppercase tracking-[0.3em]">No transactions recorded yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                                            tx.type === 'earning' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#F25E0A]'
                                        }`}>
                                            {tx.type === 'earning' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[13px] font-black text-gray-900 uppercase tracking-tight">
                                                {tx.type === 'earning' ? 'Commission Settlement' : 'Withdrawal Request'}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-1000 uppercase tracking-[0.1em]">
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', { 
                                                    day: '2-digit', 
                                                    month: 'short', 
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className={`text-[20px] font-black tracking-tighter ${
                                            tx.type === 'earning' ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                            {tx.type === 'earning' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                        </p>
                                        <StatusBadge status={tx.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        'PENDING': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
        'PROCESSING': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
        'SUCCESS': { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
        'COMPLETED': { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
        'REJECTED': { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
        'FAILED': { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
    };

    const { color, bg, icon: Icon } = config[status.toUpperCase()] || config['PENDING'];

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bg} ${color} border border-current opacity-80`}>
            <Icon className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
};
