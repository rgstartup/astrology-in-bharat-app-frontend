"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Button,
} from "@repo/design/shadcn";
import { MailCheck, Loader2, ShieldAlert, ArrowLeft } from "lucide-react";

const REGEXP_ONLY_DIGITS = "^[0-9]+$";

const slotClassName =
  "h-11 w-10 sm:h-12 sm:w-11 rounded-xl border-2 border-stone-300 bg-white text-stone-900 text-base sm:text-lg font-bold shadow-2xs hover:border-stone-400 first:rounded-xl last:rounded-xl first:border-2 ring-stone-200 transition-all";

export interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onResend: () => Promise<void>;
  onVerify: (otp: string) => Promise<void>;
  loading?: boolean;
  errorMessage?: string;
}

/**
 * OtpVerification component for the Expert Portal.
 * Renders a 6-digit OTP entry form with countdown resend and validation state.
 *
 * @param props - Component configuration props
 * @returns React component for verifying 6-digit email OTP
 */
export const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onBack,
  onResend,
  onVerify,
  loading = false,
  errorMessage,
}) => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending || loading) return;
    setIsResending(true);
    try {
      await onResend();
      setCountdown(60);
      setOtp("");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || loading || isResending) return;
    await onVerify(otp);
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-[28px] font-semibold text-stone-900 tracking-tight mb-2 sm:mb-1.5">
          Verify Your Email
        </h1>
        <p className="text-base sm:text-sm text-stone-500 leading-normal">
          Enter the 6-digit code sent to your email to complete verification.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-3.5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Target Email Badge */}
      <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
            <MailCheck className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-900 leading-snug">
              Verification Code Sent
            </p>
            <p className="text-xs text-stone-500 font-medium truncate leading-snug">
              {email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm sm:text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline shrink-0 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="size-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex justify-center w-full py-1">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern={REGEXP_ONLY_DIGITS}
            autoFocus
          >
            <InputOTPGroup className="gap-1.5 sm:gap-2">
              <InputOTPSlot index={0} className={slotClassName} />
              <InputOTPSlot index={1} className={slotClassName} />
              <InputOTPSlot index={2} className={slotClassName} />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-0.5 sm:mx-1 text-stone-400" />
            <InputOTPGroup className="gap-1.5 sm:gap-2">
              <InputOTPSlot index={3} className={slotClassName} />
              <InputOTPSlot index={4} className={slotClassName} />
              <InputOTPSlot index={5} className={slotClassName} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || isResending || otp.length !== 6}
          className="w-full h-14 sm:h-12 lg:h-10 rounded-2xl lg:rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-base lg:text-sm font-semibold shadow-sm hover:shadow active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 lg:size-4 animate-spin text-white" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>Verify & Sign In</span>
          )}
        </Button>

        {/* Resend Countdown */}
        <div className="text-center pt-1 text-sm sm:text-xs font-medium text-stone-500">
          {countdown > 0 ? (
            <p>
              Resend code in{" "}
              <span className="text-amber-600 font-bold font-mono">
                {countdown}s
              </span>
            </p>
          ) : (
            <p className="flex items-center justify-center gap-1">
              <span>Didn&apos;t receive code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || loading}
                className="text-amber-600 font-bold hover:underline cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isResending ? (
                  <>
                    <Loader2 className="size-3 animate-spin text-amber-600" />
                    <span>Resending...</span>
                  </>
                ) : (
                  <span>Resend Code</span>
                )}
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
