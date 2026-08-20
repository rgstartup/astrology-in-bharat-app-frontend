"use client";

import NextImage from "next/image";
import NextLink from "next/link";
const Image = NextImage as any;
const Link = NextLink as any;
import React, { useState, FormEvent, Suspense } from "react";
import { toast } from "react-toastify";
import { api } from "@/actions";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";
import { RiMailSendFill, RiArrowLeftLine } from "react-icons/ri";
import { getErrorMessage } from "@repo/lib";

const ForgotPasswordContent: React.FC = () => {
  const { lang } = useLanguageStore();
  const t =
    authTranslations[lang as keyof typeof authTranslations] ||
    authTranslations.en;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t.forgotPassword.errors.required);
      return;
    }

    setIsLoading(true);

    try {
      const [data, fetchError] = await api.post<any>(`/auth/forgot/password`, {
        email,
        origin:
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL,
      });

      if (fetchError) {
        toast.error(
          getErrorMessage(fetchError) || t.forgotPassword.errors.failed,
        );
      } else {
        toast.success(data?.message || t.forgotPassword.success);
        setIsSent(true);
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || t.forgotPassword.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-24 bg-[#FFF9F4] min-h-screen flex items-center overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -ml-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -mr-48 -mb-48 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex justify-center">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 p-10 md:p-14 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-[2.5rem] mb-6 text-orange text-3xl shadow-lg ring-8 ring-orange/5 animate-bounce-slow">
                <RiMailSendFill />
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {t.forgotPassword.title}
              </h2>
              <p className="text-slate-400 text-sm font-medium italic">
                {t.forgotPassword.subtitle}
              </p>
            </div>

            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2"
                  >
                    {t.forgotPassword.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 focus:border-orange focus:ring-8 focus:ring-orange/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-bold text-sm bg-slate-50/50 hover:bg-white"
                    placeholder={t.forgotPassword.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-6">
                  <button
                    type="submit"
                    className="group relative w-full py-5 rounded-2xl bg-orange text-white text-xs uppercase tracking-[0.35em] font-black shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.45)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : null}
                      {isLoading
                        ? t.forgotPassword.sending
                        : t.forgotPassword.submit}
                      {!isLoading && (
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
                      )}
                    </span>
                  </button>

                  <div className="flex justify-center pt-2">
                    <Link
                      href="/sign-in"
                      className="group text-[10px] font-black text-slate-400 hover:text-orange transition-all flex items-center gap-2 uppercase tracking-[0.25em] no-underline"
                    >
                      <RiArrowLeftLine className="text-sm group-hover:-translate-x-1 transition-transform" />
                      {t.forgotPassword.backToSignIn}
                    </Link>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-8 animate-in zoom-in duration-500">
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-[2.5rem] mb-4 text-green-500 text-5xl border-4 border-white shadow-xl">
                  <i className="fa-solid fa-circle-check"></i>
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">
                    {t.forgotPassword.checkEmail}
                  </h3>
                  <p className="text-slate-400 font-medium italic text-sm leading-relaxed">
                    {t.forgotPassword.sentMessage.split("{email}")[0]}{" "}
                    <span className="text-slate-900 font-black underline decoration-orange/30 underline-offset-4">
                      {email}
                    </span>
                    . {t.forgotPassword.sentMessage.split("{email}")[1]}
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  <button
                    className="w-full py-4 rounded-xl border-2 border-slate-100 text-slate-400 text-[10px] font-black hover:bg-slate-50 hover:border-slate-200 transition-all uppercase tracking-[0.25em]"
                    onClick={() => setIsSent(false)}
                  >
                    {t.forgotPassword.resend}
                  </button>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center w-full py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all uppercase tracking-[0.25em] no-underline"
                  >
                    {t.forgotPassword.backToSignIn}
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

const Page: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F4] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
};

export default Page;
