// live-sessions/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { StatsCards, Button } from "@repo/ui";
import { toast } from "react-toastify";


import {
  
  Video,
  Activity,
  AlertCircle,
  
} from "lucide-react";

const { Activity: ActivityIcon } = { Activity } as any;
// Static components
import { SessionHeader } from "@/app/components/live-sessions/SessionHeader";
import { SessionFilters } from "@/app/components/live-sessions/SessionFilters";
import { LiveSessionCard } from "@/app/components/live-sessions/card";
import { ChatHistoryModal } from "@/app/components/live-sessions/ChatHistoryModal";

// Config
import { filters } from "@/app/components/live-sessions/sessionsConfig";
import type { LiveSession } from "@/app/components/live-sessions/session";
import { getLiveSessions, getLiveSessionStats, getChatHistory } from "@/services/admin.service";
import { History, ShieldAlert } from "lucide-react";

export default function LiveSessionsPage() {
  // Simple state
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("chat_live");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expiredPage, setExpiredPage] = useState(1);
  const [hasMoreExpired, setHasMoreExpired] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    live: 0,
    expired: 0,
    adminTerminated: 0
  });

  // Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSessionMessages, setSelectedSessionMessages] = useState<any[]>([]);
  const [viewingSession, setViewingSession] = useState<LiveSession | null>(null);

  const fetchSessions = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setIsLoadingMore(true);
      else setIsRefreshing(true);

      // Fetch overall stats
      const [statsData, statsErr] = await getLiveSessionStats();
      if (!statsErr && statsData) {
        setSessionStats({
          total: statsData.total || 0,
          live: statsData.live || 0,
          expired: statsData.expired || 0,
          adminTerminated: statsData.adminTerminated || 0
        });
      }

      const supportedFilters = ["chat_live", "expired", "admin_terminated"];
      const apiFilter = supportedFilters.includes(activeFilter) ? activeFilter : undefined;

      const pageToFetch = isLoadMore ? expiredPage + 1 : 1;
      // Use a large limit for live sessions to show all, and 12 for expired as requested
      const limit = activeFilter === "expired" ? 12 : 100;

      const [response, error] = await getLiveSessions(apiFilter, { page: pageToFetch, limit });

      if (error) {
        throw error;
      }

      const items = response?.items || response?.data || (Array.isArray(response) ? response : []);
      const total = response?.total || response?.count || 0;

      const mappedSessions: LiveSession[] = items.map((s: any) => ({
        id: (s.id || "").toString(),
        user: {
          id: (s.client?.user?.id || s.user?.id || s.user_id || "0").toString(),
          name: s.client?.user?.name || s.user?.name || s.user?.full_name || s.userName || s.user_name || "Unknown User",
          avatar: s.client?.profile_picture || s.client?.user?.avatar || s.user?.profile_client?.profile_picture || s.user?.avatar || s.userAvatar || s.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.client?.user?.id || s.user?.id || s.user_id || s.id}`,
          rating: s.client?.user?.rating || s.user?.rating || 4.5
        },
        expert: {
          id: (s.expert?.id || s.expert_id || "0").toString(),
          name: s.expert?.user?.name || s.expert?.user?.full_name || s.expertName || s.expert_name || "Unknown Expert",
          avatar: s.expert?.user?.avatar || s.expertAvatar || s.expert_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.expert?.id || s.expert_id || s.id}`,
          specialty: s.expert?.specialization || s.specialization || "Astrology",
          experience: s.expert?.experience_in_years || s.experienceInYears || s.experience_in_years || 0
        },
        sessionType: s.session_type || s.sessionType || "chat",
        status: (s.status === 'active' || s.status === 'ACTIVE') ? 'live' :
          (s.status === 'pending' || s.status === 'PENDING') ? 'pending' :
            (s.status === 'expired' || s.status === 'EXPIRED') ? 'expired' :
              (s.status === 'completed' || s.status === 'COMPLETED') && (s.terminated_by === 'admin' || s.terminatedBy === 'admin') ? 'admin-terminated' :
                (s.status === 'completed' || s.status === 'COMPLETED') ? 'expired' :
                  (s.status === 'cancelled' || s.status === 'CANCELLED') ? 'expired' : 'expired',
        startTime: new Date(s.start_time || s.startTime || s.created_at || s.createdAt || Date.now()),
        duration: s.duration || 0,
        connectionQuality: s.connection_quality || s.connectionQuality || "excellent",
        chatMessages: s.message_count || s.messageCount || 0,
        recording: s.is_recording || s.recording || false,
        lastActive: new Date(s.end_time || s.endTime || s.updated_at || s.updatedAt || s.created_at || s.createdAt || Date.now()),
        issues: s.issues || []
      }));

      // Calculate missing durations based on timestamps
      mappedSessions.forEach(session => {
        if (!session.duration && session.status !== 'live') {
          const diffMs = session.lastActive.getTime() - session.startTime.getTime();
          session.duration = Math.max(0, Math.floor(diffMs / 1000)); // duration in seconds
        }
      });

      if (isLoadMore) {
        setSessions(prev => [...prev, ...mappedSessions]);
        setExpiredPage(pageToFetch);
      } else {
        setSessions(mappedSessions);
        setExpiredPage(1);
      }

      if (activeFilter === "expired") {
        const totalLoaded = isLoadMore ? sessions.length + mappedSessions.length : mappedSessions.length;
        setHasMoreExpired(totalLoaded < total);
      } else {
        setHasMoreExpired(false);
      }

    } catch (error: any) {
      console.error("Failed to fetch sessions:", error);
      if (!isLoadMore) setSessions([]);
      if (error?.status && error.status !== 404) {
        toast.error("Failed to fetch live sessions");
      }
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };


  useEffect(() => {
    fetchSessions();
    // Only auto-refresh for live tab
    if (activeFilter === "chat_live") {
      const interval = setInterval(() => fetchSessions(false), 30000);
      return () => clearInterval(interval);
    }
  }, [activeFilter]);

  // Simple calculations
  const stats = useMemo(() => {
    return [
      {
        title: "Total Sessions",
        value: sessionStats.total.toString(),
        icon: Activity,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "All time", isPositive: true, period: "" }
      },
      {
        title: "Live Sessions",
        value: sessionStats.live.toString(),
        icon: Activity,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: "Now", isPositive: true, period: "" }
      },
      {
        title: "Expired Sessions",
        value: sessionStats.expired.toString(),
        icon: History,
        iconColor: "text-orange-600",
        iconBgColor: "bg-orange-100",
        trend: { value: "Ended", isPositive: true, period: "" }
      },
      {
        title: "Admin Terminated",
        value: sessionStats.adminTerminated.toString(),
        icon: ShieldAlert,
        iconColor: "text-red-600",
        iconBgColor: "bg-red-100",
        trend: { value: "Forced", isPositive: false, period: "" }
      },
    ];
  }, [sessionStats]);

  // Filter logic aligned with sessionsConfig.ts
  const filteredSessions = useMemo(() => {
    // Since we now paginate on the server for 'expired', the 'sessions' array already matches the filter mostly.
    // However, we still apply local filtering to be safe or if other filters are selected.
    if (activeFilter === "chat_live") {
      return sessions.filter(s => s.status === "live");
    }
    if (activeFilter === "expired") {
      return sessions.filter(s => s.status === "expired" || s.status === "ended");
    }
    if (activeFilter === "admin_terminated") {
      return sessions.filter(s => s.status === "admin-terminated");
    }



    // Secondary filters
    if (activeFilter === "video") return sessions.filter(s => s.sessionType === "video");
    if (activeFilter === "audio") return sessions.filter(s => s.sessionType === "audio");
    if (activeFilter === "chat") return sessions.filter(s => s.sessionType === "chat");
    if (activeFilter === "issues") return sessions.filter(s => s.status === "technical-issue");

    return sessions;
  }, [sessions, activeFilter]);

  // Simple handlers
  const handleRefresh = () => {
    fetchSessions();
  };

  const handleJoinSession = async (session: LiveSession) => {
    if (session.sessionType !== 'chat') {
      toast.info("Observation is only available for Chat sessions.");
      return;
    }

    try {
      setViewingSession(session);
      const [history, error] = await getChatHistory(session.id);
      
      if (error) {
        throw error;
      }
      
      setSelectedSessionMessages(history?.data || history || []);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      toast.error("Could not load conversation history.");
    }
  };

  const handleEndSession = (sessionId: string) => {
    if (confirm("Are you sure you want to end this session artificially? (Not recommended)")) {
      // Endpoint doesn't exist yet for admin-forced end, but logic placeholder
      alert(`Session ${sessionId} end request sent (UI Only)`);
    }
  };

  const handleToggleRecording = (sessionId: string) => {
    alert(`Toggled recording for session ${sessionId}`);
  };

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <SessionHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} columns={4} />

      {/* Filters & Controls */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border">
        <SessionFilters
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="flex-1" />


      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <LiveSessionCard
              key={session.id}
              session={session}
              onJoinSession={handleJoinSession}
              onEndSession={handleEndSession}
              onToggleRecording={handleToggleRecording}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <ActivityIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700">No Active Sessions Found</h3>
            <p className="font-medium text-gray-600">There are currently no sessions matching your filters.</p>
          </div>
        )}
      </div>

      {/* Load More Button for Expired Sessions */}
      {activeFilter === "expired" && hasMoreExpired && (
        <div className="flex justify-center mt-8 pb-10">
          <Button
            onClick={() => fetchSessions(true)}
            loading={isLoadingMore}
            variant="outline"
            className="px-10 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            Load More Previous Sessions
          </Button>
        </div>
      )}


      {/* Chat History Modal */}
      <ChatHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        messages={selectedSessionMessages}
        session={viewingSession}
      />
    </main>
  );
}




