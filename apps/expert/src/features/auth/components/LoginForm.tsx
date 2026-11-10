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
  LogIn,
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
import { loginAction } from "../actions/login.action";
import { LoginSchema, type LoginFormData } from "../schemas/login.schema";
import { useAuthStore } from "@/store";

export interface LoginFormProps {
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * LoginForm component for Expert Portal.
 * Clean, compact authentication form calibrated to fit within single viewport height.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onLoadingChange }) => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState("");

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
        setServerError(result.error.message);
        return;
      }

      await initAuth(true);

      window.location.href = "/dashboard";
    } finally {
      updateLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-5 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-stone-800 tracking-tight mb-1">
          Welcome Back
        </h1>
        <p className="text-xs text-stone-500">
          Enter your email and password to access your account.
        </p>
      </div>

      {serverError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-semibold">{serverError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-1.5"
        noValidate
      >
        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-[11px] font-semibold text-stone-700 mb-1"
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
          <div className="h-4.5 mt-1 flex items-center">
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
            className="block text-[11px] font-semibold text-stone-700 mb-1"
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
              autoComplete="current-password"
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
          <div className="h-4.5 mt-1 flex items-center">
            {errors.password && (
              <p className="text-red-500 text-[11px] font-medium leading-none animate-in fade-in duration-150">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-3.5 rounded border-stone-300 text-amber-600 focus:ring-stone-400 cursor-pointer accent-amber-600"
            />
            <span className="text-[11px] font-medium text-stone-600">
              Remember Me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
          >
            Forgot Password?
          </Link>
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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <LogIn className="size-3.5" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-2.5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <span className="relative px-3 text-[11px] font-medium text-stone-400 bg-white">
            Or Login With
          </span>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton
          callback_url="/dashboard"
          onError={(err) => setServerError(err)}
          text="Google"
          className="flex items-center justify-center gap-2 w-full border border-stone-200 hover:border-stone-300 rounded-xl h-10 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-200 cursor-pointer text-xs shadow-2xs hover:shadow-xs"
        />

        {/* Register Prompt */}
        <div className="text-center pt-1.5 text-xs text-stone-600">
          <span>Don&apos;t Have An Account? </span>
          <Link
            href="/register"
            className="font-bold text-amber-600 hover:text-amber-700 underline-offset-2 hover:underline transition-colors"
          >
            Register Now.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
