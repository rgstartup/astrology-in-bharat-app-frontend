"use client";
import React, { useState, useMemo } from "react";

// Components
import { StatsCards } from "../../../../shared/components/StatsCard";
import { DataTable } from "@/app/components/admin/DataTable";
import { DisputeModal } from "@/app/components/dispute/DisputeModal";

// Data config and types
import { disputesData, getStatsConfig, getColumns } from "@/app/components/dispute/disputesConfig";
import type { Dispute } from "@/app/components/dispute/dispute";

export default function DisputesPage() {
  // Selected dispute state (for modal display)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  // Get stats config (Total, Pending, Under Review, Completed, Resolved)
  const statsConfig = useMemo(() => getStatsConfig(disputesData), []);

  // Get table columns with custom renders (memoized)
  const columns = useMemo(() => getColumns(), []);

  return (
    <main className="space-y-6 overflow-hidden">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dispute Resolution</h1>
        <p className="text-gray-600 mt-1">Manage disputes between users and experts</p>
      </header>

      {/* Stats cards - Total, Pending, Under Review, Completed, Resolved */}
      <StatsCards stats={statsConfig} columns={4} />

      {/* Disputes table with search and pagination */}
      <DataTable
        data={disputesData}
        columns={columns}
        searchKeys={["disputeId", "user", "expert", "subject", "category"]}
        title="All Disputes"
        itemsPerPage={10}
        onViewDetails={setSelectedDispute}
      />

      {/* Dispute details modal (shows when dispute is selected) */}
      {selectedDispute && (
        <DisputeModal dispute={selectedDispute} onClose={() => setSelectedDispute(null)} />
      )}
    </main>
  );
}