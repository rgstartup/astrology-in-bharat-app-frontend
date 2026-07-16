import React from "react";
import { Clock, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Transaction {
    id: string;
    info: string;
    type: string;
    amount: number;
    status: string;
    remark?: string;
    createdAt: string;
    transactionNo?: string;
    color?: 'green' | 'red';
    icon?: 'in' | 'out';
    typeLabel?: string;
    amountLabel?: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, isLoading }) => {
    return (
        <div className="bg-white rounded-[1.5rem] border-2 border-orange-600 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 space-y-1">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Transaction History</h3>
                <p className="text-sm font-medium text-gray-600">Detailed log of all credits and withdrawals</p>
            </div>

            <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest w-[30%]">Transaction Info</th>
                            <th className="px-4 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest w-[15%] text-center">Type</th>
                            <th className="px-4 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest w-[20%] text-center">Amount</th>
                            <th className="px-4 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest w-[15%] text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest w-[20%] text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-8 py-6"><div className="h-10 bg-gray-50 rounded-xl w-48" /></td>
                                    <td className="px-4 py-6 text-center"><div className="h-6 bg-gray-50 rounded-lg w-20 mx-auto" /></td>
                                    <td className="px-4 py-6 text-center"><div className="h-6 bg-gray-50 rounded-lg w-24 mx-auto" /></td>
                                    <td className="px-4 py-6 text-center"><div className="h-6 bg-gray-50 rounded-full w-24 mx-auto" /></td>
                                    <td className="px-8 py-6 text-right"><div className="h-10 bg-gray-50 rounded-lg w-32 ml-auto" /></td>
                                </tr>
                            ))
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center opacity-40">
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em]">No transactions recorded yet</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/80 transition-all duration-300 group cursor-default">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-1">
                                            <div className={cn(
                                                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                                                tx.color === 'green' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                            )}>
                                                {tx.icon === 'in' ? '↙' : '↗'}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[14px] font-bold text-gray-900 truncate group-hover:text-black transition-colors">{tx.info}</span>
                                                <span className="text-[11px] text-gray-400 font-medium truncate">{tx.transactionNo}</span>
                                            </div>
                                        </div>
                                        {tx.remark && (
                                            <div className="ml-14 mt-2">
                                                <p className="text-[10px] text-red-500 font-bold italic bg-red-50/50 px-2 py-1 rounded w-fit border border-red-100/50">
                                                    Reason: {tx.remark}
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className={cn(
                                            "inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current shadow-sm",
                                            tx.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        )}>
                                            {tx.typeLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className={cn(
                                            "text-[16px] font-black tracking-tight",
                                            tx.color === 'green' ? 'text-green-600' : 'text-gray-900'
                                        )}>
                                            {tx.amountLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[13px] font-bold text-gray-600">
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', { 
                                                    day: '2-digit', 
                                                    month: 'short', 
                                                    year: 'numeric' 
                                                })}
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-mono font-medium">
                                                {new Date(tx.createdAt).toLocaleTimeString('en-IN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: true 
                                                })}
                                            </span>
                                        </div>
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
        'PAID': { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
        'REJECTED': { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
        'FAILED': { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
    };

    const { color, bg, icon: Icon } = config[status.toUpperCase()] || config['PENDING'];

    return (
        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border border-current opacity-80", bg, color)}>
            <Icon className="w-2.5 h-2.5" />
            <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
};
