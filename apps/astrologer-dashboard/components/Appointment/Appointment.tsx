"use client";

import React, { useState, useEffect } from "react";
import AppointmentStats from "./AppointmentStats";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentList from "./AppointmentList";
import AppointmentCalendar from "./AppointmentCalendar";
import RescheduleModal from "./RescheduleModal";
import { Appointment } from "./types";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { chatSocket, callSocket } from "@/lib/socket";
import { getReviews } from "@/lib/reviews";
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

  const fetchAllSessions = async () => {
    if (!isExpertAuthenticated || !expertUser) {
      console.log("[AppointmentDebug] Not authenticated or no expert user. Authentication status:", isExpertAuthenticated);
      setLoading(false);
      return;
    }

    try {
      console.log("[AppointmentDebug] Fetching all sessions (chat + call) for expert user ID:", expertUser.id);

      // Fetch Chat & Call sessions (pending + completed), reviews and stats
      const [
        chatPendingRes,
        chatCompletedRes,
        callPendingRes,
        callCompletedRes,
        pujaRes,
        reviewsRes,
        statsRes
      ] = await Promise.all([
        api.get<any>("/chat/sessions/appointments/pending"),
        api.get<any>("/chat/sessions/appointments/completed"),
        api.get<any>("/call/sessions/appointments/pending"),
        api.get<any>("/call/sessions/appointments/completed"),
        api.get<any>("/puja-appointments/expert"),
        expertUser?.profileId ? getReviews(expertUser.profileId, 1, 50) : Promise.resolve([null, null] as [any, any]),
        getDashboardStats('today')
      ]);

      const getSessions = (result: [any | null, any | null]) => {
        const [data, error] = result;
        if (error || !data) return [];
        const payload = data?.data || data;
        return Array.isArray(payload) ? payload : [];
      };

      const chatPending = getSessions(chatPendingRes).map((s: any) => ({ ...s, _source: 'chat' }));
      const chatCompleted = getSessions(chatCompletedRes).map((s: any) => ({ ...s, _source: 'chat' }));
      const callPending = getSessions(callPendingRes).map((s: any) => ({ ...s, _source: 'call' }));
      const callCompleted = getSessions(callCompletedRes).map((s: any) => ({ ...s, _source: 'call' }));
      const pujaSessions = getSessions(pujaRes).map((s: any) => ({ ...s, _source: 'puja' }));

      const allSessions: any[] = [...chatPending, ...chatCompleted, ...callPending, ...callCompleted, ...pujaSessions];
      
      const [reviewsData, reviewsError] = reviewsRes;
      const reviews = (reviewsData as any)?.reviews || (reviewsData as any)?.data || reviewsData || [];


      // Deduplicate sessions by ID and Source (since IDs might overlap between chat and call)
      const uniqueSessionsMap = new Map();
      allSessions.forEach(session => {
        const key = `${session._source}_${session.id}`;
        if (!uniqueSessionsMap.has(key)) {
          uniqueSessionsMap.set(key, session);
        }
      });

      const uniqueSessions = Array.from(uniqueSessionsMap.values());

      // Sort by date (newest first)
      uniqueSessions.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      const mappedAppointments: Appointment[] = await Promise.all(uniqueSessions.map(async (session: any) => {
        let currentStatus = session.status;
        const source = session._source;

        // Match review if missing from session data
        let sessionReview = session.review;
        if (!sessionReview || !sessionReview.comment) {
          const matchingReview = reviews.find((r: any) =>
            (r.session_id || r.sessionId) === session.id ||
            (session.user?.name && r.user?.name === session.user?.name &&
              Math.abs(new Date(r.created_at || r.createdAt || 0).getTime() - new Date(session.created_at || session.createdAt || 0).getTime()) < 24 * 60 * 60 * 1000)
          );
          if (matchingReview) {
            sessionReview = {
              rating: matchingReview.rating,
              comment: matchingReview.comment
            };
          }
        }

        // Verification logic (placeholder for calls if needed, mostly for chat status sync)
        if (source === 'chat' && currentStatus === 'active') {
          try {
            const [verificationRes, verificationError] = await api.get<any>(`/chat/session/${session.id}?_t=${Date.now()}`);
            const verifiedPayload = verificationRes?.data ?? verificationRes;
            if (verifiedPayload && verifiedPayload.status) {
              currentStatus = verifiedPayload.status;
            }
          } catch (err) { }
        }

        const isCall = source === 'call';
        const isPuja = source === 'puja';
        const callTypeLabel = session.type === 'video' ? 'Video' : 'Voice';

        return {
          id: session.id,
          name: session.user?.name || "Client",
          avatar: session.user?.profile_picture || session.user?.avatar || session.user?.profilePicture,
          service: isPuja ? (session.puja?.name || "Puja Service") : (isCall ? `${callTypeLabel} Call` : "Chat Consultation"),
          date: isPuja ? (session.scheduled_date || session.created_at || new Date().toISOString()) : (session.created_at || session.createdAt || new Date().toISOString()),
          status: currentStatus,
          type: "new",
          reminder: false,
          meetingLink: isPuja ? `/puja-session/${session.id}` : (isCall ? (session.type === 'video' ? `/video/${session.id}` : `/call/${session.id}`) : `/chat/${session.id}`),
          sessionId: !isPuja ? session.id : undefined,
          clientId: session.client_id || session.userId || session.clientId,
          expiresAt: session.expires_at || session.expiresAt,
          isFree: !!(session.is_free ?? session.isFree),
          freeMinutes: session.free_minutes ?? session.freeMinutes ?? 0,
          durationMins: isPuja ? 0 : (() => {
            let d = session.duration_mins ?? session.durationMins ?? session.duration ?? session.duration_seconds / 60 ?? 0;
            if (d === 0 && (currentStatus === 'completed' || currentStatus === 'expired')) {
              const start = (session.activated_at || session.activatedAt || session.start_time) ? new Date(session.activated_at || session.activatedAt || session.start_time).getTime() : 0;
              const end = (session.ended_at || session.endedAt || session.end_time) ? new Date(session.ended_at || session.endedAt || session.end_time).getTime() : 0;
              if (start > 0 && end > 0) return Math.ceil((end - start) / (1000 * 60));
            }
            return Math.ceil(d);
          })(),
          review: sessionReview ? {
            rating: sessionReview.rating || 0,
            comment: sessionReview.comment || ""
          } : undefined,
          terminatedBy: session.terminated_by || session.terminatedBy,
          pujaId: isPuja ? session.puja_id : undefined,
          askExpertForDate: isPuja ? session.ask_expert_for_date : undefined,
          userMessage: isPuja ? session.user_message : undefined,
          expertMessage: isPuja ? session.expert_message : undefined,
          scheduledTime: isPuja ? session.scheduled_time : undefined,
          pujaMode: isPuja ? session.mode : undefined,
          price: session.price,
        };
      }));

      // Stats Logic
      const [statsData, statsError] = statsRes;
      if (statsData) {
        setStats(statsData);
      }

      console.log("[AppointmentDebug] Mapped appointments:", mappedAppointments);
      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("[AppointmentDebug] Failed to fetch sessions:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Socket Listeners
  useEffect(() => {
    console.log("[AppointmentDebug] useEffect triggered. Auth:", isExpertAuthenticated, "ExpertUser:", expertUser?.id);
    setLoading(true);
    fetchAllSessions();

    if (isExpertAuthenticated && expertUser) {
      // ... (socket listeners remain same)
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
          console.log("[AppointmentDebug] 'register_expert' (Chat) success:", response);
        });

        if (!callSocket.connected) {
          console.log("[AppointmentDebug] Attempting to connect CallSocket...");
          callSocket.connect();
        }
        console.log(`[AppointmentDebug] Emitting 'register_expert' (Call) for ID: ${rid}`);
        callSocket.emit('register_expert', { expertId: rid }, (response: any) => {
          console.log("[AppointmentDebug] 'register_expert' (Call) success:", response);
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
          avatar: session.user?.profile_picture || session.user?.avatar || session.user?.profilePicture,
          service: "Chat Consultation",
          date: session.created_at || session.createdAt || new Date().toISOString(),
          status: "pending",
          type: "new",
          reminder: false,
          meetingLink: `/chat/${session.id}`,
          sessionId: session.id,
          clientId: session.client_id || session.userId || session.clientId,
          expiresAt: session.expires_at || session.expiresAt,
          isFree: !!(session.is_free ?? session.isFree),
          freeMinutes: session.free_minutes ?? session.freeMinutes ?? 0,
          durationMins: session.duration_mins ?? session.durationMins ?? 0,
          review: session.review,
          terminatedBy: session.terminated_by || session.terminatedBy,
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

      const handleNewCallRequest = (data: any) => {
        const { session } = data;
        console.log("[AppointmentDebug] 🚨 New Real-time CALL Request RECEIVED via Socket:", session.id);

        const newAppt: Appointment = {
          id: session.id,
          name: session.user?.name || "Client",
          avatar: session.user?.profile_picture || session.user?.avatar || session.user?.profilePicture,
          service: session.type === 'video' ? "Video Call" : "Voice Call",
          date: session.created_at || session.createdAt || new Date().toISOString(),
          status: "pending",
          type: "new",
          reminder: false,
          meetingLink: session.type === 'video' ? `/video/${session.id}` : `/call/${session.id}`,
          sessionId: session.id,
          clientId: session.client_id || session.userId || session.clientId,
          expiresAt: session.expires_at || session.expiresAt,
          isFree: !!(session.is_free ?? session.isFree),
          freeMinutes: session.free_minutes ?? session.freeMinutes ?? 0,
          durationMins: session.duration_mins ?? session.durationMins ?? 0,
          review: session.review,
          terminatedBy: session.terminated_by || session.terminatedBy,
        };

        setAppointments(prev => {
          if (prev.some(a => a.id === newAppt.id)) return prev;
          return [newAppt, ...prev];
        });
      };

      const handleSessionEnded = (data: any) => {
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
      };

      const handleCallEnded = (data: any) => {
        console.log("[AppointmentDebug] 🏁 Call Ended Event received:", data);
        const targetId = data.id || data.sessionId;
        setAppointments(prev => prev.map(a => a.id === targetId ? { ...a, status: 'completed' as any } : a));
      };

      const handleCallAccepted = (data: any) => {
        console.log("[AppointmentDebug] ✅ Call Accepted Event received (Remote):", data);
        const targetId = (data.session?.id || data.id);
        if (!targetId) return;

        setAppointments(prev => prev.map(a =>
          a.id === targetId ? { ...a, status: 'active' as const } : a
        ));
      };

      chatSocket.on('new_chat_request', handleNewRequest);
      callSocket.on('new_call_request', handleNewCallRequest);

      // 3. Real-time update when session is ACTIVATED
      chatSocket.on('session_activated', (session: any) => {
        console.log("[AppointmentDebug] Session Activated:", session.id);
        setAppointments(prev => prev.map(a =>
          a.id === session.id ? { ...a, status: 'active' as const } : a
        ));
      });

      // 4. Real-time update when session is ENDED (completed or expired)
      chatSocket.on('session_ended', handleSessionEnded);
      callSocket.on('call_ended', handleCallEnded);
      callSocket.on('call_accepted', handleCallAccepted);

      return () => {
        console.log("[AppointmentDebug] Cleaning up socket listeners...");
        chatSocket.off('new_chat_request', handleNewRequest);
        chatSocket.off('session_activated');
        chatSocket.off('session_ended', handleSessionEnded);
        chatSocket.off('connect');

        callSocket.off('new_call_request', handleNewCallRequest);
        callSocket.off('call_accepted', handleCallAccepted);
        callSocket.off('call_ended', handleCallEnded);
      };
    }
  }, [isExpertAuthenticated, expertUser]);

  // Polling fallback for active sessions (in case socket event is missed during redirect)
  useEffect(() => {
    const hasActiveSession = appointments.some(a => a.status === 'active');

    if (hasActiveSession) {
      console.log("[AppointmentDebug] Active session detected, starting polling fallback...");
      const interval = setInterval(() => {
        fetchAllSessions();
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
          onUpdate={fetchAllSessions}
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


