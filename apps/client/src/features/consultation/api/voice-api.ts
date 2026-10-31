"use client";

import { apiV2, API_ROUTES } from "@/actions";
import { ConsultationMode } from "@/store/consultationPrepStore";
/** Check if the expert is eligible for a voice consultation. */
export async function checkVoiceEligibilityAction(expertId: number | string) {
  return apiV2.post<{
    voicePrice: number;
    expertIsAvailable: boolean;
    hasBalance: boolean;
    isEligibleForFree: boolean;
  }>(API_ROUTES.VOICE.ELIGIBILITY, { expertId });
}

/** Initiate a voice consultation with the given expert. */
export async function initiateConsultationAction(
  expertId: number | string,
  mode: ConsultationMode,
  consultationId?: number,
) {
  return apiV2.post<{ consultationId: number }>(
    API_ROUTES.CONSULTATION.INITIATE,
    {
      expert_id: Number(expertId),
      mode,
      ...(consultationId != null ? { consultation_id: consultationId } : {}),
    },
  );
}
