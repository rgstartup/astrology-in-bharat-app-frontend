"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { setAuthCookies } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@repo/lib";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("verification_token");
  const { login } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const [countdown, setCountdown] = useState(5);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    if (verifyAttempted.current) return;

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please check your email link again.");
      return;
    }

    const performVerification = async () => {
      verifyAttempted.current = true;
      console.log("[VerifyEmail] Starting verification for token:", token.substring(0, 10) + "...");

      try {
        // Call the backend verification endpoint
        const [res, error] = await api.get<any>(`/auth/email/verify?token=${token}`);

        if (error) {
          console.error("[VerifyEmail] Verification error:", error);
          setStatus("error");
          setMessage(getErrorMessage(error) || "Email verification failed.");
          return;
        }

        console.log("[VerifyEmail] Verification successful:", res);

        // Extract data
        const accessToken = res.accessToken || res.token;
        const refreshToken = res.refreshToken;
        const user = res.user;

        if (accessToken) {
          // For merchants, fully registered means they have set a password and shop name
          // Agent-created merchants will have a name and 'merchant' role already.
          const isFullyRegistered = !!(user?.name && user?.roles?.includes('merchant'));

          if (isFullyRegistered) {
            // Set browser cookies for future SSR requests
            await setAuthCookies(accessToken, refreshToken);

            // Update the local auth store
            login(accessToken, user);

            setStatus("success");
            setMessage("Email verified successfully! Redirecting you to your dashboard...");

            // Start redirect countdown — router.replace must be OUTSIDE setState
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);

            // Redirect after 5 seconds separately
            setTimeout(() => {
              router.replace("/dashboard");
            }, 5000);
          } else {
            // New merchant — redirect to Complete Profile (Step 3)
            router.replace(`/register?token=${token}`);
          }
        } else {
          // No accessToken — this is a new merchant who needs to complete their profile
          // Redirect to register page Step 3 with the verification token
          router.replace(`/register?token=${token}`);
        }
      } catch (err: any) {
        console.error("[VerifyEmail] Critical catch error:", err);
        setStatus("error");
        setMessage(getErrorMessage(err) || "Something went wrong during verification. Please try again later.");
      }
    };

    performVerification();
  }, [token, router, login]);

  return (
    <div className="min-h-screen bg-[#FFF9F4] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-orange-700 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center relative z-10 border border-orange-100 overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF6B00] via-[#D4AF37] to-[#FF6B00]"></div>

        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4 ring-8 ring-orange-50/50">
            {status === "loading" && <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />}
            {status === "success" && <CheckCircle2 className="w-10 h-10 text-green-500" />}
            {status === "error" && <XCircle className="w-10 h-10 text-red-500" />}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Verify Email</h1>
        </div>

        <div className={`p-6 rounded-2xl mb-8 ${status === "loading" ? "bg-slate-50 text-slate-600" : status === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100" }`}>
          <p className="font-semibold text-lg leading-relaxed">{message}</p>
          {status === "success" && countdown > 0 && (
            <div className="mt-4 flex flex-col items-center">
              <span className="text-xs font-bold text-green-600/50">Redirecting in</span>
              <div className="text-4xl font-bold mt-1 text-green-600">{countdown}</div>
            </div>
          )}
        </div>

        {status === "error" && (
          <div className="space-y-4">
            <Link href="/login" className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <span>Return to Login</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-slate-400 font-medium">
              Didn't receive an email? Check your spam folder or contact support.
            </p>
          </div>
        )}

        {status === "success" && countdown === 0 && (
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full bg-green-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 flex flex-col items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <img src="/images/web-logo.png" alt="Astrology in Bharat" className="h-10 mb-2" />
        <p className="text-xs font-bold text-slate-400">Premium Merchant Hub</p>
      </div>
    </div>
  );
}
