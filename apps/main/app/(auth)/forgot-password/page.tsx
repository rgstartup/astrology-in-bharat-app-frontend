"use client";

import NextImage from "next/image";
import NextLink from "next/link";
const Image = NextImage as any;
const Link = NextLink as any;
import React, { useState, FormEvent, Suspense } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { useLanguageStore } from "@/store/languageStore";
import { authTranslations } from "@/lib/translations/auth";

const ForgotPasswordContent: React.FC = () => {
    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;

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
                origin: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL
            });

            if (fetchError) {
                toast.error(fetchError.body?.message || fetchError.message || t.forgotPassword.errors.failed);
            } else {
                toast.success(data?.message || t.forgotPassword.success);
                setIsSent(true);
            }
        } catch {
            toast.error(t.forgotPassword.errors.unexpected);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative py-4 md:py-8 bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat min-h-[80vh] flex items-center overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 relative z-10 w-full">
                <div className="flex justify-center">
                    <div className="w-full max-w-[480px]">
                        <div className="bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 mb-16">
                            <div className="text-center mb-8">
                                <h2
                                    className="text-3xl font-black text-black mb-3"
                                    style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                >
                                    {t.forgotPassword.title}
                                </h2>
                                <p
                                    className="text-gray-400 text-sm font-medium leading-relaxed"
                                    style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                >
                                    {t.forgotPassword.subtitle}
                                </p>
                            </div>

                            {!isSent ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-[11px] font-black text-black mb-2 uppercase tracking-wider">
                                            {t.forgotPassword.emailLabel}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-50 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-200 text-black font-semibold text-sm"
                                            placeholder={t.forgotPassword.emailPlaceholder}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {t.forgotPassword.sending}
                                            </span>
                                        ) : t.forgotPassword.submit}
                                    </button>

                                    <div className="flex justify-center pt-2">
                                        <Link href="/sign-in" className="text-xs font-black text-gray-400 hover:text-orange transition-all flex items-center gap-2 uppercase tracking-widest">
                                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                                            {t.forgotPassword.backToSignIn}
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full">
                                        <i className="fa-solid fa-circle-check text-green-500 text-4xl"></i>
                                    </div>
                                    <h3
                                        className="text-2xl font-black text-black mb-2"
                                        style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                    >
                                        {t.forgotPassword.checkEmail}
                                    </h3>
                                    <p
                                        className="text-gray-500 text-sm leading-relaxed mb-8"
                                        style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                    >
                                        {t.forgotPassword.sentMessage.replace("{email}", "")} <strong className="text-black font-black">{email}</strong>. {t.forgotPassword.sentMessage.split("{email}")[1]}
                                    </p>
                                    <div className="space-y-4">
                                        <button
                                            className="w-full py-3.5 rounded-2xl border-2 border-gray-100 text-gray-400 text-sm font-black hover:bg-gray-50 hover:border-gray-200 transition-all uppercase tracking-widest"
                                            onClick={() => setIsSent(false)}
                                        >
                                            {t.forgotPassword.resend}
                                        </button>
                                        <Link
                                            href="/sign-in"
                                            className="block w-full py-4 rounded-2xl bg-[#301118] text-white text-sm font-black shadow-[0_8px_20px_rgba(48,17,24,0.15)] hover:shadow-[0_12px_25px_rgba(48,17,24,0.25)] hover:-translate-y-0.5 transition-all uppercase tracking-[0.15em]"
                                        >
                                            {t.forgotPassword.backToSignIn}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Page: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
};

export default Page;
