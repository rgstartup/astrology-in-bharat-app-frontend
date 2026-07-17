"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaEnvelopeOpenText } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { verifyEmailAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@repo/lib";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const VerifyEmailContent: React.FC = () => {
    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;
    const { login } = useAuthStore();

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('verification_token') || searchParams.get('token');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(3);
    const isVerifying = React.useRef(false);

    useEffect(() => {
        if (!token || isVerifying.current) {
            if (!token) {
                setError(t.resetPassword.errors.invalidToken);
                setIsLoading(false);
            }
            return;
        }

        isVerifying.current = true;
        const verifyEmail = async () => {

            try {
                const result = await verifyEmailAction(token);

                if (result.error) {
                    setError(result.error);
                } else if (result.success) {
                    setSuccessMessage(result.message || t.verifyEmail.successMessage);
                    
                    // Handle automatic login only if they are fully registered
                    const isFullyRegistered = !!result.user?.name;
                    if (result.user && isFullyRegistered) {
                        login(result.user);
                    }

                    let currentCountdown = 3;
                    const countdownInterval = setInterval(() => {
                        currentCountdown -= 1;
                        if (currentCountdown <= 0) {
                            clearInterval(countdownInterval);
                            setCountdown(0);
                            
                            // Role-based Redirection
                            const roles = result.user?.roles || [];
                            const isExpert = roles.some((r: unknown) => 
                                ["expert", "expert", "Expert", "Expert", "EXPERT"].includes(String(r))
                            );

                            if (!result.user?.name) {
                                // User needs to complete profile (Step 3)
                                router.push(`/register?token=${token}`);
                            } else if (isExpert) {
                                const dashboardUrl = process.env.NEXT_PUBLIC_EXPERT_DASHBOARD_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3003' : window.location.origin.replace('www.', 'expert.'));
                                window.location.href = `${dashboardUrl}/dashboard`;
                            } else {
                                router.push('/client/profile'); 
                            }
                        } else {
                            setCountdown(currentCountdown);
                        }
                    }, 1000);
                }
                setIsLoading(false);
            } catch (err: any) {
                setError(getErrorMessage(err) || t.resetPassword.errors.unexpected);
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token, router, t.resetPassword.errors.invalidToken, t.verifyEmail.failedMessage, t.resetPassword.errors.failed, t.resetPassword.errors.unexpected, t.verifyEmail.successMessage]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Celestial Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 p-8 md:p-16 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    
                    {/* Brand/Status Icon */}
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto overflow-hidden">
                            {isLoading ? (
                                <FaSpinner className="animate-spin text-orange text-3xl" />
                            ) : error ? (
                                <div className="w-full h-full bg-red-50 flex items-center justify-center text-red-500">
                                    <FaExclamationCircle size={40} />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-green-50 flex items-center justify-center text-green-500 animate-in zoom-in duration-500">
                                    <FaCheckCircle size={40} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                             <HiOutlineSparkles className="text-orange text-xs" />
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{t.verifyEmail.title}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter uppercase">
                             {isLoading ? t.verifyEmail.verifying : error ? "Verification Failed" : "Email Verified"}
                        </h2>
                    </div>

                    {isLoading && (
                        <div className="space-y-6">
                            <p className="text-slate-400 font-bold italic text-lg leading-relaxed px-4">
                                &quot;Just a moment while we align your profile with our stellar database.&quot;
                            </p>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-orange animate-[loading_2s_infinite]"></div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-8 bg-red-50/50 rounded-[2rem] border border-red-100 space-y-4">
                            <p className="text-red-950 font-black text-sm uppercase tracking-tight leading-relaxed">
                                {error}
                            </p>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed">
                                Please ensure you are using the correct link from your email or try requesting a new one.
                            </p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-10 bg-green-50/50 rounded-[2.5rem] border border-green-100 space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-green-950 font-black text-xl uppercase tracking-tighter">Awesome!</h4>
                                <p className="text-green-800 font-bold italic leading-relaxed">
                                    {successMessage}
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                                Redirecting in {countdown}s
                            </div>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="pt-4 flex flex-col gap-4">
                            <Link
                                href="/sign-in"
                                className="group relative w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-orange transition-all duration-500 active:scale-95"
                            >
                                <span className="relative z-10">{error ? t.verifyEmail.goToSignIn : t.resetPassword.goToSignIn}</span>
                            </Link>

                            {error && (
                                <div className="text-center">
                                    <p className="text-slate-400 font-bold text-xs">
                                        {t.verifyEmail.resendTitle}{" "}
                                        <Link href="/register" className="text-orange hover:underline underline-offset-4">
                                            {t.verifyEmail.resendButton}
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="text-center mt-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                   <div className="inline-flex items-center gap-4 px-8 py-3 bg-white rounded-full border border-slate-100 shadow-sm">
                      <FaEnvelopeOpenText className="text-orange text-xs" />
                      <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Celestial Auth Protocol v2.4</span>
                   </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 40%; }
                    100% { width: 0%; transform: translateX(400%); }
                }
            `}</style>
        </div>
    );
};

const Page: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="animate-spin text-orange text-3xl" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warping Through Dimensions</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default Page;
