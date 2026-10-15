"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useConsultationTrackerStore } from "@/store/consultationTrackerStore";
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
 * Global floating tracker: renders the live-consultation card on every
 * page except the chat room itself. Owns the socket subscription for the
 * stored session (join + state refresh + end/pause/resume) so the card
 * stays truthful even after the room unmounts.
 */
export default function ConsultationTrackerHost() {
  const session = useConsultationTrackerStore((s) => s.session);
  const consultationId = session?.consultationId ?? null;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (consultationId === null) return;
    if (isConsultationRoomPath(pathname)) return;
    const store = useConsultationTrackerStore.getState();
    const socket = realtimeSocket();
    if (!socket.connected) socket.connect();

    const match = (p: { consultationId: number | string }): boolean =>
      Number(p?.consultationId) === consultationId;

    const handleEnded = (p: { consultationId: number | string }) => {
      if (match(p)) {
        leaveConsultationRooms(consultationId).catch(() => undefined);
        store.clearSession();
      }
    };
    const handlePaused = (p: { consultationId: number | string }) => {
      if (match(p)) store.setPaused(true);
    };
    const handleResumed = (p: { consultationId: number | string }) => {
      if (match(p)) store.setPaused(false);
    };
    const refresh = () => {
      joinConsultationRooms(consultationId)
        .then(() => getConsultationStatus(consultationId))
        .then((status) => {
          if (!status) return;
          if (status.state === "completed" || status.state === "rejected" || status.state === "cancelled") {
            leaveConsultationRooms(consultationId).catch(() => undefined);
            store.clearSession();
            return;
          }
          store.setPaused(status.state === "paused");
        })
        .catch(() => undefined);
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
  }, [consultationId, pathname]);

  const handleReturn = useCallback(() => {
    const current = useConsultationTrackerStore.getState().session;
    if (!current) return;
    router.push(buildRoomHref(current.expertId, current.sessionId, current.consultationId));
  }, [router]);

  if (!session) return null;
  if (isConsultationRoomPath(pathname)) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[60]">
      <ConsultationTrackerCard
        expertName={session.expertName}
        expertAvatar={session.expertAvatar}
        startedAt={session.startedAt}
        paused={session.paused}
        onReturn={handleReturn}
      />
    </div>
  );
}
