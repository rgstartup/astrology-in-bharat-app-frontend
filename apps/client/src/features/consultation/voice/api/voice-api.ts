import { apiV2, API_ROUTES } from "@/actions";
import { ConsultationMode } from "@/store/consultationPrepStore";
import { getAccessToken } from "@/actions/cookie";

/** Check if the expert is eligible for a voice consultation. */
export async function checkVoiceEligibilityAction(expertId: number | string) {
  const accessToken = await getAccessToken();

  return apiV2
    .extend({
      headers: {
        Cookie: `${accessToken}`,
      },
    })
    .post<{
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
  const accessToken = await getAccessToken();

  return apiV2
    .extend({
      headers: {
        Cookie: `${accessToken}`,
      },
    })
    .post<{ consultationId: number }>(API_ROUTES.CONSULTATION.INITIATE, {
      expert_id: Number(expertId),
      mode,
      ...(consultationId != null ? { consultation_id: consultationId } : {}),
    });
}
