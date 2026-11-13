import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";

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

export interface BankLinkSummary {
  id: number;
  paymentProvider: string;
  providerProduct: string;
  onboardingStatus: string;
  accountStatus: string | null;
  externalAccountId: string | null;
  isActive: boolean;
  isPrimary: boolean;
  activatedAt: string | null;
  createdAt: string;
}

export interface InitiateBankLinkInput {
  redirectUri?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifsc?: string;
}

export interface InitiateBankLinkOutput {
  type: 'redirect' | 'form';
  url: string;
  state?: string;
  fields?: string[];
}

export interface CompleteBankLinkInput {
  code?: string;
  state?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifsc?: string;
}

export interface CompleteBankLinkOutput {
  externalAccountId: string;
  status: string;
}

export interface RefreshBankLinkStatusOutput {
  id: number;
  onboardingStatus: string;
  accountStatus: string | null;
  isActive: boolean;
}

/** Initiate payout-account linking.
 * Razorpay Partner: returns hosted redirect URL.
 * RazorpayX: returns form spec for frontend to render bank details input.
 */
export async function initiateBankLink(
  input: InitiateBankLinkInput = {},
): Promise<{
  ok: boolean;
  data?: InitiateBankLinkOutput;
  error?: unknown;
}> {
  const result = await api.post<{ data: InitiateBankLinkOutput }>(
    API_ROUTES.BANK_LINKS.INITIATE,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<InitiateBankLinkOutput>(result.data) };
}

/** Complete payout-account linking.
 * Razorpay Partner: exchanges OAuth code for tokens.
 * RazorpayX: creates RazorpayX contact + fund account from bank details.
 */
export async function completeBankLink(
  input: CompleteBankLinkInput,
): Promise<{
  ok: boolean;
  data?: CompleteBankLinkOutput;
  error?: unknown;
}> {
  const result = await api.post<{ data: CompleteBankLinkOutput }>(
    API_ROUTES.BANK_LINKS.COMPLETE,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<CompleteBankLinkOutput>(result.data) };
}

/** List the expert's payout account links. */
export async function listBankLinks(): Promise<{
  ok: boolean;
  data?: BankLinkSummary[];
  error?: unknown;
}> {
  const result = await api.get<{ data: BankLinkSummary[] }>(
    API_ROUTES.BANK_LINKS.ROOT,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<BankLinkSummary[]>(result.data) };
}

/** Refresh payout account link status from provider. */
export async function refreshBankLinkStatus(): Promise<{
  ok: boolean;
  data?: RefreshBankLinkStatusOutput;
  error?: unknown;
}> {
  const result = await api.post<{ data: RefreshBankLinkStatusOutput }>(
    API_ROUTES.BANK_LINKS.REFRESH_STATUS,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: unwrap<RefreshBankLinkStatusOutput>(result.data) };
}

/** Validate penny-drop amount (RazorpayX direct API flow). */
export async function validatePennyDrop(
  validationId: string,
  amount: number,
): Promise<{ ok: boolean; error?: unknown }> {
  const result = await api.post(API_ROUTES.BANK_LINKS.VALIDATE_PENNY_DROP, {
    validationId,
    amount,
  });
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}

/** Delete / unlink payout account. */
export async function deleteBankLink(
  payoutPlatformAccountId?: number,
): Promise<{
  ok: boolean;
  error?: unknown;
}> {
  const url = payoutPlatformAccountId
    ? `${API_ROUTES.BANK_LINKS.ROOT}?payoutPlatformAccountId=${payoutPlatformAccountId}`
    : API_ROUTES.BANK_LINKS.ROOT;
  const result = await api.delete(url);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}

/** Set which linked payout account is primary for this expert. */
export async function setPrimaryBankLink(
  payoutPlatformAccountId: number,
): Promise<{ ok: boolean; error?: unknown }> {
  const result = await api.post(API_ROUTES.BANK_LINKS.SET_PRIMARY, {
    payoutPlatformAccountId,
  });
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}
