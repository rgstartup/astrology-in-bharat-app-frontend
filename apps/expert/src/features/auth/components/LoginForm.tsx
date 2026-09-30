"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { Button } from "@repo/ui";
import { useAuthStore } from "@/store/auth.store";
import { LoginSchema, type LoginFormData } from "@/types/auth";
import { expertLoginAction } from "@/actions/auth";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

export interface LoginFormProps {
  onLoadingChange?: (loading: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoadingChange }) => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { handleGoogleLogin } = useGoogleLogin({
    callback_url: "/dashboard",
    onError: (err) => setServerError(err),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const updateLoading = (val: boolean) => {
    setLoading(val);
    onLoadingChange?.(val);
  };

  const onSubmit = async (data: LoginFormData) => {
    updateLoading(true);
    setServerError("");

    try {
      const result = await expertLoginAction(data);

      if (result.success) {
        await login(result.user);
        toast.success("Welcome back, Expert!");
        router.push("/dashboard");
      } else {
        setServerError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("An unexpected error occurred.");
    } finally {
      updateLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white min-h-fit">
      <div className="mb-10 flex items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Login</h2>
        </div>
        <Link href="/register" className="shrink-0">
          <Button
            type="button"
            className="px-5 py-2.5 border border-orange-500/20 hover:border-orange-500 bg-orange-50/60 hover:bg-orange-100/60 text-orange-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Sign Up
          </Button>
        </Link>
      </div>

      {serverError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-bold">{serverError}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 ml-1"
          >
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail
                className={`h-5 w-5 transition-colors ${
                  errors.email ? "text-red-400" : "text-gray-600 group-focus-within:text-orange-600"
                }`}
              />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`block w-full pl-12 pr-4 py-4 bg-gray-50/50 border ${
                errors.email
                  ? "border-red-300"
                  : "border-gray-200 group-focus-within:border-orange-500"
              } rounded-2xl text-gray-900 placeholder:text-gray-500 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
              placeholder="expert@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-widest text-gray-900"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock
                className={`h-5 w-5 transition-colors ${
                  errors.password ? "text-red-400" : "text-gray-600 group-focus-within:text-orange-600"
                }`}
              />
            </div>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              className={`block w-full pl-12 pr-12 py-4 bg-gray-50/50 border ${
                errors.password
                  ? "border-red-300"
                  : "border-gray-200 group-focus-within:border-orange-500"
              } rounded-2xl text-gray-900 placeholder:text-gray-500 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            variant="primary"
            className="bg-orange-600 hover:bg-orange-700 py-4.5 rounded-2xl shadow-xl shadow-orange-600/20 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group"
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
            {!loading && (
              <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-600">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/30 transition-all font-black text-xs uppercase tracking-widest text-gray-800"
          >
            <Image
              src="/images/google-color-svgrepo-com.svg"
              alt="Google"
              height={18}
              width={18}
            />
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
