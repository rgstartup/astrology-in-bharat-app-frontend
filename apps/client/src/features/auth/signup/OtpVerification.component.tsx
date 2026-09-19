"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { verifyOtpAction } from "@/actions/auth";
import { Loading } from "@repo/ui";
import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";
import { User } from "@/lib/types";
import { stripLocale } from "@/utils/getPathnameOrDefault";
import { useAuthStore } from "@/store/useAuthStore";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "../AuthHeader";

export interface OtpVerificationProps {
  email: string;
  onBack?: () => void;
  onResend?: () => Promise<void> | void;
  onSuccess?: (user?: User) => void;
  redirectUrl?: string;
  initialCountdown?: number;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onBack,
  onResend,
  onSuccess,
  redirectUrl = "/dashboard",
  initialCountdown = 60,
}) => {
  const router = useRouter();
  const init = useAuthStore((state) => state.init);
  const t = useTranslations("Auth");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);

  // Scroll to top on mount (especially useful on mobile)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;

    setIsLoading(true);
    try {
      if (onResend) {
        await onResend();
      }
      toast.success(t("signUp.otpSent"));
      setCountdown(60);
      setOtp("");
    } catch {
      toast.error(t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error(t("signUp.errors.otpRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpAction({
        email: email.trim(),
        otp,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(t("signUp.success"));
        // Fetch client profile into Zustand store now that cookies are set
        await init(true);

        if (onSuccess) {
          onSuccess(result.user);
        } else {
          router.refresh();
          router.push(stripLocale(redirectUrl));
        }
      }
    } catch {
      toast.error(t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto lg:mx-0 py-0">
      {/* Top Header */}
      <AuthHeader subtitle={t("signUp.header")} />

      {/* Clean Verification Message Notification Bar */}
      <div className="mb-7 sm:mb-7 flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
            <MailCheck className="size-4.5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-900 leading-snug">
              {t("signUp.otpSentTitle")}
            </p>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate leading-snug mt-0.5">
              {email}
            </p>
          </div>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-orange hover:text-[#EA580C] hover:underline shrink-0 px-2 py-1 rounded-md transition-colors cursor-pointer"
            title={t("signUp.changeEmail")}
          >
            {t("signUp.edit")}
          </button>
        )}
      </div>

      {/* OTP Form with Shadcn InputOTP */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="flex justify-center w-full">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern={REGEXP_ONLY_DIGITS}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full h-11 sm:h-11.5 rounded-full bg-gradient-to-r from-orange to-[#EA580C] hover:from-orange/95 hover:to-[#C2410C] text-white text-sm font-bold shadow-md shadow-orange/20 hover:shadow-lg hover:shadow-orange/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>{t("signUp.verifyingOtp")}</span>
            </>
          ) : (
            <span>{t("signUp.verifyOtp")}</span>
          )}
        </Button>

        {/* Resend OTP */}
        <div className="text-center pt-1 text-xs font-medium text-stone-500">
          {countdown > 0 ? (
            <p>
              {t("signUp.resendIn")}{" "}
              <span className="text-orange font-bold font-mono">
                {countdown}s
              </span>
            </p>
          ) : (
            <p>
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-orange font-bold hover:underline cursor-pointer disabled:opacity-50 ml-1"
              >
                {t("signUp.resendOtp")}
              </button>
            </p>
          )}
        </div>

        {/* Contact Support Link */}
        <div className="text-center pt-2.5 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            {t("signUp.troubleRegistering")}{" "}
            <Link
              href={PATHS.HELP}
              className="font-bold text-orange hover:text-[#EA580C] underline-offset-2 hover:underline transition-colors"
            >
              {t("signUp.contactSupport")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
