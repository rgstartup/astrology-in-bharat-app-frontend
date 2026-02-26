import React from "react";
import { cn } from "@/utils/cn";
import { PayoutItem } from "./types";

interface WithdrawalHistoryProps {
    payoutHistory: PayoutItem[];
}

export default function WithdrawalHistory({
    payoutHistory,
}: WithdrawalHistoryProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-200">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-wide">
                Withdrawal History
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wider">
                            <th className="p-5 font-semibold rounded-tl-lg">Date</th>
                            <th className="p-5 font-semibold">Amount</th>
                            <th className="p-5 font-semibold rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payoutHistory.map((row, i) => (
                            <tr
                                key={i}
                                className="hover:bg-gray-50 transition-colors duration-300"
                            >
                                <td className="p-5 text-sm text-gray-800 font-medium  rounded-l-lg">
                                    {row.date}
                                </td>
                                <td className="p-5 text-sm text-gray-700 ">{row.amount}</td>
                                <td className="p-5 text-sm font-semibold rounded-r-lg ">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset",
                                            row.status === "Processed"
                                                ? "bg-green-50 text-green-700 ring-green-600"
                                                : row.status === "Pending"
                                                    ? "bg-yellow-50 text-yellow-700 ring-yellow-600"
                                                    : "bg-red-50 text-red-700 ring-red-600"
                                        )}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Request Withdrawal Button */}
            <div className="mt-10 flex justify-end">
                <button
                    className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-700 focus:outline-none focus:ring-4  focus:ring-opacity-50 transform transition-all duration-300 "
                    type="button"
                    aria-label="Request Withdrawal"
                >
                    Request Withdrawal
                </button>
            </div>
        </div>
    );
}


