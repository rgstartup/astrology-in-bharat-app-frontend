"use client";

import React, { useState } from "react";
import { Search, ShoppingBag, Eye, Download } from "lucide-react";
import { DashboardOrder } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/Skeleton";

interface RecentOrdersProps {
  orders?: readonly DashboardOrder[];
  isLoading?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  packed: "bg-orange-100 text-orange-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const SkeletonRow = () => (
  <tr>
    <td className="py-5 px-4"><Skeleton className="h-4 w-16" /></td>
    <td className="py-5 px-4"><Skeleton className="h-4 w-32" /></td>
    <td className="py-5 px-4"><Skeleton className="h-4 w-24" /></td>
    <td className="py-5 px-4"><Skeleton className="h-4 w-20" /></td>
    <td className="py-5 px-4"><Skeleton className="h-6 w-24 rounded-full mx-auto" /></td>
  </tr>
);

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = orders.filter(
    (order: any) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.short_id && order.short_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-sm border-2 border-orange-600 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Orders</h3>
            <p className="text-sm font-medium text-gray-400 mt-0.5">Manage your latest sales</p>
          </div>
        </div>
        <div className="relative w-full sm:w-auto overflow-hidden group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 group-focus-within:text-[#fd6410] transition-colors" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3.5 bg-white border-2 border-orange-600 rounded-2xl focus:outline-none focus:ring-0 outline-none w-full sm:w-64 text-sm text-gray-800 placeholder:text-gray-500 font-medium transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Order ID</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Customer</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Date</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Amount</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map((order: any) => (
                <tr key={order.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="py-5 px-4 font-bold text-[#fd6410] tracking-tighter italic">#{order.orderNumber || order.short_id || String(order.id).slice(-8)}</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{order.customerName || `User #${order.user_id}`}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-gray-500 text-[11px] font-bold italic">
                    {new Date(order.date || order.created_at || "").toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-5 px-4 font-bold text-gray-900 tracking-tight">₹{parseFloat((order.amount || order.total_amount || 0).toString()).toLocaleString('en-IN')}</td>
                  <td className="py-5 px-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${(STATUS_STYLES as any)[order.status] || STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-300 italic">No orders found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
