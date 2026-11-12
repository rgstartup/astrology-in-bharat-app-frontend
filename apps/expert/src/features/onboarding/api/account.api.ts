import api from "@/actions/api";
import type { ExpertAccount } from "@repo/lib/contracts/expert/account-api";

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
  const result = await api.get<{ data: ExpertAccount }>("/expert/account");
  if (!result.ok) return null;
  return unwrap<ExpertAccount>(result.data);
}
