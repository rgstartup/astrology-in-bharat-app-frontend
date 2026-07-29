"use client";
import React, { useEffect, useState, Suspense } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { expertVerifyEmailAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@repo/lib";
import { Loading } from "@repo/ui";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const BrandingSection = () => (
  <div className="relative hidden lg:block h-full min-h-[500px]">
    <div className="absolute inset-0 bg-orange-600/95 flex flex-col items-center justify-center text-white p-12 text-center">
      <div className="relative w-48 h-48 mb-8 drop-shadow-2xl">
        <Image
          src="/images/Expert.png"
          alt="Expert Community"
          fill
          sizes="192px"
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-3xl font-black mb-4 tracking-tight">Email Verified</h1>
      <p className="text-white/80 font-medium max-w-xs italic">
        "Your journey as an expert begins here. Secure your legacy and connect with seekers."
      </p>
    </div>
  </div>
);

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const token = searchParams.get("verification_token") || searchParams.get("token");
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your stellar alignment...");
  const [countdown, setCountdown] = useState(3);
  const isVerifying = React.useRef(false);

  useEffect(() => {
    if (!token || isVerifying.current) {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token. Please check your email link.");
      }
      return;
    }

    isVerifying.current = true;
    const verifyEmail = async () => {
      try {
        const result = await expertVerifyEmailAction(token);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.success) {
          const isFullyRegistered = !!result.user?.name;

          if (isFullyRegistered) {
              if (result.user) {
                await login("", result.user);
              }
              setStatus("success");
              setMessage("Your email has been successfully verified! Prepare for takeoff.");
              toast.success("Verification successful!");

              const timer = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/dashboard");
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
          } else {
              // Redirect to Complete Profile
              router.push(`/register?token=${token}`);
          }
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(getErrorMessage(err) || "Verification link may be expired or invalid.");
        toast.error("Verification failed.");
      }
    };

    verifyEmail();
  }, [token, router, login]);

  return (
    <div className="flex min-h-screen bg-[#FFF9F4] items-center justify-center p-4 sm:p-6 font-sans">
      <Head>
        <title>Verify Email | Astrology in Bharat</title>
      </Head>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-premium bg-white border border-gray-100">
        <BrandingSection />

        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white text-center sm:text-left">
          {status === "verifying" && (
            <div className="flex flex-col items-center sm:items-start">
              <Loading size="lg" text="Authenticating..." />
              <p className="mt-4 text-gray-500 font-medium italic">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center sm:items-start animate-in zoom-in slide-in-from-bottom-4 duration-500">
              <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-[24px] flex items-center justify-center mb-8 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Registration Complete</h2>
              <p className="mt-4 text-gray-600 font-medium leading-relaxed italic">{message}</p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                  Redirecting in {countdown}s
                </div>
                <Link 
                  href="/dashboard"
                  className="flex items-center text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors group"
                >
                  Go to Dashboard 
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center sm:items-start animate-in fade-in duration-500">
              <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-[24px] flex items-center justify-center mb-8 border border-rose-100 shadow-sm">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase">Access Denied</h2>
              <p className="mt-4 text-rose-600 font-bold bg-rose-50 px-4 py-3 rounded-2xl border border-rose-100 text-sm leading-relaxed">
                {message}
              </p>
              
              <div className="mt-10 w-full space-y-4">
                <Link 
                  href="/"
                  className="block w-full py-4 text-center bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <VerifyEmailContent />
    </Suspense>
  );
}


