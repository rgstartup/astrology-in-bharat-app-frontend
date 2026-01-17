// live-sessions/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { StatsCards } from "../../../../shared/components/StatsCard";


import {
  RefreshCw,
  Eye,
  Video,
  Activity,
  AlertCircle,
  Clock
} from "lucide-react";
// Static components
import { SessionHeader } from "@/app/components/live-sessions/SessionHeader";
import { SessionFilters } from "@/app/components/live-sessions/SessionFilters";
import { SessionControls } from "@/app/components/live-sessions/SessionControls";
import { LiveSessionCard } from "@/app/components/live-sessions/card";

// Config
import { mockLiveSessions } from "@/app/components/live-sessions/sessionsConfig";
import { filters } from "@/app/components/live-sessions/sessionsConfig";
import type { LiveSession } from "@/app/components/live-sessions/session";

export default function LiveSessionsPage() {
  // Simple state
  const [sessions] = useState<LiveSession[]>(mockLiveSessions);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [volume, setVolume] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState(true);

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
        trend: { value: "+12%", isPositive: true, period: "vs yesterday" }
      },
      {
        title: "Live Now",
        value: live.toString(),
        icon: Activity,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: "+5", isPositive: true, period: "last hour" }
      },
      {
        title: "Recording",
        value: recording.toString(),
        icon: Video,
        iconColor: "text-purple-600",
        iconBgColor: "bg-purple-100",
        trend: { value: "3", isPositive: true, period: "sessions" }
      },
      {
        title: "Issues",
        value: withIssues.toString(),
        icon: AlertCircle,
        iconColor: "text-red-600",
        iconBgColor: "bg-red-100",
        trend: { value: "1", isPositive: false, period: "needs attention" }
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
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleJoinSession = (session: LiveSession) => {
    alert(`Joining session ${session.id} as admin observer`);
  };

  const handleEndSession = (sessionId: string) => {
    if (confirm("Are you sure you want to end this session?")) {
      alert(`Session ${sessionId} ended`);
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

        <SessionControls
          volume={volume}
          isPlaying={isPlaying}
          onVolumeChange={setVolume}
          onPlayPause={setIsPlaying}
        />
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <LiveSessionCard
            key={session.id}
            session={session}
            onJoinSession={handleJoinSession}
            onEndSession={handleEndSession}
            onToggleRecording={handleToggleRecording}
          />
        ))}
      </div>
    </main>
  );
}