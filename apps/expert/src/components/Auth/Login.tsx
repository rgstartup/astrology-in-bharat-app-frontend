"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { Button } from "@repo/ui";
import { Loading } from "@/components/ui/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginSchema, LoginFormData } from "@/types/auth";
import { expertLoginAction } from "@/actions/auth";
import { CLIENT_API_URL } from "@/lib/config";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const BrandingSection = ({ stats }: { stats: { totalSeekers: string; averageRating: string } }) => (
  <div className="relative hidden lg:block h-full min-h-[600px]">
    <div className="absolute inset-0 bg-orange-600/95 flex flex-col items-center justify-start text-white pt-4 pb-12 px-12 text-center">
      <div className="relative w-56 h-56 mb-8 drop-shadow-2xl">
        <Image
          src="/images/Expert.png"
          alt="Expert Community"
          fill
          sizes="224px"
          className="object-contain -scale-x-100"
          priority
        />
      </div>
      <h1 className="text-4xl font-black mb-4 tracking-tight">Welcome Back</h1>
      <p className="text-white/80 font-medium max-w-sm">
        Connect with seekers, share your cosmic wisdom, and grow your spiritual practice.
      </p>
      
      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
          <p className="text-2xl font-black">{stats.totalExperts}</p>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Total Experts</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
          <p className="text-2xl font-black">{stats.totalServices}</p>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Services Given</p>
        </div>
      </div>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [stats, setStats] = useState({ 
    totalExperts: "0+", 
    totalServices: "0+" 
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      const message = errorParam === 'google_auth_failed' ? 'Google login failed.' : decodeURIComponent(errorParam);
      setServerError(message);
      toast.error(message);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${CLIENT_API_URL}/public/stats/expert-hub`);
      const json = await response.json();
      if (json.success && json.data) {
        const experts = json.data.total_experts ?? json.data.totalExperts ?? 0;
        const services = json.data.totalServices ?? 0;
        
        setStats({
          totalExperts: `${experts}+`,
          totalServices: `${services}+`
        });
      }
    } catch (error) {
      console.error("Failed to fetch expert stats:", error);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError("");

    try {
      const result = await expertLoginAction(data);

      if (result.success) {
        await login("", result.user);
        toast.success("Welcome back, Expert!");
        router.push("/dashboard");
      } else {
        setServerError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    const baseUrl = CLIENT_API_URL.replace(/\/api\/v1\/?$/, "");
    const redirectUri = typeof window !== "undefined" ? window.location.origin + "/dashboard" : "";
    window.location.href = `${baseUrl}/api/v1/auth/google/login?role=expert&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-poppins overflow-hidden">
      <Head>
        <title>Expert Login | Astrology in Bharat</title>
      </Head>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] sm:rounded-[40px] shadow-premium bg-white border border-gray-100 max-h-[95vh] overflow-y-auto no-scrollbar">
        <BrandingSection stats={stats} />

        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white min-h-fit">
          <div className="mb-10 flex items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Login</h2>
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
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-600 group-focus-within:text-orange-600'}`} />
                </div>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={`block w-full pl-12 pr-4 py-4 bg-gray-50/50 border ${errors.email ? 'border-red-300' : 'border-gray-200 group-focus-within:border-orange-500'} rounded-2xl text-gray-900 placeholder:text-gray-500 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
                  placeholder="expert@example.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-900">
                  Password
                </label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-600 group-focus-within:text-orange-600'}`} />
                </div>
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`block w-full pl-12 pr-12 py-4 bg-gray-50/50 border ${errors.password ? 'border-red-300' : 'border-gray-200 group-focus-within:border-orange-500'} rounded-2xl text-gray-900 placeholder:text-gray-500 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
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
              {errors.password && <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.password.message}</p>}
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
                {!loading && <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-600">Or continue with</span>
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
      </div>
      
      {loading && <Loading fullScreen />}
    </div>
  );
};

export default LoginPage;
