"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@repo/ui";
import { Loading } from "@repo/ui";
import { ConfirmationModal } from "@/app/components/admin/ConfirmationModal";
import { BlockConfirmModal } from "@/app/components/admin/BlockConfirmModal";

// Data config and types
import { getStatsConfig, getColumns, type UserStats } from "@/app/components/user/usersConfig";
import { getUserProfileModalProps } from "@/app/components/user/usersModalConfig";
import type { User } from "@/app/components/user/user";

// Services
import { getUsers, getUserStats, toggleUserBlock, getUserById } from "@/services/admin.service";

// Lazy load ProfileModal (loads only when needed)
const ProfileModal = lazy(() =>
  import("@/app/components/admin/ProfileModal").then((module) => ({
    default: module.ProfileModal,
  }))
);

const AssignCouponModal = lazy(() => import("@/app/components/user/AssignCouponModal"));
const BulkAssignCouponModal = lazy(() => import("@/app/components/user/BulkAssignCouponModal"));

// Loading fallback for modal
function ModalLoadingFallback() {
  const LoadingComp = Loading as any;
  return <LoadingComp fullScreen size="lg" text="Loading profile..." />;
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
  const [detailedUser, setDetailedUser] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Assign Coupon state
  const [couponUser, setCouponUser] = useState<User | null>(null);

  // Bulk Assign Coupon state
  const [showBulkAssign, setShowBulkAssign] = useState(false);

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
    const [statsData, error] = await getUserStats();
    if (!error && statsData) {
      setStats(statsData);
    } else if (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, []);


  // Fetch users 
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const [response, error] = await getUsers({ search: searchQuery, page: page, limit: 10 });

    if (error) {
      console.error("Failed to fetch users:", error);
      setIsLoading(false);
      return;
    }

    if (response) {
      if (response.items) {
        setUsers(response.items);
        setTotalUsers(response.total || response.count || 0);
      } else if (response.data) {
        setUsers(response.data);
        setTotalUsers(response.total || response.count || 0);
      } else if (Array.isArray(response)) {
        setUsers(response);
        setTotalUsers(response.length);
      } else {
        setUsers(response.result || []);
        setTotalUsers(response.total || 0);
      }
    }
    setIsLoading(false);
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

    const [_, error] = await toggleUserBlock(confirmModal.user.id, !confirmModal.user.is_blocked);

    if (error) {
      console.error(`Failed to handle block/unblock action:`, error);
      alert(`Failed to perform action. Please try again.`);
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Update data locally without refetching from backend
    setUsers(prev => prev.map(u => 
      u.id === confirmModal.user!.id 
        ? { ...u, is_blocked: !confirmModal.user!.is_blocked } 
        : u
    ));
    await fetchStats(); // Refetch stats only, not the large list
    setConfirmModal({ isOpen: false, user: null, isLoading: false });
  };


  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(initiateToggleBlock, setCouponUser), []);

  // Get modal props for selected user
  const modalProps = selectedUser ? getUserProfileModalProps(selectedUser) : null;

  return (
    <>
      <div className="mb-6 w-full">
        <StatsCards stats={statsConfig} columns={3} />
      </div>
      <DataTable
        data={users}
        columns={columns}
        searchKeys={["name", "email"]}
        title="User Management"
        tableMinWidth="min-w-[1000px]"
        onViewDetails={async (user) => {
          setSelectedUser(user);
          setIsDetailLoading(true);
          const [data, error] = await getUserById(user.id);
          
          if (error) {
            console.error("Failed to fetch user details:", error);
          } else {
            setDetailedUser(data);
          }
          setIsDetailLoading(false);
        }}

        onSearch={handleSearch}
        isLoading={isLoading}
        manualPagination={true}
        totalItems={totalUsers}
        onPageChange={handlePageChange}
        headerAction={
          <button
            onClick={() => setShowBulkAssign(true)}
            className="px-4 py-2 bg-[#fd6410] hover:bg-[#e0580e] text-white rounded-lg font-semibold text-sm shadow-lg shadow-[#fd6410]/40 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Assign Coupon (Bulk)
          </button>
        }
      />

      {/* Details Modal */}
      {selectedUser && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal
            {...(detailedUser ? getUserProfileModalProps(detailedUser) : getUserProfileModalProps(selectedUser))}
            isOpen={true}
            onClose={() => {
              setSelectedUser(null);
              setDetailedUser(null);
            }}
            action2Label="Close"
            checklist={detailedUser?.profile_client?.addresses?.map((addr: any) => ({
              label: `${addr.tag || 'Address'}`,
              isComplete: !!addr.line1,
              value: `${addr.house_no || ''} ${addr.line1 || ''}, ${addr.city || ''}, ${addr.state || ''}, ${addr.country || ''} - ${addr.pincode || ''}`
            }))}
            purchases={detailedUser?.purchases}
            subtitle="User Profile"
          />
        </Suspense>
      )}

      {/* Confirmation Modal */}
      {confirmModal.user && (
        <BlockConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirmAction}
          userName={confirmModal.user.name || confirmModal.user.email}
          isBlocking={!confirmModal.user.is_blocked}
          isLoading={confirmModal.isLoading}
        />
      )}

      {/* Assign Coupon Modal (Single User) */}
      {couponUser && (
        <Suspense fallback={null}>
          <AssignCouponModal user={couponUser} onClose={() => setCouponUser(null)} />
        </Suspense>
      )}

      {/* Bulk Assign Coupon Modal */}
      {showBulkAssign && (
        <Suspense fallback={null}>
          <BulkAssignCouponModal
            onClose={() => setShowBulkAssign(false)}
            onSuccess={() => {
              fetchUsers();
              fetchStats();
            }}
          />
        </Suspense>
      )}
    </>
  );
}



