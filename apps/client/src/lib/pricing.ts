import { type IExpert } from "@repo/lib";
import { type ConsultationMode } from "@/store/consultationPrepStore";

/**
 * Resolves per-minute price for the specified consultation mode.
 *
 * @param expert - Expert profile data.
 * @param mode - Requested consultation mode ('chat' | 'voice' | 'video').
 * @returns Per-minute cost in INR.
 */
export function resolveModePrice(
  expert: Partial<IExpert> | null,
  mode: ConsultationMode,
): number {
  if (!expert) return 0;
  if (mode === "voice") {
    return (
      expert.pricing?.call_price ??
      (expert as any).call_price ??
      expert.price ??
      0
    );
  }
  if (mode === "video") {
    const baseChatPrice =
      expert.pricing?.chat_price ??
      (expert as any).chat_price ??
      expert.price ??
      0;
    return (
      expert.pricing?.video_call_price ??
      (expert as any).video_call_price ??
      (baseChatPrice > 0 ? baseChatPrice * 2 : 0)
    );
  }
  return (
    expert.pricing?.chat_price ??
    (expert as any).chat_price ??
    expert.price ??
    0
  );
}

/**
 * Resolves the per-minute chat rate from expert data with waterfall fallbacks.
 *
 * @param expert - The expert object.
 * @returns Rate per minute in INR.
 */
export const resolveChatRate = (
  expert: IExpert | null | undefined,
): number => {
  if (!expert) return 0;
  if (expert.pricing?.chat_price !== undefined) {
    return Number(expert.pricing.chat_price) || 0;
  }

  const dynamicExpert = expert as Record<string, unknown>;
  if (typeof dynamicExpert.chat_price === "number") {
    return dynamicExpert.chat_price;
  }
  if (typeof dynamicExpert.price === "number") {
    return dynamicExpert.price;
  }
  return 0;
};

/**
 * Resolves the per-minute voice rate from expert data.
 * No hardcoded default: returns 0 when pricing is absent so the UI
 * never displays a rate the backend would not bill. While a voice
 * upgrade is active the backend-quoted price (see `useSwitchToVoice`)
 * takes precedence over this static value.
 *
 * @param expert - The expert object.
 * @returns Rate per minute in INR, or 0 when unknown.
 */
export const resolveVoiceRate = (
  expert: IExpert | null | undefined,
): number => {
  if (!expert) return 0;
  if (expert.pricing?.call_price !== undefined) {
    return Number(expert.pricing.call_price) || 0;
  }
  return 0;
};
