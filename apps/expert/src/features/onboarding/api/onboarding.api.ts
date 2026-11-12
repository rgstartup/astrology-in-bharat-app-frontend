import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";
import type { OnboardingStatus } from "../types";

function unwrap<T>(res: unknown): T {
  const maybe = res as { data?: T } | T;
  if (
    maybe &&
    typeof maybe === "object" &&
    "data" in maybe &&
    (maybe as { data?: unknown }).data !== undefined
  ) {
    return (maybe as { data: T }).data;
  }
  return maybe as T;
}

export async function getOnboardingStatus(): Promise<{
  ok: boolean;
  data?: OnboardingStatus;
  error?: unknown;
}> {
  const result = await api.get<{ data: OnboardingStatus }>(
    API_ROUTES.ONBOARDING.STATUS,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<OnboardingStatus>(result.data) };
}

export async function completeOnboarding(): Promise<{
  ok: boolean;
  error?: unknown;
}> {
  const result = await api.post<{ data: OnboardingStatus }>(
    API_ROUTES.ONBOARDING.COMPLETE,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}
