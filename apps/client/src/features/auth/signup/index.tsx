"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { registerAction } from "@/actions/auth";
import { Loading } from "@repo/ui";
import GoogleLoginButton from "../GoogleLoginButton.component";
import OtpVerification from "./OtpVerification.component";
import { useTranslations } from "next-intl";

interface SignUpFormInputs {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUpForm: React.FC = () => {
  const t = useTranslations("Auth");

  // Step 1: Register Form, Step 2: OTP Verification
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Watch current password for confirmPassword validation
  const passwordValue = watch("password");

  // ─── REGISTER SUBMIT ──────────────────────────────────
  const onRegisterSubmit = async (data: SignUpFormInputs) => {
    setIsLoading(true);
    try {
      const result = await registerAction({
        first_name: data.first_name.trim(),
        last_name: data.last_name?.trim() || undefined,
        email: data.email.trim(),
        password: data.password,
      });

      console.log("[SignUpForm] registerAction result:", result);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message || t("signUp.otpSent"));
        setRegisteredEmail(data.email.trim());
        setStep(2);
      }
    } catch (err) {
      console.error("[SignUpForm] registerAction error:", err);
      toast.error(t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── RESEND OTP ACTION ────────────────────────────────
  const handleResendOtp = async () => {
    const currentValues = watch();
    const result = await registerAction({
      first_name: currentValues.first_name.trim(),
      last_name: currentValues.last_name?.trim() || undefined,
      email: currentValues.email.trim(),
      password: currentValues.password,
    });

    if (result.error) {
      throw new Error(result.error);
    }
  };

  // If step 2: render dedicated OTP verification component
  if (step === 2) {
    return (
      <OtpVerification
        email={registeredEmail}
        redirectUrl="/onboard"
        onBack={() => setStep(1)}
        onResend={handleResendOtp}
      />
    );
  }

  const Req = () => <span className="text-red-500 ml-0.5">*</span>;
  const isPending = isLoading || isSubmitting;

  return (
    <>
      <div className="w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0 bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 my-0 transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div>
            <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
              {t("signUp.welcome")}
            </h6>
            <span className="text-xl font-black text-orange block">
              {t("signIn.brandName")}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
              {t("signUp.alreadyAccount")}
            </h6>
            <Link
              href="/sign-in"
              className="text-base font-bold text-[#4A1D1F] hover:text-orange transition-all"
            >
              {t("signUp.signIn")}
            </Link>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-[26px] md:text-3xl font-black text-[#301118]">
            {t("signUp.title")}
          </h2>
          <p className="text-gray-800 text-xs md:text-sm mt-1 font-medium">
            {t("signUp.subtitle")}
          </p>
        </div>

        {/* Google Login */}
        <div className="mb-6">
          <GoogleLoginButton text={t("signUp.google")} />
        </div>

        {/* Divider */}
        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 text-xs font-semibold text-gray-500 bg-white">
            {t("signUp.orDetails")}
          </span>
        </div>

        {/* Form Fields via React Hook Form */}
        <form
          onSubmit={handleSubmit(onRegisterSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {t("signUp.firstNameLabel")}
                <Req />
              </label>
              <input
                type="text"
                id="first_name"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all placeholder:text-gray-400 text-black font-semibold text-sm ${
                  errors.first_name
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5"
                }`}
                placeholder={t("signUp.firstNamePlaceholder")}
                {...register("first_name", {
                  required:
                    t("signUp.errors.firstNameRequired") ||
                    "First name is required",
                })}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {t("signUp.lastNameLabel")}
              </label>
              <input
                type="text"
                id="last_name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-400 text-black font-semibold text-sm"
                placeholder={t("signUp.lastNamePlaceholder")}
                {...register("last_name")}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              {t("signUp.emailLabel")}
              <Req />
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all placeholder:text-gray-400 text-black font-semibold text-sm ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5"
              }`}
              placeholder={t("signUp.emailPlaceholder")}
              {...register("email", {
                required:
                  t("signUp.errors.emailRequired") || "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    t("signUp.errors.emailRequired") ||
                    "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              {t("signUp.passwordLabel")}
              <Req />
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all placeholder:text-gray-400 text-black font-semibold text-sm pr-11 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5"
                }`}
                placeholder={t("signUp.passwordPlaceholder")}
                {...register("password", {
                  required: t("signUp.passwordLabel"),
                  minLength: {
                    value: 6,
                    message:
                      t("signUp.errors.passLength") ||
                      "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`}
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              {t("signUp.confirmPasswordLabel")}
              <Req />
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all placeholder:text-gray-400 text-black font-semibold text-sm pr-11 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5"
                }`}
                placeholder={t("signUp.confirmPasswordPlaceholder")}
                {...register("confirmPassword", {
                  required: t("signUp.confirmPasswordLabel"),
                  validate: (value) =>
                    value === passwordValue ||
                    t("signUp.errors.passMatch") ||
                    "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange transition-colors cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                <i
                  className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-base`}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-3"
            disabled={isPending}
          >
            {isPending ? t("signUp.creating") : t("signUp.submit")}
          </button>
        </form>
      </div>

      {isPending && <Loading fullScreen />}
    </>
  );
};

export default SignUpForm;
