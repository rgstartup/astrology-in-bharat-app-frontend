"use client";
import React, { useState, useMemo, lazy, Suspense } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@/app/components/admin/StatsCard";

// Data config and types
import { expertsData, getStatsConfig, getColumns } from "@/app/components/expert/expertsConfig";
import { getProfileModalProps } from "@/app/components/expert/expertsModalConfig";
import type { Expert } from "@/app/components/expert/expert";

// Lazy load ProfileModal (loads only when needed)
const ProfileModal = lazy(() =>
  import("@/app/components/admin/ProfileModal").then((module) => ({
    default: module.ProfileModal,
  }))
);

// Loading fallback for modal
function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading expert profile...</p>
        </div>
      </div>
    </div>
  );
}

export default function ExpertsPage() {
  // Selected expert state (for modal)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(expertsData), []);
  
  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(), []);
  
  // Get modal props for selected expert
  const modalProps = selectedExpert ? getProfileModalProps(selectedExpert) : null;

  return (
    <>
      {/* Experts table with stats cards */}
      <DataTable
        data={expertsData}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        title="Expert Management"
        onViewDetails={setSelectedExpert}
        statsCards={<StatsCards stats={statsConfig} columns={4} />}
      />

      {/* Expert profile modal (lazy loaded) */}
      {selectedExpert && modalProps && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal
            {...modalProps}
            isOpen={true}
            onClose={() => setSelectedExpert(null)}
          />
        </Suspense>
      )}
    </>
  );
}