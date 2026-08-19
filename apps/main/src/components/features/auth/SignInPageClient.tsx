"use client";

import React, { Suspense } from "react";
import SignInForm from "./SignInForm.component";
import TopExpertsSection from "./TopExpertsSection";
import authContent from "../../../../public/data/auth-content.json";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";

export default function SignInPageClient() {
    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;
    const { signIn } = authContent;

    return (
        <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat overflow-hidden">
            <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-start justify-between">

                    {/* Left Side: Branding and Astrology Info */}
                    <div className="w-full lg:w-1/2 pt-0 md:pt-4">
                        <div className="mb-8">
                            <h3
                                className="text-[20px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-extrabold leading-tight mb-4 whitespace-nowrap tracking-tight md:tracking-normal"
                                style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                            >
                                <span className="text-[#301118]">{t.signIn.brandTitle}</span>{" "}
                                {t.signIn.brandTo}{" "}
                                <span className="text-orange">
                                    {t.signIn.brandName}
                                </span>
                            </h3>
                            <p
                                className="text-black text-base md:text-lg leading-relaxed font-medium"
                                style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
                            >
                                {signIn.description1} {signIn.description2}
                            </p>
                        </div>

                        {/* Top Experts Section */}
                        <TopExpertsSection />
                    </div>

                    {/* Right Side: Sign In Form */}
                    <div className="w-full lg:w-1/2">
                        <Suspense fallback={<div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div></div>}>
                            <SignInForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </section>
    );
}
