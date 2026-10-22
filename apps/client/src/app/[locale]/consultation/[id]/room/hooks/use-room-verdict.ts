"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import type { ChatEndedPayload, JoinChatAck } from "@/realtime/types/chat";

export type RoomSessionStatus = "pending" | "active" | "completed";

const TERMINAL_REDIRECT = ["rejected", "cancelled", "expired", "missed"];

type VerdictDeps = {
  decision: string | null;
  endedVerdict: ChatEndedPayload | null;
  joinedStatus: string | null;
  endLiveChat: () => Promise<unknown>;
};

/**
 * Owns room status. Live verdicts drive transitions, but the authoritative
 * join-ack status covers (re)joins after the verdict already fired.
 */
export const useRoomVerdict = ({ decision, endedVerdict, joinedStatus, endLiveChat }: VerdictDeps) => {
  const router = useRouter();
  const [sessionStatus, setSessionStatus] = useState<RoomSessionStatus>("pending");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (decision === "accepted") setSessionStatus("active");
  }, [decision]);

  useEffect(() => {
    if (!joinedStatus) return;
    if (joinedStatus === "accepted" || joinedStatus === "active") {
      setSessionStatus("active");
      return;
    }
    if (joinedStatus === "completed") {
      setSessionStatus("completed");
      setShowModal(true);
      return;
    }
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
