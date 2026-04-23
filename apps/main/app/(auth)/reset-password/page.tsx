"use client";

import React, { useState, FormEvent, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@repo/auth-client";
import { authTranslations } from "@/lib/translations/auth";
import { RiLockPasswordFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const t = authTranslations.en;

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error(t.resetPassword.errors.invalidToken);
      router.push("/sign-in");
    }
  }, [token, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!password) { toast.error(t.resetPassword.errors.required); return; }
    if (password !== confirmPassword) { toast.error(t.resetPassword.errors.match); return; }
    if (password.length < 6) { toast.error(t.resetPassword.errors.length); return; }

    setIsLoading(true);
    try {
      const { error } = await authClient.resetPassword({ newPassword: password, token: token! });
      if (error) {
        toast.error(error.message || t.resetPassword.errors.unexpected);
      } else {
        toast.success(t.resetPassword.successMessage);
        setIsSuccess(true);
        setTimeout(() => router.push("/sign-in"), 3000);
      }
    } catch {
      toast.error(t.resetPassword.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <section className="relative py-24 bg-[#FFF9F4] min-h-screen flex items-center overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -ml-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -mr-48 -mb-48 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex justify-center">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 p-10 md:p-14 w-full">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-[2.5rem] mb-6 text-orange text-3xl shadow-lg ring-8 ring-orange/5">
                <RiLockPasswordFill />
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{t.resetPassword.title}</h2>
              <p className="text-slate-400 text-sm font-medium italic">{t.resetPassword.subtitle}</p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t.resetPassword.passwordLabel}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"} id="password"
                        className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 focus:border-orange focus:ring-8 focus:ring-orange/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-bold text-sm bg-slate-50/50"
                        placeholder={t.resetPassword.passwordPlaceholder}
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                      />
                      <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange transition-colors" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t.resetPassword.confirmPasswordLabel}</label>
                    <input
                      type={showPassword ? "text" : "password"} id="confirmPassword"
                      className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 focus:border-orange focus:ring-8 focus:ring-orange/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-bold text-sm bg-slate-50/50"
                      placeholder={t.resetPassword.confirmPasswordPlaceholder}
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-5 rounded-2xl bg-orange text-white text-xs uppercase tracking-[0.35em] font-black shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.45)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center gap-3">
                    {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {isLoading ? t.resetPassword.resetting : t.resetPassword.submit}
                    {!isLoading && <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>}
                  </span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-8">
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-[2.5rem] mb-4 text-green-500 text-5xl border-4 border-white shadow-xl">
                  <i className="fa-solid fa-circle-check"></i>
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">{t.resetPassword.successTitle}</h3>
                  <p className="text-slate-400 font-medium italic">{t.resetPassword.successMessage}</p>
                </div>
                <div className="pt-4">
                  <Link href="/sign-in" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all">
                    {t.resetPassword.goToSignIn}
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F4] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
