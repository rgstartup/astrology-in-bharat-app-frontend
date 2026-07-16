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
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LabelList
} from "recharts";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";

const COLORS = [
  "#fd6410", // Primary Orange
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#6366f1", // Indigo (again, maybe purple)
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#ef4444", // Red
];

function formatDate(date: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// 1. Long term Earning Chart
export function RevenueChart({ data }: { data: any[] }) {
  const chartData = React.useMemo(() => {
    // Generate last 30 days
    const days = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        days.push(formatDate(d));
    }

    if (!data || data.length === 0) {
        return days.map(day => ({ date: day, revenue: 0 }));
    }

    return days.map(day => {
        const found = data.find(d => d.date === day);
        return { date: day, revenue: found ? Number(found.revenue) : 0 };
    });
  }, [data]);

  const totalRevenue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [chartData]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 p-6 md:p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[400px] md:h-[450px] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="flex flex-row justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Revenue Timeline</h3>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mt-2">Last 30 Days Growth</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-[#fd6410] tracking-tight">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Revenue</p>
        </div>
      </div>
      <div className="flex-1 w-full relative min-h-[250px] z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fd6410" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fd6410" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} dy={15} interval={4} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', fontSize: '14px', fontWeight: '700' }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#fd6410" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { Legend } from "recharts";

// 2. Product Share (Pie Chart)
export function ProductShareChart({ data }: { data: any[] }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [{ name: 'No Data', sales: 1, percentage: 0 }];
    return data;
  }, [data]);

  const totalSales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.sales || 0), 0);
  }, [chartData]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 p-6 md:p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[450px] md:h-[450px] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="mb-8 relative z-10">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Sales Distribution</h3>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">By Product Category</p>
      </div>
      <div className="flex-1 w-full relative z-10">
        {/* Center Text Over the Donut Hole */}
        <div 
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{ 
            top: isMobile ? '40%' : '50%', 
            left: isMobile ? '50%' : '40%', 
            transform: 'translate(-50%, -50%)' 
          }}
        >
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total</span>
          <span className="text-3xl font-black text-gray-900 leading-none mt-1">{totalSales}</span>
        </div>

        <ResponsiveContainer width="100%" height={isMobile ? 350 : "100%"}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: isMobile ? 40 : 0 }}>
            <Pie
              data={chartData}
              cx={isMobile ? "50%" : "40%"}
              cy={isMobile ? "40%" : "50%"}
              innerRadius={isMobile ? 65 : 75}
              outerRadius={isMobile ? 95 : 110}
              paddingAngle={10}
              cornerRadius={20}
              dataKey="sales"
              nameKey="name"
              stroke="none"
              style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.08))' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', fontSize: '12px', fontWeight: '700' }}
            />
            <Legend 
              layout={isMobile ? "horizontal" : "vertical"} 
              align={isMobile ? "center" : "right"} 
              verticalAlign={isMobile ? "bottom" : "middle"} 
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span className="text-[11px] font-bold uppercase text-gray-700 tracking-wider ml-2">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 3. Stock Level (Bar Chart)
export function StockChart({ data }: { data: any[] }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 min-h-[500px] flex flex-col">
      <div className="mb-8 md:mb-10">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Catalog Inventory Health</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Real-time stock monitoring</p>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 40)}>
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 0, right: isMobile ? 60 : 80, left: isMobile ? -20 : 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" axisLine={false} tickLine={false} hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                width={isMobile ? 100 : 150}
                interval={0}
            />
            <Tooltip 
                 cursor={{fill: '#fff1f0'}}
                 contentStyle={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '700' }}
            />
            <Bar dataKey="stock" radius={[0, 15, 15, 0]} barSize={isMobile ? 18 : 25} animationDuration={2500}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList 
                dataKey="stock" 
                position="right" 
                style={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                formatter={(value: any) => `${value} units`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
