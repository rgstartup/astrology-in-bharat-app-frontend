"use client";

import React, { useState, useEffect } from "react";
import AppointmentStats from "./AppointmentStats";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentList from "./AppointmentList";
import AppointmentCalendar from "./AppointmentCalendar";
import RescheduleModal from "./RescheduleModal";
import { Appointment } from "./types";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { chatSocket } from "@/lib/socket";
import { getExpertReviews } from "@/lib/reviews";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard";

export default function AppointmentsPage() {
  const { user: expertUser, isAuthenticated: isExpertAuthenticated } = useAuthStore();

  console.log("[AppointmentDebug] AppointmentsPage Rendered");

  useEffect(() => {
    if (expertUser) {
      console.log("[AppointmentDebug] Full expertUser structure:", JSON.stringify(expertUser, null, 2));
    }
  }, [expertUser]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const fetchChatSessions = async () => {
    if (!isExpertAuthenticated || !expertUser) {
      console.log("[AppointmentDebug] Not authenticated or no expert user. Authentication status:", isExpertAuthenticated);
      setLoading(false);
      return;
    }

    try {
      console.log("[AppointmentDebug] Fetching chat sessions (pending + completed) for expert user ID:", expertUser.id);

      // Fetch both pending sessions, completed ones, relevant reviews and stats
      const [pendingRes, completedRes, reviewsRes, statsRes] = await Promise.allSettled([
        apiClient.get("/chat/sessions/appointments/pending"),
        apiClient.get("/chat/sessions/appointments/completed"),
        expertUser?.profileId ? getExpertReviews(expertUser.profileId, 1, 50) : Promise.reject("No expert ID"),
        getDashboardStats('today').catch(err => {
          console.error("[Appointment] Today stats fetch failed:", err);
          return null;
        })
      ]);

      let allSessions: any[] = [];

      if (pendingRes.status === 'fulfilled') {
        allSessions = [...allSessions, ...pendingRes.value.data];
      }

      if (completedRes.status === 'fulfilled') {
        allSessions = [...allSessions, ...completedRes.value.data];
      }

      const reviews = (reviewsRes.status === 'fulfilled' && (reviewsRes.value as any).data) ? (reviewsRes.value as any).data : [];

      // Deduplicate sessions by ID (prevents double display if session is in both pending and completed)
      const uniqueSessionsMap = new Map();
      allSessions.forEach(session => {
        if (!uniqueSessionsMap.has(session.id)) {
          uniqueSessionsMap.set(session.id, session);
        }
      });

      const uniqueSessions = Array.from(uniqueSessionsMap.values());

      // Sort by date (newest first)
      uniqueSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const chatAppointments: Appointment[] = await Promise.all(uniqueSessions.map(async (session: any) => {
        let currentStatus = session.status;

        // Match review if missing from session data
        let sessionReview = session.review;
        if (!sessionReview || !sessionReview.comment) {
          const matchingReview = reviews.find((r: any) =>
            r.sessionId === session.id ||
            (session.user?.name && r.user?.name === session.user?.name &&
              Math.abs(new Date(r.createdAt).getTime() - new Date(session.createdAt).getTime()) < 24 * 60 * 60 * 1000)
          );
          if (matchingReview) {
            sessionReview = {
              rating: matchingReview.rating,
              comment: matchingReview.comment
            };
          }
        }

        // Fix: Backend pending endpoint might return stale "active" status even if session ended.
        // We double-check the status for any "active" session using the individual session endpoint.
        if (currentStatus === 'active') {
          try {
            const verificationRes = await apiClient.get(`/chat/session/${session.id}?_t=${Date.now()}`);
            if (verificationRes.data && verificationRes.data.status) {
              console.log(`[AppointmentDebug] Verified status for session ${session.id}: ${verificationRes.data.status}`);
              currentStatus = verificationRes.data.status;
            }
          } catch (err) {
            console.warn(`[AppointmentDebug] Failed to verify session ${session.id}`, err);
          }
        }

        if (!session.expiresAt) {
          console.warn(`[AppointmentDebug] ⚠️ Missing expiresAt for session ${session.id}. Raw session:`, session);
        } else {
          console.log(`[AppointmentDebug] ✅ Received expiresAt for session ${session.id}: ${session.expiresAt}`);
        }

        return {
          id: session.id,
          name: session.user?.name || "Client",
          avatar: session.user?.profile_picture || session.user?.avatar,
          service: "Chat Consultation",
          date: session.createdAt || new Date().toISOString(),
          status: currentStatus, // Use the verified status
          type: "new",
          reminder: false,
          meetingLink: `/chat/${session.id}`,
          sessionId: session.id,
          clientId: session.clientId,
          expiresAt: session.expiresAt,
          isFree: !!session.isFree,
          freeMinutes: session.freeMinutes || 0,
          durationMins: (() => {
            let d = session.durationMins || session.duration || 0;
            if (d === 0 && (currentStatus === 'completed' || currentStatus === 'expired')) {
              const start = session.activatedAt ? new Date(session.activatedAt).getTime() :
                (session.startTime ? new Date(session.startTime).getTime() : 0);
              const end = session.endedAt ? new Date(session.endedAt).getTime() :
                (session.endTime ? new Date(session.endTime).getTime() : 0);
              if (start > 0 && end > 0) return Math.ceil((end - start) / (1000 * 60));
            }
            return d;
          })(),
          review: sessionReview ? {
            rating: sessionReview.rating || 0,
            comment: sessionReview.comment || ""
          } : undefined,
          terminatedBy: session.terminatedBy,
        };
      }));

      // Stats Logic
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }

      console.log("[AppointmentDebug] Mapped appointments:", chatAppointments);
      setAppointments(chatAppointments);
    } catch (error) {
      console.error("[AppointmentDebug] Failed to fetch chat sessions:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Socket Listeners
  useEffect(() => {
    console.log("[AppointmentDebug] useEffect triggered. Auth:", isExpertAuthenticated, "ExpertUser:", expertUser?.id);
    setLoading(true);
    fetchChatSessions();

    if (isExpertAuthenticated && expertUser) {
      const registrationId = expertUser.profileId || expertUser.id;

      const connectSocket = () => {
        console.log("[AppointmentDebug] ChatSocket status:", chatSocket.connected ? "Connected" : "Disconnected", "ID:", chatSocket.id);

        if (!chatSocket.connected) {
          console.log("[AppointmentDebug] Attempting to connect ChatSocket...");
          chatSocket.connect();
        }

        const rid = expertUser.profileId || expertUser.id;
        console.log(`[AppointmentDebug] Emitting 'register_expert' for ID: ${rid} (Room: expert_${rid})`);
        chatSocket.emit('register_expert', { expertId: rid }, (response: any) => {
          console.log("[AppointmentDebug] 'register_expert' success:", response);
        });
      };

      // Connect if not connected
      connectSocket();

      // Handle reconnection
      chatSocket.on('connect', () => {
        console.log("[AppointmentDebug] ChatSocket connected! Registering again...");
        connectSocket();
      });

      // 2. Real-time update when NEW request arrives
      const handleNewRequest = (session: any) => {
        console.log("[AppointmentDebug] 🚨 New Real-time Chat Request RECEIVED via Socket:", JSON.stringify(session, null, 2));

        // Safety check for session data
        if (!session || !session.id) {
          console.error("[AppointmentDebug] Received invalid session object:", session);
          return;
        }

        console.log(`[AppointmentDebug] Socket data contains expiresAt: ${session.expiresAt || 'MISSING'}`);

        const newAppt: Appointment = {
          id: session.id,
          name: session.user?.name || "Client",
          avatar: session.user?.profile_picture || session.user?.avatar,
          service: "Chat Consultation",
          date: session.createdAt || new Date().toISOString(),
          status: "pending",
          type: "new",
          reminder: false,
          meetingLink: `/chat/${session.id}`,
          sessionId: session.id,
          clientId: session.clientId || session.userId,
          expiresAt: session.expiresAt,
          isFree: !!session.isFree,
          freeMinutes: session.freeMinutes || 0,
          durationMins: session.durationMins || 0,
          review: session.review,
          terminatedBy: session.terminatedBy,
        };

        setAppointments(prev => {
          if (prev.some(a => a.id === newAppt.id)) {
            console.log("[AppointmentDebug] Duplicate request ignored. Session ID:", newAppt.id);
            return prev;
          }
          console.log("[AppointmentDebug] ✅ Adding NEW appointment to UI list:", newAppt);
          return [newAppt, ...prev];
        });
      };

      chatSocket.on('new_chat_request', handleNewRequest);

      // 3. Real-time update when session is ACTIVATED
      chatSocket.on('session_activated', (session: any) => {
        console.log("[AppointmentDebug] Session Activated:", session.id);
        setAppointments(prev => prev.map(a =>
          a.id === session.id ? { ...a, status: 'active' as const } : a
        ));
      });

      // 4. Real-time update when session is ENDED (completed or expired)
      chatSocket.on('session_ended', (data: any) => {
        console.log("[AppointmentDebug] 🏁 Session Ended Event received:", data);
        const targetId = data.id || data.sessionId;
        if (!targetId) {
          console.error("[AppointmentDebug] End event missing ID:", data);
          return;
        }

        setAppointments(prev => {
          const index = prev.findIndex(a => a.id === targetId);
          if (index === -1) {
            console.log("[AppointmentDebug] Session not found in current list, potentially re-fetching or already removed.");
            // fetchChatSessions(); // Optional: Re-fetch if you want to be sure
            return prev;
          }
          console.log(`[AppointmentDebug] Updating session ${targetId} to status: ${data.status || 'completed'}`);
          return prev.map(a =>
            a.id === targetId ? {
              ...a,
              status: (data.status === 'expired' ? 'expired' : 'completed') as any,
              terminatedBy: data.terminatedBy
            } : a
          );
        });
      });

      return () => {
        console.log("[AppointmentDebug] Cleaning up socket listeners...");
        chatSocket.off('new_chat_request', handleNewRequest);
        chatSocket.off('session_activated');
        chatSocket.off('session_ended');
        chatSocket.off('connect');
      };
    }
  }, [isExpertAuthenticated, expertUser]);

  // Polling fallback for active sessions (in case socket event is missed during redirect)
  useEffect(() => {
    const hasActiveSession = appointments.some(a => a.status === 'active');

    if (hasActiveSession) {
      console.log("[AppointmentDebug] Active session detected, starting polling fallback...");
      const interval = setInterval(() => {
        fetchChatSessions();
      }, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [appointments]);

  const openRescheduleModal = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsModalOpen(true);
  };

  const handleReschedule = (
    appointment: Appointment | null,
    date: Date | null,
    time: string
  ) => {
    console.log("Rescheduling appointment:", appointment, date, time);
    setIsModalOpen(false);
  };

  // Filtering Logic
  const filteredAppointments = appointments.filter(appt => {
    // 1. Search Filter
    const matchesSearch = appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.service.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status/Date Filter
    let matchesStatus = true;
    if (activeStatus === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const apptDate = appt.date.split('T')[0];
      matchesStatus = apptDate === today;
    } else if (activeStatus !== 'all') {
      matchesStatus = appt.status === activeStatus;
    }

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <AppointmentStats stats={stats} />

      {/* Filters & View Toggles */}
      <AppointmentFilters
        view={view}
        setView={setView}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* Appointment List or Calendar */}
      {view === "list" ? (
        <AppointmentList
          appointments={filteredAppointments}
          onReschedule={openRescheduleModal}
        />
      ) : (
        <AppointmentCalendar appointments={filteredAppointments} />
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleReschedule}
      />
    </div>
  );
}


