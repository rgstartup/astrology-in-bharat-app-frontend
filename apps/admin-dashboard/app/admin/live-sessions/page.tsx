// live-sessions/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { StatsCards } from "@repo/ui";
import { toast } from "react-toastify";

import {
  RefreshCw,
  Eye,
  Video,
  Activity,
  AlertCircle,
  Clock
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
import { getLiveSessions, getChatHistory } from "@/src/services/admin.service";

export default function LiveSessionsPage() {
  // Simple state
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [volume, setVolume] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState(true);

  // Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSessionMessages, setSelectedSessionMessages] = useState<any[]>([]);
  const [viewingSession, setViewingSession] = useState<LiveSession | null>(null);

  const fetchSessions = async () => {
    try {
      setIsRefreshing(true);
      const data = await getLiveSessions(activeFilter);

      // Map backend data to frontend interface
      const mappedSessions: LiveSession[] = data.map((s: any) => ({
        id: s.id.toString(),
        user: {
          id: s.user?.id.toString() || "0",
          name: s.user?.name || "Unknown User",
          avatar: s.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.user?.id}`,
          rating: 4.5
        },
        astrologer: {
          id: s.expert?.id.toString() || "0",
          name: s.expert?.user?.name || "Unknown Expert",
          avatar: s.expert?.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.expert?.id}`,
          specialty: s.expert?.specialization || "Astrology",
          experience: s.expert?.experience_in_years || 0
        },
        sessionType: s.sessionType || "chat",
        status: s.status === 'active' ? 'live' :
          s.status === 'pending' ? 'pending' :
            s.status === 'expired' ? 'expired' :
              (s.status === 'completed' && s.terminatedBy === 'admin') ? 'admin-terminated' :
                s.status === 'completed' ? 'ended' : 'live',
        startTime: new Date(s.startTime || s.createdAt),
        duration: s.duration || 0,
        connectionQuality: "excellent",
        chatMessages: s.messageCount || 0,
        recording: false,
        lastActive: new Date(s.updatedAt || s.createdAt),
        issues: []
      }));

      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to fetch live sessions");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, [activeFilter]);

  // Simple calculations
  const stats = useMemo(() => {
    const total = sessions.length;
    const live = sessions.filter(s => s.status === "live").length;
    const withIssues = sessions.filter(s => s.status === "technical-issue").length;
    const recording = sessions.filter(s => s.recording).length;

    return [
      {
        title: "Total Active Sessions",
        value: total.toString(),
        icon: Activity,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "Now", isPositive: true, period: "" }
      },
      {
        title: "Live Now",
        value: live.toString(),
        icon: Activity,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: "Live", isPositive: true, period: "" }
      },
      {
        title: "Recording",
        value: recording.toString(),
        icon: Video,
        iconColor: "text-purple-600",
        iconBgColor: "bg-purple-100",
        trend: { value: "Auto", isPositive: true, period: "" }
      },
      {
        title: "Issues",
        value: withIssues.toString(),
        icon: AlertCircle,
        iconColor: "text-red-600",
        iconBgColor: "bg-red-100",
        trend: { value: "All Good", isPositive: true, period: "" }
      },
    ];
  }, [sessions]);

  // Simple filter
  const filteredSessions = useMemo(() => {
    if (activeFilter === "all") return sessions;
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
      const history = await getChatHistory(parseInt(session.id));
      setSelectedSessionMessages(history);
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
            <ActivityIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No Active Sessions Found</h3>
            <p className="text-gray-400">There are currently no sessions matching your filters.</p>
          </div>
        )}
      </div>

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




