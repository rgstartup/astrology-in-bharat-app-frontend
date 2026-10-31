"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@repo/design/shadcn";
import type { ChatEndedPayload } from "@/realtime/types/chat";

export type RoomSessionStatus = "pending" | "active" | "completed";

const TERMINAL_REDIRECT = ["rejected", "cancelled", "expired", "missed"];
// Completed is NOT a redirect - user should see history/summary
const COMPLETED_STATES = ["completed"];

type VerdictDeps = {
  decision: string | null;
  endedVerdict: ChatEndedPayload | null;
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
  const [sessionStatus, setSessionStatus] =
    useState<RoomSessionStatus>("pending");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("[VoiceConsultation] verdict effect fired", {
      decision,
      joinedStatus,
    });
    if (
      decision === "accepted" ||
      (joinedStatus &&
        (joinedStatus === "accepted" || joinedStatus === "active"))
    ) {
      console.log("[VoiceConsultation] sessionStatus -> active", {
        reason:
          decision === "accepted"
            ? "decision=accepted"
            : `joinedStatus=${joinedStatus}`,
      });
      setSessionStatus("active");
      // Continue-consultation re-accept clears a prior ended-state dialog.
      setShowModal(false);
    }
  }, [decision, joinedStatus]);

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
    if (TERMINAL_REDIRECT.includes(joinedStatus)) router.push("/");
  }, [joinedStatus, router]);

  useEffect(() => {
    if (!endedVerdict) return;
    setSessionStatus("completed");
    setShowModal(true);
  }, [endedVerdict]);

  const handleEndChat = (force = false) => {
    void force;
    endLiveChat()
      .then((ack) => {
        const status = (ack as { status?: string } | undefined)?.status;
        if (status && status !== "ended" && status !== "ignored") {
          toast.error("Failed to end chat. Please try again.");
          return;
        }
        setSessionStatus("completed");
        setShowModal(true);
      })
      .catch(() => toast.error("Failed to end chat. Please try again."));
  };

  return { sessionStatus, showModal, setShowModal, handleEndChat };
};
