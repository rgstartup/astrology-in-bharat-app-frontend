"use server";

import { api } from "@/actions";
import { getErrorMessage, type IExpert } from "@repo/lib";
import { formatSpecializationsString } from "@/utils/expert-utils";

export interface ChatEligibility {
  isEligibleForFree: boolean;
  freeMinutes: number;
  hasBalance: boolean;
  minBalanceRequired: number;
  currentBalance: number;
  chatPrice: number;
  expertIsAvailable: boolean;
}

export interface ChatEligibilityResponse {
  success?: boolean;
  error?: string;
  data?: ChatEligibility | null;
}

export async function getChatEligibilityAction(
  expertId: string | number,
): Promise<ChatEligibilityResponse> {
  try {
    const [res, error] = await api.get<ChatEligibility>(
      `/chat/eligibility?expert_id=${expertId}`,
    );
    if (error) {
      return { error: getErrorMessage(error) || "Failed to check eligibility" };
    }
    return { success: true, data: res ?? null };
  } catch (err) {
    return { error: (err as Error)?.message || "Failed to check eligibility" };
  }
}

export interface SomeoneElseData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
}

export interface InitiateChatResponse {
  success?: boolean;
  error?: string;
  data?: { id: number | string } | null;
  existingSessionId?: string;
  existingExpertId?: string;
}

export async function initiateChatAction(
  expertId: string | number,
  metadata: SomeoneElseData | null,
): Promise<InitiateChatResponse> {
  try {
    const [res, error] = await api.post<{ id: number | string }>(
      "/chat/initiate",
      { expert_id: expertId, metadata },
    );
    if (error) {
      const data = (error as { data?: unknown }).data as
        | { existingSessionId?: string; existingExpertId?: string }
        | undefined;
      if (data?.existingSessionId && data?.existingExpertId) {
        return {
          existingSessionId: data.existingSessionId,
          existingExpertId: data.existingExpertId,
        };
      }
      return { error: getErrorMessage(error) || "Failed to start chat" };
    }
    return { success: true, data: res ?? null };
  } catch (err) {
    return { error: (err as Error)?.message || "Failed to start chat" };
  }
}

export interface ChatPrepExpertResponse {
  success?: boolean;
  error?: string;
  data?: Partial<IExpert> | null;
}

/**
 * Fetch expert for chat prep via canonical /experts/:id,
 * falling back to /expert/account/:id (mirrors call prep).
 */
export async function getChatPrepExpertAction(
  expertId: string | number,
): Promise<ChatPrepExpertResponse> {
  try {
    let [res, fetchError] = await api.get<any>(`/experts/${expertId}`);
    if (fetchError || !res) {
      const [fallbackRes, fallbackErr] = await api.get<any>(
        `/expert/account/${expertId}`,
      );
      if (!fallbackErr && fallbackRes) {
        res = fallbackRes;
        fetchError = null;
      }
    }
    if (fetchError || !res) {
      return { error: "Failed to fetch expert" };
    }
    const data = res?.data || res;
    return {
      success: true,
      data: {
        id: data.id,
        name: data.user?.name || data.name || "Expert",
        avatar:
          data.user?.avatar || data.avatar || "/images/dummy-expert.jpg",
        specialization: formatSpecializationsString(
          data.specializations || data.specialization || data.expertise,
        ),
        experience_in_years: data.experience_in_years ?? data.experience ?? 0,
        price: Number(data.price || data.chat_price || 0),
        chat_price: Number(data.chat_price || data.price || 0),
        call_price: Number(data.call_price || data.price || 0),
        video_call_price: Number(
          data.video_call_price || (data.price ? data.price * 2 : 0),
        ),
        languages: Array.isArray(data.languages)
          ? data.languages.join(", ")
          : data.languages || "Hindi, English",
        rating: Number(data.ratings ?? data.rating ?? 5),
        is_available: data.is_available ?? false,
      },
    };
  } catch (err) {
    return { error: (err as Error)?.message || "Failed to fetch expert" };
  }
}
