"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, KeyRound, ShieldCheck, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { ForgotPasswordSchema, ForgotPasswordFormData } from "@/types/auth";
import { merchantForgotPasswordAction } from "@/actions/auth";
import { getErrorMessage } from "@repo/lib";

// ─── Branding Section (Expert Style) ─────────────────────────────────────────

const BrandingSection = () => (
  <div className="relative hidden lg:block h-full min-h-[600px] overflow-hidden">
    <div className="absolute inset-0 bg-[#fd6410]/95 flex flex-col items-center justify-center text-white p-12 text-center">
      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-20 -left-20 w-80 h-80 border border-white/5 rounded-full" />
      
      <div className="relative w-64 h-64 mb-4 drop-shadow-2xl">
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
        Account Recovery
      </motion.h1>
      <p className="text-white/80 font-medium max-w-sm">
        Don't worry! It happens to the best of us. Enter your email to reset your secure merchant password.
      </p>


    </div>
  </div>
);

// ─── ForgotPassword Component ───────────────────────────────────────────────

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const result = await merchantForgotPasswordAction(data.email);
      
      if (result.success) {
        setSuccess(true);
        toast.success(result.message || "Reset link sent to your email!");
      } else {
        toast.error(result.error || "Process failed. Please try again.");
      }
    } catch (err) {
      console.error("Forgot error:", err);
      toast.error(getErrorMessage(err) || "Process failed. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-outfit overflow-hidden">
      <div className="w-full max-w-6xl h-full max-h-[850px] grid grid-cols-1 lg:grid-cols-2 rounded-[40px] shadow-2xl bg-white border border-gray-100 overflow-hidden">
        
        {/* Branding Section */}
        <BrandingSection />

        {/* Form Section */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto no-scrollbar">
          <Link href="/login" className="flex items-center gap-2 text-gray-500 hover:text-[#fd6410] font-semibold text-sm mb-12 transition-all group w-max">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Back to Login
          </Link>

          {!success ? (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
                <p className="mt-2 text-gray-700 font-medium italic underline decoration-orange-200 underline-offset-4 decoration-2">Enter your work email to recover.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-rose-400' : 'text-gray-300 group-focus-within:text-[#fd6410]'}`} />
                    </div>
                    <input {...register("email")} className={`block w-full pl-12 pr-4 py-4 bg-gray-50/50 border ${errors.email ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-gray-200 group-focus-within:border-[#fd6410] focus:ring-4 focus:ring-orange-500/10'} rounded-2xl placeholder-gray-500 text-sm outline-none transition-all font-medium`} placeholder="merchant@domain.com" />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#fd6410] hover:bg-orange-600 active:scale-95 text-white py-4.5 rounded-2xl shadow-xl shadow-orange-500/20 font-bold text-sm flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><Mail className="w-4 h-4" /></motion.div>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-green-50 rounded-[2.5rem] border border-green-100">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-green-600" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">Mail Sent!</h3>
               <p className="text-gray-600 font-medium mb-8">We've sent a secure password reset link to your email. Please check your inbox and spam folder.</p>
               <Link href="/login" className="inline-block px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-green-900/10 active:scale-95 transition-all">
                  Return to Dashboard
               </Link>
            </motion.div>
          )}

          <div className="mt-12 flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-gray-100" />
             <ShoppingBag className="w-4 h-4 text-gray-200" />
             <div className="h-px w-8 bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
