"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@repo/ui";
import { Loading } from "@repo/ui";
import { BlockConfirmModal } from "@/app/components/admin/BlockConfirmModal";

// Data config and types
import { getStatsConfig, getColumns, type ExpertStats } from "@/app/components/expert/expertsConfig";
import { getProfileModalProps } from "@/app/components/expert/expertsModalConfig";
import type { Expert } from "@/app/components/expert/expert";

// Services
import { getExperts, getExpertStats, getExpertById } from "@/services/admin.service";


// Lazy load ProfileModal (loads only when needed)
const ProfileModal = lazy(() =>
  import("@/app/components/admin/ProfileModal").then((module) => ({
    default: module.ProfileModal,
  }))
);

// Loading fallback for modal
function ModalLoadingFallback() {
  return <Loading fullScreen size="lg" text="Loading expert profile..." />;
}

export default function ExpertsPage() {
  // Application State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [stats, setStats] = useState<ExpertStats | Expert[]>({
    totalExperts: 0,
    activeExperts: 0,
    pendingExperts: 0,
    rejectedExperts: 0,
    recentExperts: 0,
    blockedExperts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);

  // Selected expert state (for modal)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Block confirmation state
  const [blockConfirmModalOpen, setBlockConfirmModalOpen] = useState(false);
  const [expertToBlock, setExpertToBlock] = useState<Expert | null>(null);
  const [isBlockingStatus, setIsBlockingStatus] = useState(false);

  // Fetch stats (Function)
  const fetchStats = async () => {
    const [statsData, error] = await getExpertStats();
    if (!error && statsData) {
      setStats(statsData);
    } else if (error) {
      console.error("Failed to fetch expert stats:", error);
    }
  };


  // Fetch experts (Function)
  const fetchExperts = async () => {
    setIsLoading(true);
    const [response, error] = await getExperts({
      search: searchQuery,
      page: page,
      limit: 10,
      status: statusFilter || undefined
    });

    if (error) {
      console.error("Failed to fetch experts:", error);
      setIsLoading(false);
      return;
    }

    if (response) {
      if (response.items) {
        setExperts(response.items);
        setTotalExperts(response.total || 0);
      } else if (response.data) {
        setExperts(response.data);
        setTotalExperts(response.total || response.count || 0);
      } else if (Array.isArray(response)) {
        setExperts(response);
        setTotalExperts(response.length);
      } else {
        setExperts(response.result || []);
        setTotalExperts(response.total || 0);
      }
    }
    setIsLoading(false);
  };


  // Initial fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch experts when search/page/status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExperts();
    }, 500);

    const handleRefresh = () => {
      fetchStats();
      fetchExperts();
    };

    window.addEventListener('refreshExperts', handleRefresh);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('refreshExperts', handleRefresh);
    };
  }, [searchQuery, page, statusFilter]);

  // Normalize expert data: flatten profile_expert fields onto root level
  const normalizeExpert = (expert: Expert): Expert => {
    const profile = expert.profile_expert;
    if (!profile) return expert;

    return {
      ...expert,
      bio: expert.bio || profile.bio,
      specialization: expert.specialization || profile.specialization,
      experience_in_years: expert.experience_in_years ?? profile.experience_in_years,
      rating: expert.rating ?? profile.rating,
      consultation_count: expert.consultation_count ?? profile.consultation_count,
      kyc_status: expert.kyc_status || profile.kyc_status,
      rejection_reason: expert.rejection_reason ?? profile.rejection_reason,
      phone_number: expert.phone_number || profile.phone_number,
      intro_video_url: expert.intro_video_url || profile.intro_video_url,
      gallery: expert.gallery || profile.gallery,
      documents: expert.documents || profile.documents,
      languages: expert.languages || (Array.isArray(profile.languages) ? (profile.languages as string[]).join(", ") : (profile.languages as string | undefined)),
      addresses: expert.addresses || profile.addresses,
    };
  };

  // Handle View Details - Fetch full profile for modal
  const handleViewDetails = async (expert: Expert) => {
    setIsLoading(true);
    const [fullExpert, error] = await getExpertById(expert.id);
    
    if (error) {
      console.warn("Detail API failed, using list data with profile_expert:", error);
      // Fallback: use the expert data already loaded from the list (which includes profile_expert)
      setSelectedExpert(normalizeExpert(expert));
    } else {
      const data = (fullExpert as any)?.data || fullExpert;
      setSelectedExpert(normalizeExpert(data));
    }
    setIsLoading(false);
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);

  const handleToggleBlockClick = (expert: Expert) => {
    setExpertToBlock(expert);
    setBlockConfirmModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!expertToBlock) return;
    setIsBlockingStatus(true);
    console.log(`[Admin Frontend] Attempting to ${!expertToBlock.is_blocked ? 'block' : 'unblock'} expert:`, expertToBlock.id);
    try {
      const { toggleUserBlock } = await import("@/services/admin.service");
      const [response, error] = await toggleUserBlock(expertToBlock.id, !expertToBlock.is_blocked);
      
      if (!error) {
        console.log(`[Admin Frontend] Successfully ${!expertToBlock.is_blocked ? 'blocked' : 'unblocked'} expert.`);
        fetchExperts();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to toggle block status", err);
    }
    setIsBlockingStatus(false);
    setBlockConfirmModalOpen(false);
    setExpertToBlock(null);
  };

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(handleToggleBlockClick), [experts]);

  // Get modal props for selected expert
  const modalProps = selectedExpert ? getProfileModalProps(selectedExpert) : null;

  return (
    <>
      <div className="mb-6 w-full">
        <StatsCards stats={statsConfig} columns={5} />
      </div>
      <DataTable
        data={experts}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        title="Expert Management"
        tableMinWidth="min-w-[1000px]"
        onViewDetails={handleViewDetails}
        onSearch={handleSearch}
        isLoading={isLoading}
        manualPagination={true}
        totalItems={totalExperts}
        onPageChange={handlePageChange}
        filterElement={
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        }
      />


      {/* Expert profile modal (lazy loaded) */}
      {selectedExpert && modalProps && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal
            {...modalProps}
            expertId={selectedExpert.id}
            isOpen={true}
            onClose={() => setSelectedExpert(null)}
            onStatusUpdate={() => {
              // Refresh both table and stats
              window.dispatchEvent(new CustomEvent('refreshExperts'));
            }}
          />
        </Suspense>
      )}

      {/* Block Confirm Modal */}
      {expertToBlock && (
        <BlockConfirmModal
          isOpen={blockConfirmModalOpen}
          onClose={() => {
            setBlockConfirmModalOpen(false);
            setExpertToBlock(null);
          }}
          onConfirm={handleConfirmBlock}
          userName={expertToBlock.name || expertToBlock.email}
          isBlocking={!expertToBlock.is_blocked}
          isLoading={isBlockingStatus}
        />
      )}
    </>
  );
}



