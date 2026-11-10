"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
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
import { ExpertAuthErrorCode } from "@repo/lib";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { OtpVerification } from "./OtpVerification";
import { loginAction } from "../actions/login.action";
import { LoginSchema, type LoginFormData } from "../schemas/login.schema";
import { useAuthStore } from "@/store";

export interface LoginFormProps {
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * LoginForm component for Expert Portal.
 * Handles dual-step authentication: credentials validation followed by
 * unverified-email OTP verification when required.
 *
 * @param props - Component props
 * @returns React authentication form element
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onLoadingChange }) => {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [unverifiedPassword, setUnverifiedPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState("");
  const [otpError, setOtpError] = useState("");

  const initAuth = useAuthStore((state) => state.init);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const updateLoading = (val: boolean) => {
    setLoading(val);
    onLoadingChange?.(val);
  };

  const onSubmit = async (data: LoginFormData) => {
    updateLoading(true);
    setServerError("");

    try {
      const result = await loginAction(data);

      if (!result.ok) {
        if (
          result.isUnverified ||
          result.error.errorCode === ExpertAuthErrorCode.EMAIL_NOT_VERIFIED
        ) {
          setUnverifiedEmail(data.email.trim());
          setUnverifiedPassword(data.password);
          setStep("otp");
          return;
        }

        setServerError(result.error.message);
        return;
      }

      await initAuth(true);

      window.location.href = "/dashboard";
    } finally {
      updateLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    updateLoading(true);
    setOtpError("");

    try {
      const result = await loginAction({
        email: unverifiedEmail,
        password: unverifiedPassword,
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
    setOtpError("");
    const result = await loginAction({
      email: unverifiedEmail,
      password: unverifiedPassword,
    });

    if (
      !result.ok &&
      !result.isUnverified &&
      result.error.errorCode !== ExpertAuthErrorCode.EMAIL_NOT_VERIFIED
    ) {
      setOtpError(result.error.message);
    }
  };

  if (step === "otp") {
    return (
      <OtpVerification
        email={unverifiedEmail}
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
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-[28px] font-semibold text-stone-900 tracking-tight mb-1 sm:mb-1.5">
          Welcome back
        </h1>
        <p className="text-sm text-stone-500 leading-normal">
          Sign in to manage your expert account.
        </p>
      </div>

      {serverError && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-semibold">{serverError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-1.5 sm:space-y-2 lg:space-y-3"
        noValidate
      >
        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Email address
          </Label>
          <InputGroup
            error={!!errors.email}
            className="h-12 lg:h-10 rounded-2xl lg:rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
          >
            <InputGroupAddon
              align="start"
              className="text-stone-400 group-focus-within:text-stone-700 pl-3.5 sm:pl-3"
            >
              <Mail className="size-4.5 lg:size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              id="email"
              autoComplete="email"
              placeholder="expert@example.com"
              className="text-base lg:text-sm placeholder:text-stone-400"
              {...register("email")}
            />
          </InputGroup>
          <div className="h-4 mt-0.5 flex items-center">
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-[11px] font-medium leading-none animate-in fade-in duration-150">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="lg:mt-4">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Password
          </Label>
          <InputGroup
            error={!!errors.password}
            className="h-12 lg:h-10 rounded-2xl lg:rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
          >
            <InputGroupAddon
              align="start"
              className="text-stone-400 group-focus-within:text-stone-700 pl-3.5 sm:pl-3"
            >
              <Lock className="size-4.5 lg:size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="text-base lg:text-sm placeholder:text-stone-400"
              {...register("password")}
            />
            <InputGroupAddon align="end" className="pr-2 sm:pr-1.5">
              <InputGroupButton
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-stone-700 rounded-lg p-1.5"
              >
                {showPassword ? (
                  <EyeOff className="size-4.5 lg:size-4" />
                ) : (
                  <Eye className="size-4.5 lg:size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <div className="h-4 mt-0.5 flex items-center">
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-[11px] font-medium leading-none animate-in fade-in duration-150">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none py-0.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4.5 lg:size-4 rounded-md border-stone-300 text-amber-600 focus:ring-stone-400 cursor-pointer accent-amber-600"
            />
            <span className="text-sm text-stone-600">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm py-0.5 px-0.5"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button (Solid Brand Amber) */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 lg:h-10 rounded-2xl lg:rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold shadow-sm hover:shadow active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4.5 lg:size-4 animate-spin text-white" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight className="size-4.5 lg:size-4" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-2.5 sm:my-3 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <span className="relative px-3 text-xs font-medium text-stone-400 bg-white uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton
          callback_url="/dashboard"
          onError={(err) => setServerError(err)}
          text="Continue with Google"
          className="flex items-center justify-center gap-2.5 w-full border border-stone-200 hover:border-stone-300 rounded-2xl lg:rounded-xl h-12 lg:h-10 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-150 cursor-pointer text-sm font-medium text-stone-700 shadow-2xs hover:shadow-xs"
        />

        {/* Register Prompt */}
        <div className="text-center pt-2 text-sm text-stone-600">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-semibold text-amber-600 hover:text-amber-700 underline-offset-2 hover:underline transition-colors"
          >
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
