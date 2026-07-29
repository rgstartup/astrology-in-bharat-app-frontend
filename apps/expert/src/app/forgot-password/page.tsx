"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { Button } from "@repo/ui";
import { ForgotPasswordSchema, ForgotPasswordFormData } from "@/types/auth";
import { expertForgotPasswordAction } from "@/actions/auth";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const BrandingSection = () => (
  <div className="relative hidden lg:block h-full min-h-[500px]">
    <div className="absolute inset-0 bg-orange-600/95 flex flex-col items-center justify-center text-white p-12 text-center">
      <div className="relative w-48 h-48 mb-8 drop-shadow-2xl">
        <Image
          src="/images/Expert.png"
          alt="Expert Community"
          fill
          sizes="(max-width: 1024px) 100vw, 384px"
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-3xl font-black mb-4 tracking-tight">Security First</h1>
      <p className="text-white/80 font-medium max-w-xs">
        We'll help you get back to your expert profile safely and quickly.
      </p>
    </div>
  </div>
);

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setServerError("");

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const result = await expertForgotPasswordAction(data.email, origin);

      if (result.success) {
        setIsSent(true);
        toast.success("Reset link sent! Please check your inbox.");
      } else {
        setServerError(result.error || "Failed to send reset link.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setServerError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9F4] items-center justify-center p-4 sm:p-6 font-sans">
      <Head>
        <title>Forgot Password | Astrology in Bharat</title>
      </Head>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-premium bg-white border border-gray-100">
        <BrandingSection />

        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recovery</h2>
            <p className="mt-2 text-gray-500 font-medium italic">Regain access to your account</p>
          </div>

          {!isSent ? (
            <>
              {serverError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-bold">{serverError}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Registered Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-600'}`} />
                    </div>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border ${errors.email ? 'border-red-300' : 'border-gray-200 group-focus-within:border-orange-500'} rounded-2xl text-gray-900 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
                      placeholder="expert@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl shadow-lg shadow-orange-600/20 font-black text-sm uppercase tracking-widest"
                >
                  Request Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-gray-900">Email Dispatched!</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                  We've sent recovery instructions to <br /> 
                  <span className="text-emerald-600 font-bold not-italic">{getValues("email")}</span>
                </p>
              </div>
              <div className="pt-4 space-y-4">
                <button
                  className="w-full py-4 px-6 rounded-2xl border-2 border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest hover:border-orange-200 hover:text-orange-600 transition-all"
                  onClick={() => setIsSent(false)}
                >
                  Resend Email
                </button>
                <Link href="/" className="block w-full py-4 px-6 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
