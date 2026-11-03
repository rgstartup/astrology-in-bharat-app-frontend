"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@repo/design/shadcn";
import { useConsultationRoomStore } from "@/features/consultation/stores/consultation-room.store";
import { useVoiceSessionStore } from "@/features/consultation/stores/voice-session.store";
import type { ConsultationEndedPayload } from "@/realtime/types/consultation";
import { determineSessionStatus, shouldRedirect } from "../application/consultation-verdict";

export type RoomSessionStatus = "pending" | "active" | "completed";

const COMPLETED_STATES = ["completed"];

type VerdictDeps = {
  decision: string | null;
  endedVerdict: ConsultationEndedPayload | null;
  joinedStatus: string | null;
  endLiveChat: () => Promise<unknown>;
};

/**
 * Owns room status. Live verdicts drive transitions, but the authoritative
 * join-ack status covers (re)joins after the verdict already fired.
 *
 * For completed consultations, show the room with history - do NOT redirect.
 */
export const useRoomVerdict = ({
  decision,
  endedVerdict,
  joinedStatus,
  endLiveChat,
}: VerdictDeps) => {
  const router = useRouter();
  const clearConsultationRoom = useConsultationRoomStore((s) => s.clear);
  const resetVoiceSession = useVoiceSessionStore((s) => s.reset);
  const [sessionStatus, setSessionStatus] =
    useState<RoomSessionStatus>("pending");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("[VoiceConsultation] verdict effect fired", {
      decision,
      joinedStatus,
    });
    const next = determineSessionStatus({ decision, endedVerdict, joinedStatus });
    if (next === "active") {
      console.log("[VoiceConsultation] sessionStatus -> active", {
        reason:
          decision === "accepted"
            ? "decision=accepted"
            : `joinedStatus=${joinedStatus}`,
      });
      setSessionStatus("active");
      // Continue-consultation re-accept clears a prior ended-state dialog.
      setShowModal(false);
    } else if (next === "completed") {
      setSessionStatus("completed");
      setShowModal(true);
    }
  }, [decision, endedVerdict, joinedStatus]);

  useEffect(() => {
    if (!joinedStatus) return;
    if (joinedStatus === "accepted" || joinedStatus === "active") {
      setSessionStatus("active");
      return;
    }
    if (COMPLETED_STATES.includes(joinedStatus)) {
      setSessionStatus("completed");
      setShowModal(true);
      return;
    }
    // Only redirect for truly terminal states where there's no history to view
    if (shouldRedirect(joinedStatus)) router.push("/");
  }, [joinedStatus, router]);

  useEffect(() => {
    if (!endedVerdict) return;
    setSessionStatus("completed");
    setShowModal(true);
  }, [endedVerdict]);

  const handleEndChat = (force = false) => {
    console.log("[VoiceConsultation] handleEndChat BEFORE", { force });
    void force;
    endLiveChat()
      .then((ack) => {
        const status = (ack as { status?: string } | undefined)?.status;
        console.log("[VoiceConsultation] handleEndChat endLiveChat ack received", {
          status,
        });
        if (status && status !== "ended" && status !== "ignored") {
          toast.error("Failed to end chat. Please try again.");
          return;
        }
        setSessionStatus("completed");
        setShowModal(true);
        console.log("[VoiceConsultation] handleEndChat calling clearConsultationRoom() + resetVoiceSession()");
        // Tear down RTC session and clear cached voice tokens so a
        // subsequent restart starts with a clean slate.
        void clearConsultationRoom();
        void resetVoiceSession();
        console.log("[VoiceConsultation] handleEndChat cleanup dispatched — AFTER state changes will be logged by store actions");
      })
      .catch(() => {
        console.log("[VoiceConsultation] handleEndChat endLiveChat threw");
        toast.error("Failed to end chat. Please try again.");
      });
  };

  return { sessionStatus, showModal, setShowModal, handleEndChat };
};
