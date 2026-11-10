"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@repo/design/shadcn";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { OtpVerification } from "./OtpVerification";
import { registerAction } from "../actions/register.action";
import {
  RegisterSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { useAuthStore } from "@/store";

export interface RegisterFormProps {
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * RegisterForm component for the Expert Portal.
 * Simplified, compact 2-step registration: captures credentials and
 * transitions seamlessly to OTP verification for email confirmation.
 *
 * @param props - Component props
 * @returns React registration form element
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onLoadingChange,
}) => {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [registeredData, setRegisteredData] = useState<RegisterFormData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [otpError, setOtpError] = useState("");

  const initAuth = useAuthStore((state) => state.init);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const updateLoading = (val: boolean) => {
    setLoading(val);
    onLoadingChange?.(val);
  };

  const onSubmit = async (data: RegisterFormData) => {
    updateLoading(true);
    setServerError("");

    try {
      const result = await registerAction(data);

      if (!result.ok) {
        setServerError(result.error.message);
        return;
      }

      setRegisteredData(data);
      setStep("otp");
    } finally {
      updateLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!registeredData) return;
    updateLoading(true);
    setOtpError("");

    try {
      const result = await registerAction({
        ...registeredData,
        otp,
      });

      if (!result.ok) {
        setOtpError(result.error.message);
        return;
      }

      await initAuth(true);
      window.location.href = "/dashboard";
    } finally {
      updateLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registeredData) return;
    setOtpError("");
    const result = await registerAction({
      ...registeredData,
      otp: undefined,
    });

    if (!result.ok) {
      setOtpError(result.error.message);
    }
  };

  if (step === "otp" && registeredData) {
    return (
      <OtpVerification
        email={registeredData.email}
        onBack={() => {
          setStep("credentials");
          setOtpError("");
        }}
        onResend={handleResendOtp}
        onVerify={handleVerifyOtp}
        loading={loading}
        errorMessage={otpError}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Login CTA at top right */}
      <div className="mb-3 sm:mb-4 flex justify-end">
        <Link
          href="/login"
          className="text-xs sm:text-sm transition-colors"
        >
          <span className="text-stone-400">Already have an account? </span>
          <span className="text-stone-700 font-semibold hover:text-amber-700">Log in</span>
        </Link>
      </div>

      <div className="mb-3 sm:mb-4 text-center">
        <h1 className="text-lg sm:text-xl font-semibold text-stone-800 tracking-tight mb-0.5">
          Start Your Journey
        </h1>
        <p className="text-xs text-stone-500">
          Create your account to start providing astrology consultations.
        </p>
      </div>

      {serverError && (
        <div className="mb-2 p-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-semibold">{serverError}</p>
        </div>
      )}

      {/* Google Login Button */}
      <GoogleLoginButton
        callback_url="/dashboard"
        onError={(err) => setServerError(err)}
        text="Google"
        className="flex items-center justify-center gap-2 w-full border border-stone-200 hover:border-stone-300 rounded-xl h-10 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-200 cursor-pointer text-xs shadow-2xs hover:shadow-xs"
      />

      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <span className="relative px-3 text-[11px] font-medium text-stone-400 bg-white">
          Or Register With
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1" noValidate>
        {/* First Name & Last Name (2-column grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Label
              htmlFor="firstName"
              className="block text-xs font-medium text-stone-700 mb-0.5"
            >
              First Name
            </Label>
            <InputGroup
              error={!!errors.firstName}
              className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
            >
              <InputGroupAddon
                align="start"
                className="text-stone-400 group-focus-within:text-stone-700"
              >
                <User className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                id="firstName"
                autoComplete="given-name"
                placeholder="Aarav"
                className="text-xs sm:text-sm"
                {...register("firstName")}
              />
            </InputGroup>
            <div className="h-4 mt-0.5 flex items-center">
              {errors.firstName && (
                <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="block text-xs font-medium text-stone-700 mb-0.5"
            >
              Last Name{" "}
              <span className="text-stone-400 font-normal">(Optional)</span>
            </Label>
            <InputGroup
              error={!!errors.lastName}
              className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
            >
              <InputGroupAddon
                align="start"
                className="text-stone-400 group-focus-within:text-stone-700"
              >
                <User className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                id="lastName"
                autoComplete="family-name"
                placeholder="Sharma"
                className="text-xs sm:text-sm"
                {...register("lastName")}
              />
            </InputGroup>
            <div className="h-4 mt-0.5 flex items-center">
              {errors.lastName && (
                <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-xs font-medium text-stone-700 mb-0.5"
          >
            Email Address
          </Label>
          <InputGroup
            error={!!errors.email}
            className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
          >
            <InputGroupAddon
              align="start"
              className="text-stone-400 group-focus-within:text-stone-700"
            >
              <Mail className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              id="email"
              autoComplete="email"
              placeholder="expert@example.com"
              className="text-xs sm:text-sm"
              {...register("email")}
            />
          </InputGroup>
          <div className="h-4 mt-0.5 flex items-center">
            {errors.email && (
              <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <Label
            htmlFor="password"
            className="block text-xs font-medium text-stone-700 mb-0.5"
          >
            Password
          </Label>
          <InputGroup
            error={!!errors.password}
            className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
          >
            <InputGroupAddon
              align="start"
              className="text-stone-400 group-focus-within:text-stone-700"
            >
              <Lock className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="text-xs sm:text-sm"
              {...register("password")}
            />
            <InputGroupAddon align="end">
              <InputGroupButton
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-stone-700 rounded-lg"
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <div className="h-4 mt-0.5 flex items-center">
            {errors.password && (
              <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password (2-column grid on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="block text-xs font-medium text-stone-700 mb-0.5"
            >
              Password
            </Label>
            <InputGroup
              error={!!errors.password}
              className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
            >
              <InputGroupAddon
                align="start"
                className="text-stone-400 group-focus-within:text-stone-700"
              >
                <Lock className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="text-xs sm:text-sm"
                {...register("password")}
              />
              <InputGroupAddon align="end">
                <InputGroupButton
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  {showPassword ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <div className="h-4 mt-0.5 flex items-center">
              {errors.password && (
                <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-stone-700 mb-0.5"
            >
              Confirm Password
            </Label>
            <InputGroup
              error={!!errors.confirmPassword}
              className="h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
            >
              <InputGroupAddon
                align="start"
                className="text-stone-400 group-focus-within:text-stone-700"
              >
                <Lock className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                className="text-xs sm:text-sm"
                {...register("confirmPassword")}
              />
              <InputGroupAddon align="end">
                <InputGroupButton
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <div className="h-4 mt-0.5 flex items-center">
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shadow-amber-600/20 hover:shadow-md hover:shadow-amber-600/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin text-white" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <UserPlus className="size-3.5" />
            </>
          )}
        </Button>

        {/* Login Prompt */}
        <div className="text-center pt-1 text-xs text-stone-600">
          <span>By continuing, you agree to our terms and conditions</span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
