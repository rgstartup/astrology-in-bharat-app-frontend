"use client";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

// Components
import { StatsCards } from "../../../../shared/components/StatsCard";
import { DataTable } from "@/app/components/admin/DataTable";
import { DisputeModal } from "@/app/components/dispute/DisputeModal";

// Services
import { getDisputes, getDisputeStats } from "@/src/services/admin.service";

// Data config and types
import { getStatsConfig, getColumns } from "@/app/components/dispute/disputesConfig";
import type { Dispute } from "@/app/components/dispute/dispute";

export default function DisputesPage() {
  // State
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    rejected: 0,
  });

  // Fetch disputes from backend
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await getDisputes();

      // Handle different response structures
      const disputesData = response.data || response.disputes || response || [];
      setDisputes(disputesData);
    } catch (error: any) {
      console.error("Error fetching disputes:", error);
      toast.error("Failed to load disputes");
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await getDisputeStats();
      setStats(response);
    } catch (error: any) {
      console.error("Error fetching dispute stats:", error);
      // Use calculated stats from disputes as fallback
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchDisputes();
    fetchStats();
  }, []);

  // Get stats config (Total, Pending, Under Review, Resolved)
  const statsConfig = useMemo(() => getStatsConfig(disputes, stats), [disputes, stats]);

  // Get table columns with custom renders (memoized)
  const columns = useMemo(() => getColumns(), []);

  return (
    <main className="space-y-6 overflow-hidden">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dispute Resolution</h1>
        <p className="text-gray-600 mt-1">Manage user-reported issues and complaints</p>
      </header>

      {/* Stats cards - Total, Pending, Under Review, Resolved */}
      <StatsCards stats={statsConfig} columns={4} />

      {/* Disputes table with search and pagination */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <DataTable
          data={disputes}
          columns={columns}
          searchKeys={["disputeId", "user", "expert", "subject", "category"]}
          title="All Disputes"
          itemsPerPage={10}
          onViewDetails={setSelectedDispute}
        />
      )}

      {/* Dispute details modal (shows when dispute is selected) */}
      {selectedDispute && (
        <DisputeModal
          dispute={selectedDispute}
          onClose={() => {
            setSelectedDispute(null);
            fetchDisputes(); // Refresh data after closing modal
            fetchStats();
          }}
        />
      )}
    </main>
  );
}