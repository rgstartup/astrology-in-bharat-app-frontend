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
import { getReviews } from "@/lib/reviews";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard";
import { TableSkeleton, StatsSkeleton } from "../dashboard/DashboardSkeletons";

export default function AppointmentsPage() {
  const { user: expertUser, isAuthenticated: isExpertAuthenticated } = useAuthStore();

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
      setLoading(false);
      return;
    }

    try {
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

      const getSessions = (result: any) => {
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
          name: session.user?.name || session.client?.user?.name || session.client?.name || "Client",
          avatar: session.client?.profile_picture || session.client?.avatar || session.user?.profile_picture || session.user?.avatar || session.user?.profile_client?.profile_picture || session.client?.user?.profile_picture || session.client?.user?.avatar || session.user_image || session.user_avatar || session.image,
          service: isPuja ? (session.puja?.name || "Puja Service") : (isCall ? `${callTypeLabel} Call` : "Chat Consultation"),
          date: isPuja ? (session.scheduled_date || session.created_at || new Date().toISOString()) : (session.created_at || session.createdAt || new Date().toISOString()),
          status: currentStatus,
          type: "new",
          reminder: false,
          meetingLink: isPuja ? `/dashboard/puja-session/${session.id}` : `/dashboard/consultations/${session.consultation_id || session.consultationId || session.id}`,
          sessionId: !isPuja ? session.id : undefined,
          clientId: session.client_id || session.userId || session.clientId,
          expiresAt: session.expires_at || session.expiresAt,
          isFree: !!(session.is_free ?? session.isFree),
          freeMinutes: session.free_minutes ?? session.freeMinutes ?? 0,
          durationMins: isPuja ? 0 : (() => {
            let parsedD = Number(session.duration_mins ?? session.durationMins ?? session.duration ?? ((session.duration_seconds || 0) / 60));
            
            let finalDuration = 0;
            if (!parsedD || isNaN(parsedD) || parsedD === 0) {
              if (currentStatus === 'completed' || currentStatus === 'expired') {
                const sTemp = session.activated_at || session.activatedAt || session.start_time;
                const eTemp = session.ended_at || session.endedAt || session.end_time;
                const start = sTemp ? new Date(sTemp).getTime() : 0;
                const end = eTemp ? new Date(eTemp).getTime() : 0;
                
                if (start > 0 && end > 0 && !isNaN(start) && !isNaN(end)) {
                  const diff = Math.ceil((end - start) / (1000 * 60));
                  finalDuration = isNaN(diff) ? 0 : diff;
                }
              }
            } else {
              finalDuration = Math.ceil(parsedD);
            }

            return finalDuration;
          })(),
          review: sessionReview ? {
            rating: Number(sessionReview.rating) || 0,
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

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("[AppointmentDebug] Failed to fetch sessions:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    setLoading(true);
    fetchAllSessions();
  }, [isExpertAuthenticated, expertUser]);

  // Polling fallback for active sessions (in case status changed during redirect)
  useEffect(() => {
    const hasActiveSession = appointments.some(a => a.status === 'active');

    if (hasActiveSession) {
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

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <AppointmentStats stats={stats} />
      )}

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
      {loading ? (
        <TableSkeleton />
      ) : view === "list" ? (
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
