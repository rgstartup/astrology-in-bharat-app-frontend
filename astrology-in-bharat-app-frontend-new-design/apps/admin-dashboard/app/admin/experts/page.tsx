"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";

// Components
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { Loading } from "../../../../shared/components/Loading";

// Data config and types
import { getStatsConfig, getColumns, type ExpertStats } from "@/app/components/expert/expertsConfig";
import { getProfileModalProps } from "@/app/components/expert/expertsModalConfig";
import type { Expert } from "@/app/components/expert/expert";

// Services
import { getExperts, getExpertStats } from "@/src/services/admin.service";

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
  const [page, setPage] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);

  // Selected expert state (for modal)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Fetch stats (Only once)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getExpertStats();
        // statsData might come as object directly from axios response data if API returns object
        if (statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch expert stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch experts (Paginated)
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        const response = await getExperts({ search: searchQuery, page: page, limit: 10 });
        // Assuming API returns { data: Expert[], total: number } or similar
        // Adjust based on actual API response structure. 
        // Common pattern: { data: [], meta: { total: 100 } } or { experts: [], totalCount: 100 }
        // If response is just array, we can't paginate server side properly without total count.
        // Let's assume standard response format or adjust.
        // Given previous code: return res.data. 

        if (response && response.data) {
          setExperts(response.data);
          setTotalExperts(response.total || response.count || 0);
        } else if (Array.isArray(response)) {
          // Fallback if API just returns array (no total), disable server pagination effectively or show what we have
          setExperts(response);
          setTotalExperts(response.length); // Weak fallback
        } else {
          // Handle potential { result: [], ... } structure
          setExperts(response.result || []);
          setTotalExperts(response.total || 0);
        }

      } catch (error) {
        console.error("Failed to fetch experts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchExperts();
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

  // Get stats config (memoized) - using separate stats state
  const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);

  // Get table columns (memoized)
  const columns = useMemo(() => getColumns(), []);

  // Get modal props for selected expert
  const modalProps = selectedExpert ? getProfileModalProps(selectedExpert) : null;

  return (
    <>
      {/* Experts table with stats cards */}
      <DataTable
        data={experts}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        title="Expert Management"
        onViewDetails={setSelectedExpert}
        statsCards={<StatsCards stats={statsConfig} columns={4} />}
        onSearch={handleSearch} // Use wrapper to reset page
        isLoading={isLoading}
        manualPagination={true}
        totalItems={totalExperts}
        onPageChange={handlePageChange}
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