"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { toast } from "react-toastify";
import { verifyOtpAction } from "@/actions/auth";
import { Loading } from "@repo/ui";
import { useTranslations } from "next-intl";
import { User } from "@/lib/types";

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
  redirectUrl = "/client/profile",
  initialCountdown = 60,
}) => {
  const t = useTranslations("Auth");

  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      setOtpDigits(nextDigits);
      return;
    }

    // Handle paste of multiple characters into any box
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split("");
      const nextDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < 6) {
          nextDigits[index + i] = c;
        }
      });
      setOtpDigits(nextDigits);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal;
    setOtpDigits(nextDigits);

    // Auto advance focus
    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const nextDigits = [...otpDigits];
    pasted.split("").forEach((c, i) => {
      nextDigits[i] = c;
    });
    setOtpDigits(nextDigits);
    const nextFocus = Math.min(pasted.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;

    setIsLoading(true);
    try {
      if (onResend) {
        await onResend();
      }
      toast.success(t("signUp.otpSent"));
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error(t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");

    if (fullOtp.length !== 6) {
      toast.error(t("signUp.errors.otpRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpAction({
        email: email.trim(),
        otp: fullOtp,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(t("signUp.success"));
        if (onSuccess) {
          onSuccess(result.user);
        } else {
          // Clean page refresh to /client/profile to evaluate server cookies
          window.location.href = redirectUrl;
        }
      }
    } catch {
      toast.error(t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0 bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 my-0 transition-all duration-300 text-center">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div className="text-left">
            <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
              {t("signUp.welcome")}
            </h6>
            <span className="text-xl font-black text-orange block">
              {t("signIn.brandName")}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
              {t("signUp.alreadyAccount")}
            </h6>
            <Link
              href="/sign-in"
              className="text-base font-bold text-[#4A1D1F] hover:text-orange transition-all"
            >
              {t("signUp.signIn")}
            </Link>
          </div>
        </div>

        {/* Verification Icon & Titles */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange/10 text-orange rounded-3xl mb-4 text-2xl ring-8 ring-orange/5">
          <i className="fa-solid fa-envelope-circle-check" />
        </div>

        <h2 className="text-[26px] md:text-3xl font-black text-[#301118]">
          {t("signUp.otpTitle")}
        </h2>
        <p className="text-gray-600 text-xs md:text-sm mt-1.5 font-medium leading-relaxed">
          {t("signUp.otpSubtitle")}{" "}
          <span className="font-bold text-gray-900 block mt-0.5">{email}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 6-digit input boxes */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 ${
                  digit
                    ? "border-orange bg-orange/5 text-slate-900 shadow-sm"
                    : "border-gray-200 bg-white text-slate-900 focus:border-orange focus:ring-4 focus:ring-orange/10"
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isLoading || otpDigits.join("").length !== 6}
          >
            {isLoading ? t("signUp.verifyingOtp") : t("signUp.verifyOtp")}
          </button>

          {/* Resend OTP */}
          <div className="pt-2 text-xs font-semibold text-gray-500">
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

          {/* Optional Back Button */}
          {onBack && (
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="text-xs font-bold text-gray-500 hover:text-orange transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-[11px]" />
                {t("signUp.changeEmail")}
              </button>
            </div>
          )}
        </form>
      </div>

      {isLoading && <Loading fullScreen />}
    </>
  );
};

export default OtpVerification;
