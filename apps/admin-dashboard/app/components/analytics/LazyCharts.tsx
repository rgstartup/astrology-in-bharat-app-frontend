"use client";
import dynamic from "next/dynamic";
import React from "react";

// Loading skeleton
const ChartSkeleton = () => (
  <div className="h-[300px] bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-gray-400 text-sm">Loading chart...</div>
  </div>
);

// ✅ Lazy load individual chart types
export const LazyAreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false // Client-side only
  }
);

export const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);

export const LazyLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);

// Export other components normally
export { 
  Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";