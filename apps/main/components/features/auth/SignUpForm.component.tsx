"use client";

import React, { useState, useCallback, FormEvent } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { toast } from "react-toastify";
import { registerAction } from "@/actions/auth";
import { API_ROUTES as API_CONFIG } from "@/lib/api-routes";
import { useLanguageStore } from "@/store/languageStore";
import { authTranslations } from "@/lib/translations/auth";
import { VerificationPopup } from "@repo/ui";

const Image = NextImage as any;
const Link = NextLink as any;


const SignUpForm: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const cleanApiUrl = "http://localhost:6543/api/v1";
    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;


    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
            toast.error(t.signUp.errors.allFields);
            return false;
        }
        if (formData.password.length < 6) {
            toast.error(t.signUp.errors.passLength);
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error(t.signUp.errors.passMatch);
            return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error(t.signUp.errors.phoneInvalid);
            return false;
        }
        return true;
    };

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth — browser handles cookie automatically
        const redirectUri = `${window.location.origin}/profile`;
        const googleLoginUrl = `http://localhost:6543/api/v1/auth/google/login?role=client&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = googleLoginUrl;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submit clicked, validating...");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        toast.info(t.signUp.registering);

        const payload = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            // Keep phone for now if it's meant to be there, but backend DTO doesn't show it.
            // Actually, let's keep it but check backend DTO again.
            // If it's not in DTO, it might be rejected.
            phone: formData.phoneNumber,
            roles: ["client"]
        };

        try {
            const result = await registerAction(payload);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                setRegisteredEmail(formData.email);
                setShowVerification(true);
                // Clear form data after showing popup
                setFormData({ fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
            }
        } catch {
            toast.error(t.signUp.errors.unexpected);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 mt-0 mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div>
                    <h6 className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">
                        {t.signUp.welcome}
                    </h6>
                    <span className="text-xl font-black text-orange block">
                        {t.signIn.brandName}
                    </span>
                </div>
                <div className="text-left sm:text-right">
                    <h6 className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">
                        {t.signUp.alreadyAccount}
                    </h6>
                    <Link href="/sign-in" className="text-base font-bold text-[#4A1D1F] hover:text-orange transition-all">
                        {t.signUp.signIn}
                    </Link>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-3xl font-black text-[#301118]">{t.signUp.title}</h2>
                <p className="text-gray-400 text-sm mt-1 font-medium">{t.signUp.subtitle}</p>
            </div>

            <div className="mb-6">
                <button
                    type="button"
                    className="flex items-center justify-center gap-3 w-full border-2 border-gray-100 rounded-2xl py-3 px-6 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer shadow-sm group"
                    onClick={handleGoogleLogin}
                >
                    <Image
                        src="/images/google-color-svgrepo-com.svg"
                        alt="Google"
                        height={20}
                        width={20}
                        className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-bold text-gray-600 text-sm">{t.signUp.google}</span>
                </button>
            </div>

            <div className="relative mb-6 text-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-50"></div>
                </div>
                <span className="relative px-3 text-[10px] font-black text-gray-300 bg-white uppercase tracking-[0.2em]">{t.signUp.orDetails}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-[11px] font-black text-black mb-1.5 uppercase tracking-wider">
                            {t.signUp.fullNameLabel}
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-300 text-black font-semibold text-sm"
                            placeholder={t.signUp.fullNamePlaceholder}
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-[11px] font-black text-black mb-1.5 uppercase tracking-wider">
                            {t.signUp.emailLabel}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-300 text-black font-semibold text-sm"
                            placeholder={t.signUp.emailPlaceholder}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-[11px] font-black text-black mb-1.5 uppercase tracking-wider">
                            {t.signUp.phoneLabel}
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-300 text-black font-semibold text-sm"
                            placeholder={t.signUp.phonePlaceholder}
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            maxLength={10}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" title="Password" className="block text-[11px] font-black text-black mb-1.5 uppercase tracking-wider">
                            {t.signUp.passwordLabel}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-300 text-black font-semibold text-sm"
                                placeholder={t.signUp.passwordPlaceholder}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 border-0 bg-transparent text-gray-300 hover:text-orange transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`}></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" title="Confirm Password" className="block text-[11px] font-black text-black mb-1.5 uppercase tracking-wider">
                            {t.signUp.confirmPasswordLabel}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-300 text-black font-semibold text-sm"
                                placeholder={t.signUp.confirmPasswordPlaceholder}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 border-0 bg-transparent text-gray-300 hover:text-orange transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-base`}></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {t.signUp.creating}
                        </span>
                    ) : t.signUp.submit}
                </button>
            </form>

            {/* Verification Popup */}
            <VerificationPopup
                isOpen={showVerification}
                email={registeredEmail}
                onClose={() => setShowVerification(false)}
            />
        </div>
    );
};

export default SignUpForm;

