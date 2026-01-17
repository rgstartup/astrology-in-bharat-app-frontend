"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface UserGrowthChartProps {
  data: any[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
        <p className="text-sm text-gray-500">New vs Returning users</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="new" fill="#3b82f6" radius={[8, 8, 0, 0]} name="New Users" />
          <Bar
            dataKey="returning"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="Returning Users"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}