"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

const defaultData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

interface SalesChartProps {
  data?: { date: string; sales: number }[];
  isLoading?: boolean;
}

function formatDate(date: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function SalesChart({ data, isLoading }: SalesChartProps) {
  const chartData = React.useMemo(() => {
    if (isLoading) return [];
    
    // Generate last 7 days keys
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        days.push(formatDate(d));
    }

    if (!data || data.length === 0) {
        return days.map(day => ({ name: day, sales: 0 }));
    }

    return days.map(day => {
        const found = data.find(d => d.date === day);
        return { name: day, sales: found ? Number(found.sales) : 0 };
    });
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 h-[450px] flex flex-col">
         <div className="flex items-center justify-between mb-10">
            <div className="space-y-3">
               <Skeleton className="h-8 w-48" />
               <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-12 w-40 rounded-2xl" />
         </div>
         <Skeleton className="flex-1 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-5 sm:p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border-2 border-orange-600 flex flex-col h-[450px]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Earning Analytics</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Last 7 days performance</p>
        </div>
        <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#fd6410]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">Daily Revenue</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fd6410" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fd6410" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '900'
              }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
              cursor={{ stroke: '#fd6410', strokeWidth: 2, strokeDasharray: '6 6' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#fd6410"
              strokeWidth={5}
              fillOpacity={1}
              fill="url(#colorSales)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
