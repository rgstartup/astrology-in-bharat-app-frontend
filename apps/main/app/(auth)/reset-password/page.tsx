"use client";

import NextLink from "next/link";
const Link = NextLink as any;
import React, { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useLanguageStore } from "@/store/languageStore";
import { authTranslations } from "@/lib/translations/auth";

const ResetPasswordContent: React.FC = () => {
    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            toast.error(t.resetPassword.errors.invalidToken);
            router.push("/sign-in");
        }
    }, [token, router, t.resetPassword.errors.invalidToken]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!password) {
            toast.error(t.resetPassword.errors.required);
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t.resetPassword.errors.match);
            return;
        }

        if (password.length < 6) {
            toast.error(t.resetPassword.errors.length);
            return;
        }

        setIsLoading(true);

        try {
            const [data, fetchError] = await api.post<any>(`/auth/reset/password?token=${token}`, {
                 password 
            });

            if (fetchError) {
                toast.error(fetchError.body?.message || fetchError.message || t.resetPassword.errors.failed);
            } else {
                toast.success(data?.message || t.resetPassword.successMessage);
                setIsSuccess(true);
                setTimeout(() => { router.push("/sign-in"); }, 3000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <section className="signin-part">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="form-data shadow-sm p-4 rounded-xl bg-white">
                            <div className="sign-in-heading mb-4 text-center">
                                <h2
                                    style={{ color: "var(--primary-color)", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                >
                                    {t.resetPassword.title}
                                </h2>
                                <p
                                    className="text-muted"
                                    style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                >
                                    {t.resetPassword.subtitle}
                                </p>
                            </div>

                            {!isSuccess ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            {t.resetPassword.passwordLabel}
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                className="form-control"
                                                placeholder={t.resetPassword.passwordPlaceholder}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                style={{ paddingRight: "40px" }}
                                            />
                                            <button
                                                type="button"
                                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                            {t.resetPassword.confirmPasswordLabel}
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="form-control"
                                            placeholder={t.resetPassword.confirmPasswordPlaceholder}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t.resetPassword.resetting : t.resetPassword.submit}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>
                                    <h3 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                                        {t.resetPassword.successTitle}
                                    </h3>
                                    <p
                                        className="text-muted"
                                        style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                                    >
                                        {t.resetPassword.successMessage}
                                    </p>
                                    <div className="mt-4">
                                        <Link href="/sign-in" className="btn bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold px-4">
                                            {t.resetPassword.goToSignIn}
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
            <ResetPasswordContent />
        </Suspense>
    );
};

export default Page;
