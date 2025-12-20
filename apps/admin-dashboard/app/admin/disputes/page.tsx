"use client";
import React, { useState, useMemo } from "react";

// Components
import { StatsCards } from "@/app/components/admin/StatsCard";
import { DataTable } from "@/app/components/admin/DataTable";
import { DisputeModal } from "@/app/components/dispute/DisputeModal";

// Data config and types
import { disputesData, getStatsConfig, getColumns } from "@/app/components/dispute/disputesConfig";
import type { Dispute } from "@/app/components/dispute/dispute";

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const statsConfig = useMemo(() => getStatsConfig(disputesData), []);
  const columns = useMemo(() => getColumns(), []);

  return (
    <main className="space-y-6" style={{ border: "2px solid red" }}>
      {/* Page header */}
      <header style={{ border: "2px solid blue" }}>
        <h1 className="text-3xl font-bold text-gray-800">Dispute Resolution</h1>
        <p className="text-gray-600 mt-1">Manage disputes between users and experts</p>
      </header>

      {/* Stats cards */}
      <div style={{ border: "2px solid green" }}>
        <StatsCards stats={statsConfig} columns={4} />
      </div>

      {/* DataTable */}
      <div style={{ border: "2px solid orange" }}>
        <DataTable
          data={disputesData}
          columns={columns}
          searchKeys={["disputeId", "user", "expert", "subject", "category"]}
          title="All Disputes"
          itemsPerPage={10}
          onViewDetails={setSelectedDispute}
        />
      </div>

      {selectedDispute && (
        <DisputeModal dispute={selectedDispute} onClose={() => setSelectedDispute(null)} />
      )}
    </main>
  );
}