"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "@repo/design/lucide";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  Checkbox,
} from "@repo/design/shadcn";
import { ExpertAuthErrorCode } from "@repo/lib";
import { resolvePostAuthDestination } from "@/features/onboarding/utils";
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

  const form = useForm<LoginFormData>({
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

      window.location.href = await resolvePostAuthDestination();
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
      window.location.href = await resolvePostAuthDestination();
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
    <div className="w-full flex flex-col">
      <div className="my-8 text-center">
        <h1 className="text-4xl font-semibold text-stone-800 tracking-tight mb-2">
          Welcome back
        </h1>
        <div className="mb-3 sm:mb-4 flex justify-center">
          <Link href="/register" className="text-sm transition-colors">
            <span className="text-stone-400">Don&apos;t have an account? </span>
            <span className="font-semibold text-amber-700 hover:text-amber-800">
              Register now
            </span>
          </Link>
        </div>
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton
        callback_url="/dashboard"
        onError={(err) => setServerError(err)}
        text="Continue with Google"
        className="flex items-center justify-center gap-2 w-full border border-stone-200 hover:border-stone-300 rounded-xl h-10 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-200 cursor-pointer text-xs shadow-2xs hover:shadow-xs"
      />

      {/* Divider */}
      <div className="relative my-6 text-center w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <span className="relative px-3 text-[11px] font-medium text-stone-400 bg-white">
          Or Continue With
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 sm:space-y-5"
          noValidate
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs sm:text-sm font-medium text-stone-700">
                  Email address
                </FormLabel>
                <FormControl>
                  <InputGroup
                    error={!!form.formState.errors.email}
                    className="h-11 sm:h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
                  >
                    <InputGroupAddon
                      align="start"
                      className="text-stone-400 group-focus-within:text-stone-700 pl-3.5 sm:pl-3"
                    >
                      <Mail className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="email"
                      id="email"
                      autoComplete="email"
                      placeholder="expert@example.com"
                      className="text-sm placeholder:text-stone-400"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs sm:text-sm font-medium text-stone-700">
                  Password
                </FormLabel>
                <FormControl>
                  <InputGroup
                    error={!!form.formState.errors.password}
                    className="h-11 sm:h-10 rounded-xl border-stone-200 hover:border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100"
                  >
                    <InputGroupAddon
                      align="start"
                      className="text-stone-400 group-focus-within:text-stone-700 pl-3.5 sm:pl-3"
                    >
                      <Lock className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="text-sm placeholder:text-stone-400"
                      {...field}
                    />
                    <InputGroupAddon align="end" className="pr-2 sm:pr-1.5">
                      <InputGroupButton
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-stone-400 hover:text-stone-700 rounded-lg p-1.5"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="size-4 rounded-[4px] border-stone-300 peer-checked:bg-amber-600 peer-checked:border-amber-600 peer-focus-visible:ring-amber-500/30 peer-focus-visible:border-amber-600"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs sm:text-sm text-stone-600 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm py-0.5 px-0.5"
            >
              Forgot password?
            </Link>
          </div>

          {/* Server Error Banner right on top of Log in button */}
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <p className="text-xs text-red-800 font-semibold">{serverError}</p>
            </div>
          )}

          {/* Submit Button (Solid Brand Amber) */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-10 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
