"use client";
import React, { useState, useMemo, lazy, Suspense } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "../../../../shared/components/StatsCard";

// Data config and types
import { usersData, getStatsConfig, getColumns } from "@/app/components/user/usersConfig";
import { getUserProfileModalProps } from "@/app/components/user/usersModalConfig";
import type { User } from "@/app/components/user/user";

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
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  // Selected user state (for modal)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(usersData), []);

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(), []);

  // Get modal props for selected user
  const modalProps = selectedUser ? getUserProfileModalProps(selectedUser) : null;

  return (
    <>
      {/* Users table with stats cards */}
      <DataTable
        data={usersData}
        columns={columns}
        searchKeys={["name", "email"]}
        title="User Management"
        onViewDetails={setSelectedUser}
        statsCards={<StatsCards stats={statsConfig} columns={3} />}
      />

      {/* User profile modal (lazy loaded) */}
      {selectedUser && modalProps && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal {...modalProps} isOpen={true} onClose={() => setSelectedUser(null)} />
        </Suspense>
      )}
    </>
  );
}