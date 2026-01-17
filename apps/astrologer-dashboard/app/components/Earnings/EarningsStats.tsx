import React from "react";

interface EarningsStatsProps {
    totalEarnings: number;
    currentBalance: number;
    averageEarnings: number;
}

export default function EarningsStats({
    totalEarnings,
    currentBalance,
    averageEarnings,
}: EarningsStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-gray-500">
                    Total Earnings (This Period)
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    ₹{totalEarnings.toLocaleString()}
                </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    ₹{currentBalance.toLocaleString()}
                </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-500">
                    Average Session Earnings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    ₹{averageEarnings.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
