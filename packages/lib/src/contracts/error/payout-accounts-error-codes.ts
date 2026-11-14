/**
 * Error code contract for the payout accounts domain.
 * Matches backend DomainError codes thrown by payout-accounts use-cases.
 */
export const PayoutAccountsErrorCode = {
  PAYOUT_ONBOARDING_NOT_FOUND: "PAYOUT_ONBOARDING_NOT_FOUND",
  PAYOUT_ONBOARDING_ALREADY_COMPLETED: "PAYOUT_ONBOARDING_ALREADY_COMPLETED",
  PAYOUT_ONBOARDING_NO_PROVIDER_ACCOUNT: "PAYOUT_ONBOARDING_NO_PROVIDER_ACCOUNT",
  PROVIDER_ONBOARDING_COMPLETION_FAILED: "PROVIDER_ONBOARDING_COMPLETION_FAILED",
  PAYOUT_PROVIDER_ACCOUNT_NOT_CONFIGURED: "PAYOUT_PROVIDER_ACCOUNT_NOT_CONFIGURED",
  PAYOUT_ACCOUNT_NOT_LINKED: "PAYOUT_ACCOUNT_NOT_LINKED",
  PAYOUT_ACCOUNT_NOT_FOUND: "PAYOUT_ACCOUNT_NOT_FOUND",
  PAYOUT_ACCOUNT_NOT_ACTIVE: "PAYOUT_ACCOUNT_NOT_ACTIVE",
  NO_PROVIDER_ACCOUNT_CONFIGURED: "NO_PROVIDER_ACCOUNT_CONFIGURED",
  NO_FUND_ACCOUNT_REFERENCE: "NO_FUND_ACCOUNT_REFERENCE",
  PAYOUT_EXECUTION_FAILED: "PAYOUT_EXECUTION_FAILED",
} as const;

export type PayoutAccountsErrorCode =
  (typeof PayoutAccountsErrorCode)[keyof typeof PayoutAccountsErrorCode];

export const isPayoutAccountsErrorCode = (
  value: unknown,
): value is PayoutAccountsErrorCode =>
  typeof value === "string" &&
  (Object.prototype.hasOwnProperty.call(PayoutAccountsErrorCode, value) ||
    Object.values(PayoutAccountsErrorCode).includes(
      value as PayoutAccountsErrorCode,
    ));
