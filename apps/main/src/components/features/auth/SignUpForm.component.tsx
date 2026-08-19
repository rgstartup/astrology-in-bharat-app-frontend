"use client";

import React, { useState, useCallback, FormEvent, useRef } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { toast } from "react-toastify";
import { initiateRegistrationAction, completeRegistrationAction } from "@/actions/auth";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";
import { VerificationPopup, Loading } from "@repo/ui";
import { useSearchParams, useRouter } from "next/navigation";

const Image = NextImage as any;
const Link = NextLink as any;

export const SignUpForm: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlToken = searchParams.get("token") || searchParams.get("verification_token");

    const extractEmailFromToken = (token: string | null) => {
        if (!token) return "";
        try {
            const parts = token.split('.');
            if (parts.length < 2) return "";
            const base64Url = parts[1];
            if (!base64Url) return "";
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload)?.email || "";
        } catch {
            return "";
        }
    };

    const [step, setStep] = useState<1 | 2 | 3>(urlToken ? 3 : 1);

    // Step 1
    const [email, setEmail] = useState(extractEmailFromToken(urlToken));

    // Step 2
    const [showVerification, setShowVerification] = useState(false);
    const [verifiedToken, setVerifiedToken] = useState(urlToken || "");

    // Step 3 - Profile Pic
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        gender: "other",
        maritalStatus: "",
        occupation: "",
        aboutMe: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        dateOfBirth: "",
        timeOfBirth: "",
        birthPlace: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { lang } = useLanguageStore();
    const t = authTranslations[lang as keyof typeof authTranslations] || authTranslations.en;

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Profile picture must be under 5MB.");
            return;
        }
        setProfilePic(file);
        setProfilePicPreview(URL.createObjectURL(file));
    };

    const handleGoogleLogin = () => {
        const redirectUri = `${window.location.origin}/client/profile`;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
        const googleLoginUrl = `${baseUrl.replace(/\/+$/, "")}/auth/google/login?role=client&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = googleLoginUrl;
    };

    const handleStep1Submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error(t.signUp.errors.allFields || "Please enter your email");
            return;
        }
        setIsLoading(true);
        try {
            const result = await initiateRegistrationAction(email);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                setShowVerification(true);
            }
        } catch {
            toast.error(t.signUp.errors.unexpected);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3Submit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error(t.signUp.errors.passLength);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error(t.signUp.errors.passMatch);
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error(t.signUp.errors.phoneInvalid);
            return;
        }

        setIsLoading(true);

        // Upload profile picture first if selected
        let profilePicUrl = "";
        if (profilePic) {
            try {
                const fd = new FormData();
                fd.append("file", profilePic);
                const uploadRes = await fetch("/api/v1/client/upload-file", {
                    method: "POST",
                    body: fd,
                    credentials: "include",
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    profilePicUrl = uploadData?.data?.fileUrl || uploadData?.data?.url || uploadData?.fileUrl || uploadData?.url || "";
                }
            } catch {
                // Non-blocking - profile pic upload failure won't stop registration
            }
        }

        const payload: any = {
            email,
            token: verifiedToken || "temp-token",
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            gender: formData.gender,
            maritalStatus: formData.maritalStatus,
            occupation: formData.occupation,
            aboutMe: formData.aboutMe,
            ...(profilePicUrl && { avatar: profilePicUrl }),
            birthDetails: {
                dateOfBirth: formData.dateOfBirth,
                timeOfBirth: formData.timeOfBirth,
                birthPlace: formData.birthPlace,
            },
        };

        if (formData.addressLine1 || formData.city || formData.country) {
            payload.address = {
                line1: formData.addressLine1,
                line2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.zipCode,
            };
        }

        try {
            const result = await completeRegistrationAction(payload);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                window.location.href = "/client/profile";
            }
        } catch (err: any) {
            toast.error(t.signUp.errors.unexpected);
        } finally {
            setIsLoading(false);
        }
    };

    // Red asterisk for required fields
    const Req = () => <span className="text-red-500 ml-0.5">*</span>;

    return (
        <>
        <div className={`w-full ${step === 3 ? 'max-w-[800px]' : 'max-w-[500px]'} mx-auto lg:ml-auto lg:mr-0 bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 my-0 transition-all duration-300`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div>
                    <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
                        {t.signUp.welcome}
                    </h6>
                    <span className="text-xl font-black text-orange block">
                        {t.signIn.brandName}
                    </span>
                </div>
                {step === 1 && (
                    <div className="text-left sm:text-right">
                        <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
                            {t.signUp.alreadyAccount}
                        </h6>
                        <Link href="/sign-in" className="text-base font-bold text-[#4A1D1F] hover:text-orange transition-all">
                            {t.signUp.signIn}
                        </Link>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-[26px] md:text-3xl font-black text-[#301118]">
                    {step === 1 ? t.signUp.title : "Complete Profile"}
                </h2>
                <p className="text-gray-800 text-xs md:text-sm mt-1 font-medium">
                    {step === 1 ? t.signUp.subtitle : "Please fill in your details to finalize your registration."}
                </p>
            </div>

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
                <>
                <div className="mb-6">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 w-full border-2 border-gray-100 rounded-2xl py-3 px-6 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer shadow-sm group"
                        onClick={handleGoogleLogin}
                    >
                        <Image src="/images/google-color-svgrepo-com.svg" alt="Google" height={20} width={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-gray-800 text-sm">{t.signUp.google}</span>
                    </button>
                </div>

                <div className="relative mb-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-50"></div>
                    </div>
                    <span className="relative px-3 text-xs font-semibold text-gray-500 bg-white">{t.signUp.orDetails}</span>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            {t.signUp.emailLabel}<Req />
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-700 text-black font-semibold text-sm"
                            placeholder={t.signUp.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending OTP..." : "Verify Email"}
                    </button>
                </form>
                </>
            )}

            {/* ── STEP 3: Complete Profile ── */}
            {step === 3 && (
                <form onSubmit={handleStep3Submit} className="space-y-6">

                    {/* Profile Picture */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            Profile Picture <span className="text-gray-400 text-[10px] font-medium normal-case tracking-normal">(Optional)</span>
                        </h3>
                        <div className="flex items-center gap-5">
                            {/* Circle preview */}
                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange flex items-center justify-center overflow-hidden bg-orange/5">
                                    {profilePicPreview ? (
                                        <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-user text-3xl text-orange/30" />
                                    )}
                                </div>
                                {profilePicPreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setProfilePicPreview(null); setProfilePic(null); }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors"
                                    >
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                )}
                            </div>
                            {/* Upload button */}
                            <div className="flex-1">
                                <label
                                    htmlFor="profilePicInput"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange text-orange text-sm font-semibold cursor-pointer hover:bg-orange hover:text-white transition-all duration-200"
                                >
                                    <i className="fa-solid fa-camera" />
                                    {profilePicPreview ? "Change Photo" : "Upload Photo"}
                                </label>
                                <input
                                    id="profilePicInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfilePicChange}
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">JPG, PNG · Max 5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Setup */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Account Setup</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password<Req /></label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`}></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password<Req /></label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-base`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name<Req /></label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number<Req /></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={10} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender<Req /></label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm bg-white">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marital Status</label>
                                <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Occupation</label>
                                <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">About Me</label>
                            <textarea name="aboutMe" value={formData.aboutMe} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm"></textarea>
                        </div>
                    </div>

                    {/* Astro Birth Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Astro Birth Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth<Req /></label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time of Birth<Req /></label>
                                <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Birth Place<Req /></label>
                                <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} required placeholder="City, Country" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium"><span className="text-red-500">*</span> Required fields</p>

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving Profile..." : "Complete Registration"}
                    </button>
                </form>
            )}

        </div>

        <VerificationPopup
            isOpen={showVerification}
            email={email}
            onClose={() => setShowVerification(false)}
        />
        {isLoading && <Loading fullScreen />}
        </>
    );
};

export default SignUpForm;
