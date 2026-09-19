"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { registerAction } from "@/actions/auth";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import GoogleLoginButton from "../GoogleLoginButton.component";
import { AuthHeader } from "../AuthHeader";
import OtpVerification from "./OtpVerification.component";
import { useTranslations } from "next-intl";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";

interface SignUpFormInputs {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUpForm: React.FC = () => {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const callback_url =
    searchParams.get("callback_url") ||
    searchParams.get("callbackUrl") ||
    "/onboard";

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

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message || t("signUp.otpSent"));
        setRegisteredEmail(data.email.trim());
        setStep(2);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
        redirectUrl={callback_url}
        onBack={() => {
          setStep(1);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onResend={handleResendOtp}
      />
    );
  }

  const isPending = isLoading || isSubmitting;

  return (
    <div className="w-full max-w-[460px] sm:max-w-[480px] mx-auto lg:mx-0 py-0">
      {/* Top Header with Expert emblem alongside brand name */}
      <AuthHeader subtitle={t("signUp.header")} />

      {/* Google Login */}
      <div className="mb-4 sm:mb-5">
        <GoogleLoginButton callback_url={callback_url} />
      </div>

      {/* Divider */}
      <div className="relative my-4 sm:my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <span className="relative px-3 text-xs font-medium text-stone-500 bg-white">
          {t("signUp.orDetails")}
        </span>
      </div>

      {/* Form Fields via React Hook Form */}
      <form
        onSubmit={handleSubmit(onRegisterSubmit)}
        className="space-y-3 sm:space-y-3.5"
        noValidate
      >
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <Label
              htmlFor="first_name"
              className="block text-[11px] font-semibold text-stone-700 mb-1.5"
            >
              {t("signUp.firstNameLabel")}
            </Label>
            <InputGroup error={!!errors.first_name}>
              <InputGroupAddon align="start">
                <User className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                id="first_name"
                placeholder={t("signUp.firstNamePlaceholder")}
                {...register("first_name", {
                  required:
                    t("signUp.errors.firstNameRequired") ||
                    "First name is required",
                })}
              />
            </InputGroup>
            {errors.first_name && (
              <p className="text-red-500 text-[10px] mt-0.5 font-medium">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="last_name"
              className="block text-[11px] font-semibold text-stone-700 mb-1.5"
            >
              {t("signUp.lastNameLabel")}
            </Label>
            <InputGroup>
              <InputGroupAddon align="start">
                <User className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                id="last_name"
                placeholder={t("signUp.lastNamePlaceholder")}
                {...register("last_name")}
              />
            </InputGroup>
          </div>
        </div>

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-[11px] font-semibold text-stone-700 mb-1.5"
          >
            {t("signUp.emailLabel")}
          </Label>
          <InputGroup error={!!errors.email}>
            <InputGroupAddon align="start">
              <Mail className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              id="email"
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
          </InputGroup>
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-0.5 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password with InputGroup */}
        <div>
          <Label
            htmlFor="password"
            className="block text-[11px] font-semibold text-stone-700 mb-1.5"
          >
            {t("signUp.passwordLabel")}
          </Label>
          <InputGroup error={!!errors.password}>
            <InputGroupAddon align="start">
              <Lock className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              id="password"
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
            <InputGroupAddon align="end">
              <InputGroupButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && (
            <p className="text-red-500 text-[10px] mt-0.5 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password with InputGroup */}
        <div>
          <Label
            htmlFor="confirmPassword"
            className="block text-[11px] font-semibold text-stone-700 mb-1.5"
          >
            {t("signUp.confirmPasswordLabel")}
          </Label>
          <InputGroup error={!!errors.confirmPassword}>
            <InputGroupAddon align="start">
              <Lock className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder={t("signUp.confirmPasswordPlaceholder")}
              {...register("confirmPassword", {
                required: t("signUp.confirmPasswordLabel"),
                validate: (value) =>
                  value === passwordValue ||
                  t("signUp.errors.passMatch") ||
                  "Passwords do not match",
              })}
            />
            <InputGroupAddon align="end">
              <InputGroupButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.confirmPassword && (
            <p className="text-red-500 text-[10px] mt-0.5 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 sm:h-10.5 rounded-full bg-gradient-to-r from-orange to-[#EA580C] hover:from-orange/95 hover:to-[#C2410C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange/20 hover:shadow-lg hover:shadow-orange/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2.5 sm:mt-3 gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>{t("signUp.creating")}</span>
            </>
          ) : (
            <span>{t("signUp.submit")}</span>
          )}
        </Button>

        {/* Secondary sign-in prompt */}
        <div className="text-center pt-1.5 text-xs text-stone-600">
          <span>{t("signUp.alreadyAccount")} </span>
          <Link
            href={withCallbackUrl(
              PATHS.SIGN_IN,
              callback_url !== "/onboard" && callback_url !== "/dashboard"
                ? callback_url
                : undefined,
            )}
            className="font-bold text-orange hover:text-[#EA580C] underline-offset-2 hover:underline transition-colors"
          >
            {t("signUp.signIn")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
