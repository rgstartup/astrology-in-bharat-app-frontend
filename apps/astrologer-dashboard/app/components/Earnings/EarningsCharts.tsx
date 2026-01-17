import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { EarningsData, CommissionData } from "./types";

interface EarningsChartsProps {
    filteredData: EarningsData[];
    commissionData: CommissionData[];
}

const COLORS = ["#d08700", "#300c56"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
                <p className="font-semibold">{`Date: ${label}`}</p>
                <p className="text-yellow-600">{`Earnings: ₹${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export default function EarningsCharts({
    filteredData,
    commissionData,
}: EarningsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <div className="bg-white rounded-2xl shadow p-6 h-80 pb-10">
                <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="earnings"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Commission Breakdown */}
            <div className="bg-white rounded-2xl shadow p-6 h-80 flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    Commission Breakdown
                </h2>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={commissionData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            labelLine={false}
                        >
                            {commissionData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
