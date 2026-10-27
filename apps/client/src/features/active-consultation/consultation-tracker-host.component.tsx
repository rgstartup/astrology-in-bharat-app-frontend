"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useConsultationRoomStore } from "@/store/consultationRoomStore";
import { realtimeSocket } from "@/realtime/socket";
import {
  CONSULTATION_EVENTS,
  getConsultationStatus,
  joinConsultationRooms,
  leaveConsultationRooms,
} from "@/realtime/topics/consultation";
import { ConsultationTrackerCard } from "./components/consultation-tracker-card.component";

/**
 * Room route owner check. Matches `/consultation/[id]` only — not
 * `/dashboard/consultations` (different segment).
 *
 * @param pathname - Locale-stripped pathname from `usePathname`.
 * @returns True when inside the consultation room route.
 */
function isConsultationRoomPath(pathname: string): boolean {
  return pathname === "/consultation" || pathname.startsWith("/consultation/");
}

/**
 * Builds the deep link back into the consultation room.
 *
 * @param expertId - Carried as `expertId` query (the room cannot resolve
 * expert-from-consultation yet — no consultation-detail endpoint exists).
 * @param sessionId - Live session id, omitted when unknown.
 * @param consultationId - Room route owner, set by the chat prep modal.
 * @returns Relative room href with query string.
 */
function buildRoomHref(expertId: string, sessionId: number | null, consultationId: number): string {
  const params = new URLSearchParams();
  if (sessionId !== null && !Number.isNaN(sessionId)) params.set("sessionId", String(sessionId));
  params.set("expertId", expertId);
  const query = params.toString();
  if (!query) return `/consultation/${consultationId}`;
  return `/consultation/${consultationId}?${query}`;
}

/**
 * Global floating tracker: reads from the global consultation room store
 * (single source of truth written by the room component). Owns the socket
 * subscription for the stored session (join + state refresh + end/pause/resume)
 * so the card stays truthful even after the room unmounts.
 * 
 * On mount, verifies the stored consultation is still active with the server.
 * Clears stale sessions (completed/rejected/cancelled) immediately.
 */
export default function ConsultationTrackerHost() {
  const consultationId = useConsultationRoomStore((s) => s.consultationId);
  const sessionId = useConsultationRoomStore((s) => s.sessionId);
  const expertId = useConsultationRoomStore((s) => s.expertId);
  const sessionStatus = useConsultationRoomStore((s) => s.sessionStatus);
  const mode = useConsultationRoomStore((s) => s.mode);
  const setPaused = useConsultationRoomStore((s) => s.setPaused);
  const clear = useConsultationRoomStore((s) => s.clear);
  const pathname = usePathname();
  const router = useRouter();

  const isRoom = isConsultationRoomPath(pathname);
  // Only show tracker when consultation is ACTIVE (expert accepted)
  // sessionStatus === "active" means expert has accepted and consultation is live
  const isActive = sessionStatus === "active";

  // Listen for real-time updates ONLY when outside the consultation room.
  // When inside the room, RoomContent directly manages socket lifecycle and store updates.
  useEffect(() => {
    if (!consultationId || !isActive || isRoom) return;
    const socket = realtimeSocket();
    if (!socket.connected) socket.connect();

    const match = (p: { consultationId: number | string }): boolean =>
      Number(p?.consultationId) === consultationId;

    const handleEnded = (p: { consultationId: number | string }) => {
      if (match(p)) {
        leaveConsultationRooms(consultationId).catch(() => undefined);
        clear();
      }
    };
    const handlePaused = (p: { consultationId: number | string }) => {
      if (match(p)) setPaused(true);
    };
    const handleResumed = (p: { consultationId: number | string }) => {
      if (match(p)) setPaused(false);
    };
    const refresh = () => {
      joinConsultationRooms(consultationId, mode ?? "chat")
        .then(() => getConsultationStatus(consultationId))
        .then((status) => {
          if (!status) {
            clear();
            return;
          }
          if (status.state === "completed" || status.state === "rejected" || status.state === "cancelled") {
            leaveConsultationRooms(consultationId).catch(() => undefined);
            clear();
            return;
          }
          setPaused(status.state === "paused");
        })
        .catch(() => {
          clear();
        });
    };

    refresh();
    socket.on(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on("connect", refresh);
    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off("connect", refresh);
      leaveConsultationRooms(consultationId).catch(() => undefined);
    };
  }, [consultationId, isActive, isRoom, mode, clear, setPaused]);

  const handleReturn = useCallback(() => {
    if (!expertId || !consultationId) return;
    router.push(buildRoomHref(expertId, sessionId, consultationId));
  }, [router, expertId, sessionId, consultationId]);

  if (!isActive || isRoom) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[60]">
      <ConsultationTrackerCard
        onReturn={handleReturn}
      />
    </div>
  );
}
