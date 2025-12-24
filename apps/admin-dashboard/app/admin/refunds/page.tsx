// refund-management/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { Button } from "@/app/components/admin/Button";
import { Download, Filter, RefreshCw } from "lucide-react";

// Components
import { RefundFilters } from "@/app/components/Refund/RefundFilters";
import { RefundStats } from "@/app/components/Refund/RefundStats";
import { RefundCard } from "@/app/components/Refund/RefundCard";
import { EmptyRefunds } from "@/app/components/Refund/EmptyRefunds";

// Config
import { mockRefunds, filters } from "@/app/components/Refund/refundsConfig";
type RefundRequest = typeof mockRefunds[number];

export default function RefundManagementPage() {
  const [refunds] = useState<RefundRequest[]>(mockRefunds);
  const [activeFilter, setActiveFilter] = useState("all");

  // Calculate stats
  const stats = useMemo(() => {
    const total = refunds.length;
    const pending = refunds.filter(r => r.status === "pending").length;
    const approved = refunds.filter(r => r.status === "approved").length;
    const totalAmount = refunds.reduce((sum, r) => sum + r.requestedAmount, 0);
    
    return [
      {
        title: "Total Refunds",
        value: total.toString(),
        icon: RefreshCw,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "+8%", isPositive: false, period: "this month" }
      },
      // ... add more stats
    ];
  }, [refunds]);

  // Filter refunds
  const filteredRefunds = useMemo(() => {
    if (activeFilter === "all") return refunds;
    if (["pending", "approved", "rejected", "processing"].includes(activeFilter)) {
      return refunds.filter(r => r.status === activeFilter);
    }
    return refunds.filter(r => r.priority === activeFilter);
  }, [refunds, activeFilter]);

  // Handlers
  const handleApprove = (id: string) => {
    alert(`Approving refund ${id}`);
  };

  const handleReject = (id: string) => {
    alert(`Rejecting refund ${id}`);
  };

  const handleViewDetails = (refund: RefundRequest) => {
    alert(`Viewing details for ${refund.id}`);
  };

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-gray-600 mt-1">Manage and process refund requests from users</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download}>
            Export Report
          </Button>
          <Button variant="primary">Process Bulk</Button>
        </div>
      </div>

      {/* Stats */}
      <RefundStats stats={stats} />

      {/* Filters */}
      <RefundFilters 
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Refunds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRefunds.length === 0 ? (
          <EmptyRefunds />
        ) : (
          filteredRefunds.map((refund) => (
            <RefundCard
              key={refund.id}
              refund={refund}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>
    </main>
  );
}