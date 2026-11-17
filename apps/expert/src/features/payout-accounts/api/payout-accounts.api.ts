import apiV2 from "@/api/apiV2";
import { API_ROUTES } from "@/utils/api.routes";

const api = apiV2;

export interface InitiatePayoutOnboardingInput {
  providerCode?: string;
  redirectUri?: string;
}

export interface CompletePayoutOnboardingInput {
  onboardingId: number;
  accountHolderName?: string;
  accountNumber?: string;
  ifsc?: string;
  code?: string;
  state?: string;
}

export interface ExecutePayoutInput {
  payoutAccountId: number;
  amount: number;
  currencyCode?: string;
  narration?: string;
  idempotencyKey?: string;
}

export interface ReconcilePayoutsInput {
  statuses?: string[];
  limit?: number;
}

export interface PayoutAccountLink {
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
  accountNumberMasked: string | null;
  bankName: string | null;
  ifsc: string | null;
}

export interface InitiatePayoutOnboardingOutput {
  type: "form" | "redirect";
  url: string;
  state?: string;
  fields?: string[];
  onboardingId: number;
}

export interface CompletePayoutOnboardingOutput {
  accountId: number;
  status: string;
  providerReference: string;
}

export interface ExecutePayoutOutput {
  payoutId: number;
  providerPayoutReference: string;
  status: string;
}

export interface ReconcilePayoutsMismatch {
  payoutId: number;
  internalStatus: string;
  providerStatus: string;
  providerReference: string;
}

export interface ReconcilePayoutsError {
  payoutId: number;
  error: string;
}

export interface ReconcilePayoutsOutput {
  checked: number;
  updated: number;
  mismatches: ReconcilePayoutsMismatch[];
  errors: ReconcilePayoutsError[];
}

/** Initiate payout onboarding for an expert. */
export async function initiatePayoutOnboarding(
  input: InitiatePayoutOnboardingInput = {},
): Promise<{
  ok: boolean;
  data?: InitiatePayoutOnboardingOutput;
  error?: unknown;
}> {
  const result = await api.post<InitiatePayoutOnboardingOutput>(
    API_ROUTES.PAYOUT_ACCOUNTS.INITIATE,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

/** Complete payout onboarding for an expert. */
export async function completePayoutOnboarding(
  input: CompletePayoutOnboardingInput,
): Promise<{
  ok: boolean;
  data?: CompletePayoutOnboardingOutput;
  error?: unknown;
}> {
  const result = await api.post<CompletePayoutOnboardingOutput>(
    API_ROUTES.PAYOUT_ACCOUNTS.COMPLETE,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

/** List the expert's payout account links. */
export async function listPayoutAccountLinks(): Promise<{
  ok: boolean;
  data?: PayoutAccountLink[];
  error?: unknown;
}> {
  const result = await api.get<PayoutAccountLink[]>(
    API_ROUTES.PAYOUT_ACCOUNTS.LINKS,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

/** Execute a payout from the expert's linked payout account. */
export async function executePayout(input: ExecutePayoutInput): Promise<{
  ok: boolean;
  data?: ExecutePayoutOutput;
  error?: unknown;
}> {
  const result = await api.post<ExecutePayoutOutput>(
    API_ROUTES.PAYOUT_ACCOUNTS.PAYOUT,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

/** Reconcile internal payout records against provider state. */
export async function reconcilePayouts(
  input: ReconcilePayoutsInput = {},
): Promise<{
  ok: boolean;
  data?: ReconcilePayoutsOutput;
  error?: unknown;
}> {
  const result = await api.post<ReconcilePayoutsOutput>(
    API_ROUTES.PAYOUT_ACCOUNTS.RECONCILE,
    input,
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

/** Remove (unlink) a payout account from the expert. */
export async function removePayoutAccount(
  payoutAccountId: number,
): Promise<{ ok: boolean; error?: unknown }> {
  const result = await api.delete<{ removed: boolean }>(
    API_ROUTES.PAYOUT_ACCOUNTS.REMOVE(payoutAccountId),
    { body: { payoutAccountId } },
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}

/** Set a payout account as the expert's primary. */
export async function setPrimaryPayoutAccount(
  payoutAccountId: number,
): Promise<{ ok: boolean; error?: unknown }> {
  const apiURL = API_ROUTES.PAYOUT_ACCOUNTS.SET_PRIMARY(payoutAccountId);

  console.log({ apiURL });

  const result = await api.post<{ set: boolean }>(apiURL);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}
