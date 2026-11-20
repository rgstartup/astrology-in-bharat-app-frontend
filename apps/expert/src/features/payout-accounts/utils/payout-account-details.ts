export type PayoutAccountType = 'bank_account' | 'vpa' | 'wallet' | 'card' | 'other';

export interface PayoutAccountDisplay {
  type: PayoutAccountType;
  accountLabel: string;
  secondary: string; // IFSC for bank_account, brand for card
}

/**
 * Derives a human-readable account label + secondary detail from the
 * polymorphic `details` JSONB. Falls back to `externalAccountId` when no
 * type-specific keys are present.
 */
export function payoutAccountDisplay(
  details: Record<string, unknown> | null,
  externalAccountId: string | null,
): PayoutAccountDisplay {
  if (!details) {
    return {
      type: 'other',
      accountLabel: externalAccountId ?? '—',
      secondary: '—',
    };
  }

  if (details.account_number_masked != null) {
    return {
      type: 'bank_account',
      accountLabel: `•••• ${details.account_number_masked}`,
      secondary: details.ifsc != null ? String(details.ifsc) : '—',
    };
  }

  if (details.vpa_id != null) {
    return { type: 'vpa', accountLabel: String(details.vpa_id), secondary: '—' };
  }

  if (details.wallet_handle != null) {
    return { type: 'wallet', accountLabel: String(details.wallet_handle), secondary: '—' };
  }

  if (details.last4 != null) {
    return {
      type: 'card',
      accountLabel: `•••• ${details.last4}`,
      secondary: details.brand != null ? String(details.brand) : '—',
    };
  }

  return {
    type: 'other',
    accountLabel: externalAccountId ?? '—',
    secondary: '—',
  };
}
