"use client";

import { useCallback, useRef, useState } from "react";
import {
  cancelConsultation,
  CONSULTATION_EVENTS,
} from "@/realtime/topics/consultation";
import { realtimeSocket } from "@/realtime/socket";
import type { ConsultationDecisionPayload } from "@/realtime/types/chat";
import type { ConsultationVerdict, WaitOutcome } from "../types";

export interface VerdictWaitResult {
  verdict: ConsultationVerdict;
  payload?: ConsultationDecisionPayload;
}

/**
 * Headroom so the server-owned expiry (cron sweep, up to ~10s granularity)
 * wins the verdict race. The local timer is a silent fallback only.
 */
const SERVER_LAG_GRACE_SEC = 15;

/**
 * One-shot wait for the expert's accept/reject verdict on a pending request:
 * socket listener lifecycle, waiting flags, and user-initiated cancel.
 */
export function useVerdictWait() {
  const [isWaitingForExpert, setIsWaitingForExpert] = useState(false);
  const [waitOutcome, setWaitOutcome] = useState<WaitOutcome>(null);
  const waitResolveRef = useRef<((v: ConsultationVerdict) => void) | null>(
    null,
  );
  const waitConsultationRef = useRef<number | null>(null);

  const waitForVerdict = useCallback(
    (consultationId: number, timeoutSec: number) =>
      new Promise<VerdictWaitResult>((resolve) => {
        const socket = realtimeSocket();
        const match = (p: { consultationId: number | string }) =>
          Number(p?.consultationId) === consultationId;
        const cleanup = () => {
          clearTimeout(timer);
          socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
          socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
          waitResolveRef.current = null;
          waitConsultationRef.current = null;
        };

        const timer = setTimeout(
          () => {
            cleanup();
            resolve({ verdict: "expired" });
          },
          Math.max(timeoutSec, 10) * 1000,
        );

        const onAccepted = (p: ConsultationDecisionPayload) => {
          if (match(p)) {
            cleanup();
            resolve({ verdict: "accepted", payload: p });
          }
        };

        const onRejected = (p: {
          consultationId: number | string;
          reason?: string;
        }) => {
          if (match(p)) {
            cleanup();
            resolve({
              verdict: p?.reason === "request_timeout" ? "timeout" : "rejected",
            });
          }
        };

        waitResolveRef.current = (v) => {
          cleanup();
          resolve({ verdict: v });
        };
        waitConsultationRef.current = consultationId;
        socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
        socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
      }),
    [],
  );

  const cancelWaiting = useCallback(() => {
    const consultationId = waitConsultationRef.current;
    waitResolveRef.current?.("cancelled");
    if (consultationId != null) {
      cancelConsultation(consultationId).catch(() => undefined);
    }
  }, []);

  const clearWaiting = useCallback(() => {
    setWaitOutcome(null);
    setIsWaitingForExpert(false);
  }, []);

  /**
   * Full request-window wait with server-lag grace: drives the waiting flag
   * and records the non-accept outcome for the modal.
   */
  const waitVerdict = async (
    consultationId: number,
    expiresInSec: number,
  ): Promise<VerdictWaitResult> => {
    setIsWaitingForExpert(true);
    try {
      const res = await waitForVerdict(
        consultationId,
        expiresInSec + SERVER_LAG_GRACE_SEC,
      );
      if (res.verdict === "rejected") {
        setWaitOutcome("rejected");
      } else if (res.verdict === "timeout" || res.verdict === "expired") {
        setWaitOutcome("timeout");
      }
      return res;
    } finally {
      setIsWaitingForExpert(false);
    }
  };

  return {
    isWaitingForExpert,
    waitOutcome,
    waitVerdict,
    cancelWaiting,
    clearWaiting,
  };
}
