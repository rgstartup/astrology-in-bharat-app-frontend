"use client";
import React, { useState, useEffect, Suspense } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { Button, Loading } from "@repo/ui";
import { ResetPasswordSchema, ResetPasswordFormData } from "@/types/auth";
import { expertResetPasswordAction } from "@/actions/auth";

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
      <h1 className="text-3xl font-black mb-4 tracking-tight">Vault Secure</h1>
      <p className="text-white/80 font-medium max-w-xs italic">
        "Your security is our priority. Set a strong password to protect your professional profile."
      </p>
    </div>
  </div>
);

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("password_reset_token") || searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/");
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setLoading(true);
    setServerError("");

    try {
      const result = await expertResetPasswordAction(data.password, token);

      if (result.success) {
        setIsSuccess(true);
        toast.success("Password reset successful!");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setServerError(result.error || "Failed to reset password. Link may be expired.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setServerError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-[#FFF9F4] items-center justify-center p-4 sm:p-6 font-sans">
      <Head>
        <title>Reset Password | Astrology in Bharat</title>
      </Head>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-premium bg-white border border-gray-100">
        <BrandingSection />

        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">New Password</h2>
            <p className="mt-2 text-gray-500 font-medium">Update your credentials securely</p>
          </div>

          {!isSuccess ? (
            <>
              {serverError && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-bold">{serverError}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-600'}`} />
                    </div>
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`block w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border ${errors.password ? 'border-red-300' : 'border-gray-200 group-focus-within:border-orange-500'} rounded-2xl text-gray-900 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
                      placeholder="Min. 6 chars (A-Z, 0-9)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 group-focus-within:text-orange-600'}`} />
                    </div>
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`block w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200 group-focus-within:border-orange-500'} rounded-2xl text-gray-900 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl shadow-lg shadow-orange-600/20 font-black text-sm uppercase tracking-widest"
                >
                  Reset My Password
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
                <h3 className="text-xl font-black text-gray-900">Success!</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                  Your password has been successfully updated. <br />
                  <span className="text-emerald-600 font-bold not-italic">Redirecting you to login...</span>
                </p>
              </div>
              <div className="pt-4">
                <Link href="/" className="block w-full py-4 px-6 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg">
                  Login Immediately
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={
      <Loading fullScreen />
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;


