"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { Loading } from "../../../../shared/components/Loading";
import { ConfirmationModal } from "@/app/components/admin/ConfirmationModal";

// Data config and types
import { getStatsConfig, getColumns, type UserStats } from "@/app/components/user/usersConfig";
import { getUserProfileModalProps } from "@/app/components/user/usersModalConfig";
import type { User } from "@/app/components/user/user";

// Services
import { getUsers, getUserStats, toggleUserBlock } from "@/src/services/admin.service";

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
  const [stats, setStats] = useState<UserStats | User[]>({ totalUsers: 0, recentUsers: 0, blockedUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Selected user state (for view modal)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: User | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    isLoading: false,
  });

  // Fetch stats 
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getUserStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, []);

  // Fetch users 
  const fetchUsers = useCallback(async () => {
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
  }, [searchQuery, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Block/Unblock Logic
  const initiateToggleBlock = (user: User) => {
    setConfirmModal({
      isOpen: true,
      user: user,
      isLoading: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.user) return;

    setConfirmModal(prev => ({ ...prev, isLoading: true }));

    try {
      await toggleUserBlock(confirmModal.user.id, !confirmModal.user.isBlocked);

      // Refresh data
      await Promise.all([fetchUsers(), fetchStats()]);

      setConfirmModal({ isOpen: false, user: null, isLoading: false });
    } catch (error) {
      console.error(`Failed to handle block/unblock action:`, error);
      alert(`Failed to perform action. Please try again.`);
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(initiateToggleBlock), []);

  // Get modal props for selected user
  const modalProps = selectedUser ? getUserProfileModalProps(selectedUser) : null;

  return (
    <>
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

      {/* Details Modal */}
      {selectedUser && modalProps && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal {...modalProps} isOpen={true} onClose={() => setSelectedUser(null)} />
        </Suspense>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        isLoading={confirmModal.isLoading}
        title={confirmModal.user?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${confirmModal.user?.isBlocked ? 'unblock' : 'block'} ${confirmModal.user?.name}?`}
        confirmLabel={confirmModal.user?.isBlocked ? "Yes, Unblock" : "Yes, Block"}
        type={confirmModal.user?.isBlocked ? "info" : "warning"}
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}