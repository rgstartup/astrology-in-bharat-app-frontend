"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { type LoginFormData, LoginSchema } from "@/types/auth";
import { Button } from "@repo/ui";
import { useAuthStore } from "@/store/auth.store";
import { expertLoginAction } from "@/actions/auth";
import { useState } from "react";
import Image from "next/image";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore();
  const { handleGoogleLogin } = useGoogleLogin({ callback_url: "/dashboard" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await expertLoginAction(data);
      if (result.success) {
        await login(result.user);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
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
              errors.email ? "border-red-300" : "border-gray-200 group-focus-within:border-orange-500"
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
              errors.password ? "border-red-300" : "border-gray-200 group-focus-within:border-orange-500"
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
          disabled={isSubmitting}
          fullWidth
          variant="primary"
          className="bg-orange-600 hover:bg-orange-700 py-4.5 rounded-2xl shadow-xl shadow-orange-600/20 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
          {!isSubmitting && (
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
          <Image src="/images/google-color-svgrepo-com.svg" alt="Google" height={18} width={18} />
          Sign in with Google
        </button>
      </div>
    </form>
  );
};
