import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";
import type { ExpertAccount, ProfessionItem, SpecializationItem } from "@repo/lib/contracts/expert/account-api";

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

/** Fetch the expert's account profile from /expert/account. */
export async function getAccount(): Promise<ExpertAccount | null> {
  const result = await api.get<{ data: ExpertAccount }>(
    API_ROUTES.ACCOUNT.ROOT,
  );
  if (!result.ok) return null;
  return unwrap<ExpertAccount>(result.data);
}

/** Fetch active professions for onboarding step 0. */
export async function getProfessions(): Promise<ProfessionItem[] | null> {
  const result = await api.get<{ data: ProfessionItem[] }>(
    API_ROUTES.PROFESSIONS.LIST,
  );
  if (!result.ok) return null;
  return unwrap<ProfessionItem[]>(result.data);
}

/** Fetch specializations available for the expert's professions. */
export async function getAvailableSpecializations(): Promise<
  SpecializationItem[] | null
> {
  const result = await api.get<{ data: SpecializationItem[] }>(
    API_ROUTES.SPECIALIZATIONS.AVAILABLE,
  );
  if (!result.ok) return null;
  return unwrap<SpecializationItem[]>(result.data);
}
