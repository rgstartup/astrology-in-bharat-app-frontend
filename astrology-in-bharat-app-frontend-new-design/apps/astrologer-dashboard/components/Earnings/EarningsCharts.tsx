import React from "react";
import {
    AreaChart,
    Area,
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
import { ChartDataPoint, RevenueBreakdown } from "./types";

interface EarningsChartsProps {
    incomeTrends: ChartDataPoint[];
    revenueBreakdown: RevenueBreakdown[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-3 border border-gray-100 rounded-xl shadow-xl text-sm">
                <p className="font-bold text-gray-900 mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-700 font-medium">{`Earnings: ₹${payload[0].value.toLocaleString('en-IN')}`}</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function EarningsCharts({
    incomeTrends,
    revenueBreakdown,
}: EarningsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Income Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Income Trends</h2>
                        <p className="text-sm text-gray-500">Earnings over the last 6 months</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-amber-500" /> Actual
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                            <span className="w-2 h-2 rounded-full border border-dashed border-gray-400" /> Projected
                        </span>
                    </div>
                </div>

                <div className="h-[300px] w-100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={incomeTrends}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Revenue Breakdown</h2>
                <p className="text-sm text-gray-500 mb-6">By consultation category</p>

                <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={revenueBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="amount"
                            >
                                {revenueBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Overlay for Pie Chart */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                            ₹{revenueBreakdown.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2">
                    {revenueBreakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-600">{item.category}</span>
                            </div>
                            <span className="font-bold text-gray-900">{item.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
