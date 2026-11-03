"use client";

import { useEffect, useState } from "react";
import { type IExpert } from "@repo/lib";
import type { ChatSession } from "@/lib/types";
import type { ConsultationEndedPayload } from "@/realtime/types/consultation";
import type { useConsultation } from "@/realtime/hooks/use-consultation";
import { buildSessionSummary } from "../application/consultation-billing";

type RoomSessionSummaryParams = {
  expertData: IExpert;
  endedVerdict: ConsultationEndedPayload | null;
  pausedState: ReturnType<typeof useConsultation>["paused"];
  elapsedTime: number;
  balance: number;
  isFree: boolean;
  freeMinutes: number;
};

/**
 * End-of-session billing: per-minute chat rate, last server-reported consumed
 * amount (event latch — must persist after `pausedState` clears so the
 * end-summary bills what the server actually charged), and the derived
 * summary handed to SessionSummaryModal.
 */
export function useRoomSessionSummary({
  expertData,
  endedVerdict,
  pausedState,
  elapsedTime,
  balance,
  isFree,
  freeMinutes,
}: RoomSessionSummaryParams) {
  const [consumedAmount, setConsumedAmount] = useState(0);
  useEffect(() => {
    if (pausedState) setConsumedAmount(Number(pausedState.consumedAmount) || 0);
  }, [pausedState]);

  const { chatRate, sessionSummary } = buildSessionSummary({
    expertData,
    endedVerdict,
    pausedState,
    elapsedTime,
    balance,
    isFree,
    freeMinutes,
  });

  return { chatRate, sessionSummary };
}
