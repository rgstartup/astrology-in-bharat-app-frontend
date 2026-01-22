"use client";

import React, { useState, useEffect } from "react";
import AppointmentStats from "./AppointmentStats";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentList from "./AppointmentList";
import AppointmentCalendar from "./AppointmentCalendar";
import RescheduleModal from "./RescheduleModal";
import { Appointment } from "./types";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { chatSocket } from "@/lib/socket";

export default function AppointmentsPage() {
  const { user: expertUser, isAuthenticated: isExpertAuthenticated } = useAuth();

  useEffect(() => {
    if (expertUser) {
      console.log("[AppointmentDebug] Full expertUser structure:", JSON.stringify(expertUser, null, 2));
    }
  }, [expertUser]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const fetchChatSessions = async () => {
    if (!isExpertAuthenticated || !expertUser) {
      console.log("[AppointmentDebug] Not authenticated or no expert user. Authentication status:", isExpertAuthenticated);
      setLoading(false);
      return;
    }

    try {
      console.log("[AppointmentDebug] Fetching pending chat sessions for expert user ID:", expertUser.id);
      const response = await apiClient.get("/chat/sessions/pending");
      console.log("[AppointmentDebug] Fetch response data:", response.data);

      const chatAppointments: Appointment[] = response.data.map((session: any) => ({
        id: session.id,
        name: session.user?.name || "Client",
        service: "Chat Consultation",
        date: session.createdAt || new Date().toISOString(),
        status: session.status, // Use backend status directly (pending, active, completed, expired)
        type: "new",
        reminder: false,
        meetingLink: `/chat/${session.id}`,
        sessionId: session.id,
        clientId: session.clientId,
      }));

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

        const newAppt: Appointment = {
          id: session.id,
          name: session.user?.name || "Client",
          service: "Chat Consultation",
          date: session.createdAt || new Date().toISOString(),
          status: "pending",
          type: "new",
          reminder: false,
          meetingLink: `/chat/${session.id}`,
          sessionId: session.id,
          clientId: session.clientId || session.userId,
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
            a.id === targetId ? { ...a, status: (data.status === 'expired' ? 'expired' : 'completed') as any } : a
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
      <AppointmentStats />

      {/* Filters & View Toggles */}
      <AppointmentFilters view={view} setView={setView} />

      {/* Appointment List or Calendar */}
      {view === "list" ? (
        <AppointmentList
          appointments={appointments}
          onReschedule={openRescheduleModal}
        />
      ) : (
        <AppointmentCalendar appointments={appointments} />
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
