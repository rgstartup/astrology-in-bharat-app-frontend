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
  AlertCircle,
  UserPlus,
} from "lucide-react";
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

  const form = useForm<RegisterFormData>({
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
    <div className="w-full flex flex-col">
      <div className="mt-4 mb-6 text-center">
        <h1 className="text-4xl font-semibold text-stone-800 tracking-tight mb-2">
          Create your Account
        </h1>
        <div className="mb-3 sm:mb-4 flex justify-center">
          <Link href="/login" className="text-sm transition-colors">
            <span className="text-stone-400">Already have an account? </span>
            <span className="font-semibold text-amber-700">Log in</span>
          </Link>
        </div>
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton
        callback_url="/dashboard"
        onError={(err) => setServerError(err)}
        text="Signup with Google"
        className="flex items-center justify-center gap-2 w-full border border-stone-200 hover:border-stone-300 rounded-xl h-10 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-200 cursor-pointer text-xs shadow-2xs hover:shadow-xs"
      />

      {/* Divider */}
      <div className="relative my-6 text-center w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <span className="relative px-3 text-[11px] font-medium text-stone-400 bg-white">
          OR
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 sm:space-y-5"
          noValidate
        >
          {/* First Name & Last Name (2-column grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-700">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <InputGroup
                      error={!!form.formState.errors.firstName}
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
                        autoComplete="given-name"
                        placeholder="Aarav"
                        className="text-xs sm:text-sm"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-700">
                    Last Name{" "}
                    <span className="text-stone-400 font-normal">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <InputGroup
                      error={!!form.formState.errors.lastName}
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
                        autoComplete="family-name"
                        placeholder="Sharma"
                        className="text-xs sm:text-sm"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-stone-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <InputGroup
                    error={!!form.formState.errors.email}
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
                      autoComplete="email"
                      placeholder="expert@example.com"
                      className="text-xs sm:text-sm"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
              </FormItem>
            )}
          />

          {/* Password & Confirm Password (2-column grid on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <InputGroup
                      error={!!form.formState.errors.password}
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="text-xs sm:text-sm"
                        {...field}
                      />
                      <InputGroupAddon align="end">
                        <InputGroupButton
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
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
                  </FormControl>
                  <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <InputGroup
                      error={!!form.formState.errors.confirmPassword}
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="text-xs sm:text-sm"
                        {...field}
                      />
                      <InputGroupAddon align="end">
                        <InputGroupButton
                          type="button"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
                  </FormControl>
                  <FormMessage className="text-red-500 text-[11px] font-medium leading-tight mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Server Error Banner right on top of Create Account button */}
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <div className="flex-1 flex items-center justify-between text-xs text-red-800">
                <span className="font-semibold">{serverError}</span>
                {serverError.toLowerCase().includes("already registered") && (
                  <Link
                    href="/login"
                    className="font-bold underline text-amber-700 hover:text-amber-800 ml-2 shrink-0"
                  >
                    Log in &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shadow-amber-600/20 hover:shadow-md hover:shadow-amber-600/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
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
      </Form>
    </div>
  );
};

export default RegisterForm;
