import api from "@/actions/api";
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
    "/expert/onboarding/status",
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<OnboardingStatus>(result.data) };
}

export async function completeOnboarding(): Promise<{
  ok: boolean;
  error?: unknown;
}> {
  const result = await api.post<{ data: OnboardingStatus }>(
    "/expert/onboarding/complete",
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}
