"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { Loading } from "../../../../shared/components/Loading";

// Data config and types
import { getStatsConfig, getColumns, type UserStats } from "@/app/components/user/usersConfig";
import { getUserProfileModalProps } from "@/app/components/user/usersModalConfig";
import type { User } from "@/app/components/user/user";

// Services
import { getUsers, getUserStats } from "@/src/services/admin.service";

// Lazy load ProfileModal (loads only when needed)
const ProfileModal = lazy(() =>
  import("@/app/components/admin/ProfileModal").then((module) => ({
    default: module.ProfileModal,
  }))
);

// Loading fallback for modal
function ModalLoadingFallback() {
  return <Loading fullScreen size="lg" text="Loading profile..." />;
}

export default function UsersPage() {
  // Application State
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | User[]>({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Selected user state (for modal)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch stats (Only once)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getUserStats();
        if (statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch users (Paginated)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers({ search: searchQuery, page: page, limit: 10 });

        if (response && response.data) {
          setUsers(response.data);
          setTotalUsers(response.total || response.count || 0);
        } else if (Array.isArray(response)) {
          setUsers(response);
          setTotalUsers(response.length);
        } else {
          setUsers(response.result || []);
          setTotalUsers(response.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to page 1 on new search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(), []);

  // Get modal props for selected user
  const modalProps = selectedUser ? getUserProfileModalProps(selectedUser) : null;

  return (
    <>
      {/* Users table with stats cards */}
      <DataTable
        data={users}
        columns={columns}
        searchKeys={["name", "email"]}
        title="User Management"
        onViewDetails={setSelectedUser}
        statsCards={<StatsCards stats={statsConfig} columns={3} />}
        onSearch={handleSearch}
        isLoading={isLoading}
        manualPagination={true}
        totalItems={totalUsers}
        onPageChange={handlePageChange}
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