import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface Transaction {
    id: string;
    info: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    remark?: string | null;
    transactionNo: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export const WalletTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    return (
        <div className="bg-white rounded-none sm:rounded-[1.5rem] border-none sm:border-solid border-gray-100 shadow-none sm:shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-gray-50 space-y-1">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Transaction History</h3>
                <p className="text-sm font-medium text-gray-400">Detailed log of all credits and withdrawals</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Info</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center opacity-40">
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em]">No transactions recorded yet</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="relative hover:bg-gray-50/80 transition-all duration-300 group cursor-default border-b border-gray-50 sm:border-none">
                                    <td className="px-4 sm:px-8 py-6 relative">
                                        {/* Left Accent Line on Hover */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F25E0A] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-1">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                                                tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {tx.type === 'credit' ? '↙' : '↗'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-gray-900 group-hover:text-black transition-colors">{tx.info}</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {tx.remark && (
                                                        <span className="text-[10px] text-red-500 font-medium italic bg-red-50/50 px-2 py-0.5 rounded w-fit">
                                                            Note: {tx.remark}
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] text-gray-400 font-medium px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                                                        #{tx.transactionNo}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current ${
                                            tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {tx.type === 'credit' ? 'Credit' : 'Debit'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`text-[15px] font-black ${
                                            tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                            {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-[12px] font-bold text-gray-500">
                                            {tx.createdAt && !isNaN(new Date(tx.createdAt).getTime()) ? 
                                                new Date(tx.createdAt).toLocaleDateString('en-IN', { 
                                                    day: '2-digit', 
                                                    month: 'short', 
                                                    year: 'numeric' 
                                                }) : 'N/A'
                                            }
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} ${color} border border-current opacity-80`}>
            <Icon className="w-2.5 h-2.5" />
            <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
};
export default WalletTable;
