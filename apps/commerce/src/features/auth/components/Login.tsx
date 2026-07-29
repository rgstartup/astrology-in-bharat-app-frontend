"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { LoginSchema, LoginFormData } from "@/types/auth";
import { merchantLoginAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@repo/lib";
import { env } from "@/lib/config/env";

// ─── Branding Section (Expert Style) ─────────────────────────────────────────

const BrandingSection = ({ stats }: { stats: { totalMerchants: string; totalProductsSold: string } }) => (
  <div className="relative hidden lg:block h-full min-h-[600px] overflow-hidden">
    <div className="absolute inset-0 bg-[#fd6410]/95 flex flex-col items-center justify-start text-white pt-2 pb-12 px-12 text-center">
      {/* Decorative Floating Circles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
      />

      <div className="relative w-72 h-72 mb-4 drop-shadow-2xl">
        <Image
          src="/images/logo.png"
          alt="Merchant Community"
          fill
          className="object-contain -scale-x-100"
          priority
        />
      </div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl font-bold mb-4 tracking-tight"
      >
        Merchant Hub
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-white/80 font-medium max-w-sm"
      >
        Scale your business, reach lakhs of customers, and manage your shop with ease.
      </motion.p>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-6 grid grid-cols-2 gap-3 w-full max-w-[220px]"
      >
        <div className="bg-white/10 backdrop-blur-sm p-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 cursor-default group">
          <TrendingUp className="w-4 h-4 mb-1 opacity-60 group-hover:opacity-100 transition-opacity" />
          <p className="text-xl font-bold italic tracking-tighter">{stats.totalProductsSold}</p>
          <p className="text-[9px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">Product Sold</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 cursor-default group">
          <Users className="w-4 h-4 mb-1 opacity-60 group-hover:opacity-100 transition-opacity" />
          <p className="text-xl font-bold italic tracking-tighter">{stats.totalMerchants}</p>
          <p className="text-[9px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">Merchants</p>
        </div>
      </motion.div>
    </div>
  </div>
);

// ─── Main Login Component ───────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [stats, setStats] = useState({ 
    totalMerchants: "10k+", 
    totalProductsSold: "1 Lakh+" 
  });

  const formatNumber = (num: number, type: 'merchants' | 'products') => {
    if (type === 'products') {
      if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakh+`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k+`;
    } else {
      if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakh+`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k+`;
    }
    return num.toString();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/public/stats/merchant-hub`);
        const json = await response.json();
        if (json.success) {
          setStats({
            totalMerchants: formatNumber(json.data.totalMerchants, 'merchants'),
            totalProductsSold: formatNumber(json.data.totalProductsSold, 'products')
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError("");

    try {
      const result = await merchantLoginAction(data);
      
      if (result.success) {
        await login("token_handled_by_cookies", result.user);
        toast.success("Welcome back, Merchant!");
        router.push("/dashboard");
      } else {
        setServerError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setServerError(getErrorMessage(err) || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
    const redirectUri = typeof window !== "undefined" ? window.location.origin + "/dashboard" : "";
    window.location.href = `${baseUrl}/api/v1/auth/google/login?role=merchant&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-outfit overflow-hidden">
      <div className="w-full max-w-6xl h-full max-h-[850px] grid grid-cols-1 lg:grid-cols-2 rounded-[40px] shadow-2xl bg-white border border-gray-100 overflow-hidden">
        
        {/* Branding Section */}
        <BrandingSection stats={stats} />

        {/* Form Section */}
        <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto no-scrollbar">
          
          {/* Top Right Corner Link */}
          <div className="absolute top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 text-right z-10">
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-tight">
              <Link href="/register" className="text-[#fd6410] hover:text-orange-700 transition-all underline decoration-[#fd6410]/30 underline-offset-4 decoration-2">
                Create Account
              </Link>
            </p>
          </div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center lg:text-left"
          >
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Login</h2>
            <p className="mt-2 text-gray-700 font-medium italic underline decoration-[#fd6410]/20 underline-offset-4">Your store, your rules.</p>
          </motion.div>

          <AnimatePresence>
            {serverError && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
              >
                <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-bold tracking-tight">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors duration-300 ${errors.email ? 'text-rose-400' : 'text-gray-300 group-focus-within:text-[#fd6410]'}`} />
                </div>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={`block w-full pl-12 pr-4 py-4 bg-gray-50/50 border transition-all duration-300 ${errors.email ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-gray-200 group-focus-within:border-[#fd6410] group-focus-within:ring-4 group-focus-within:ring-orange-500/10'} rounded-2xl text-gray-900 placeholder-gray-500 text-sm outline-none font-medium`}
                  placeholder="shop@example.com"
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1 transition-all duration-300">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] font-bold text-[#fd6410] hover:text-orange-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors duration-300 ${errors.password ? 'text-rose-400' : 'text-gray-300 group-focus-within:text-[#fd6410]'}`} />
                </div>
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`block w-full pl-12 pr-12 py-4 bg-gray-50/50 border transition-all duration-300 ${errors.password ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-gray-200 group-focus-within:border-[#fd6410] group-focus-within:ring-4 group-focus-within:ring-orange-500/10'} rounded-2xl text-gray-900 placeholder-gray-500 text-sm outline-none font-medium`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-[#fd6410] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1 transition-all duration-300">{errors.password.message}</p>}
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#fd6410] hover:bg-orange-600 active:scale-95 disabled:opacity-70 text-white py-4.5 rounded-2xl shadow-xl shadow-orange-500/20 font-bold text-sm flex items-center justify-center gap-2 group transition-all duration-300"
              >
                {loading ? "Authenticating..." : "Login"}
                {!loading && <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative px-4 bg-white text-[10px] font-bold text-gray-700">Or continue with</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl hover:border-orange-100 hover:bg-orange-50/30 transition-all font-semibold text-sm text-gray-700"
              >
                <div className="w-5 h-5 relative">
                   <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    fill
                    className="object-contain"
                  />
                </div>
                Continue with Google
              </button>
            </div>

            {/* The sign up link was moved to the top right corner */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
