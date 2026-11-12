import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";
import type { ExpertAccount } from "@repo/lib/contracts/expert/account-api";
import type { Profession } from "../types";

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
export async function getProfessions(): Promise<Profession[] | null> {
  const result = await api.get<{ data: Profession[] }>(
    API_ROUTES.PROFESSIONS.LIST,
  );
  if (!result.ok) return null;
  return unwrap<Profession[]>(result.data);
}
