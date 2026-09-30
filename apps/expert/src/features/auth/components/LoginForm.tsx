"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, Link } from "@/i18n/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
          <Button type="button" variant="secondary" size="sm">
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

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {/* Email FormField */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`h-5 w-5 transition-colors ${
                          fieldState.error
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-orange-600"
                        }`}
                      />
                    </div>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      className={`pl-12 ${
                        fieldState.error ? "border-red-300 focus-visible:border-red-500" : ""
                      }`}
                      placeholder="expert@example.com"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password FormField */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between ml-1">
                  <FormLabel className="ml-0">Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`h-5 w-5 transition-colors ${
                          fieldState.error
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-orange-600"
                        }`}
                      />
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`pl-12 pr-12 ${
                        fieldState.error ? "border-red-300 focus-visible:border-red-500" : ""
                      }`}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 space-y-4">
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="default"
              size="lg"
              className="flex items-center justify-center gap-2 group shadow-xl shadow-orange-600/20"
            >
              {loading ? "Signing In..." : "Sign In to Dashboard"}
              {!loading && (
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>

            <div className="relative flex items-center justify-center py-2">
              <Separator className="absolute inset-0 my-auto" />
              <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-500">
                Or continue with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 font-black text-xs"
            >
              <Image
                src="/images/google-color-svgrepo-com.svg"
                alt="Google"
                height={18}
                width={18}
              />
              Sign in with Google
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
