"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@repo/ui";
import { Loading } from "@repo/ui";

// Data config and types
import { getStatsConfig, getColumns, type ExpertStats } from "@/app/components/expert/expertsConfig";
import { getProfileModalProps } from "@/app/components/expert/expertsModalConfig";
import type { Expert } from "@/app/components/expert/expert";

// Services
import { getExperts, getExpertStats, getExpertById } from "@/src/services/admin.service";
import { toast } from "react-toastify";


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
  const [stats, setStats] = useState<ExpertStats | Expert[]>({ totalExperts: 0, activeExperts: 0, pendingExperts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);

  // Selected expert state (for modal)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Fetch stats (Function)
  const fetchStats = async () => {
    try {
      const statsData = await getExpertStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch expert stats:", error);
    }
  };

  // Fetch experts (Function)
  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const response = await getExperts({
        search: searchQuery,
        page: page,
        limit: 10,
        status: statusFilter || undefined
      });
      if (response && response.data) {
        setExperts(response.data);
        setTotalExperts(response.total || response.count || 0);
      } else if (Array.isArray(response)) {
        setExperts(response);
        setTotalExperts(response.length);
      } else {
        setExperts(response.result || []);
        setTotalExperts(response.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch experts (Paginated)
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

  // Handle View Details - Fetch full profile for modal
  const handleViewDetails = async (expert: Expert) => {
    try {
      // Show short loading if needed, or just let modal handle it
      // For best UX, we fetch before opening
      const fullExpert = await getExpertById(expert.id);
      setSelectedExpert(fullExpert.data || fullExpert);
    } catch (error) {
      console.error("Failed to fetch expert details:", error);
      toast.error("Could not load expert details");
    }
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

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(), []);

  // Get modal props for selected expert
  const modalProps = selectedExpert ? getProfileModalProps(selectedExpert) : null;

  return (
    <>
      <DataTable
        data={experts}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        title="Expert Management"
        onViewDetails={handleViewDetails}
        statsCards={<StatsCards stats={statsConfig} columns={3} />}
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
    </>
  );
}



