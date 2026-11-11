/**
 * Error code contract for the expert auth domain.
 */
export const ExpertAuthErrorCode = {
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_INCORRECT: "OTP_INCORRECT",
  OTP_MAX_ATTEMPTS_EXCEEDED: "OTP_MAX_ATTEMPTS_EXCEEDED",
  OTP_NOT_FOUND: "OTP_NOT_FOUND",
} as const;

export type ExpertAuthErrorCode =
  (typeof ExpertAuthErrorCode)[keyof typeof ExpertAuthErrorCode];

export const isExpertAuthErrorCode = (
  value: unknown,
): value is ExpertAuthErrorCode =>
  typeof value === "string" &&
  (Object.prototype.hasOwnProperty.call(ExpertAuthErrorCode, value) ||
    Object.values(ExpertAuthErrorCode).includes(
      value as ExpertAuthErrorCode,
    ));
