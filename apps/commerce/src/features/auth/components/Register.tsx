"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Phone, Store, UserPlus, ShieldCheck, ShoppingBag, Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { merchantInitiateRegistrationAction, merchantCompleteRegistrationAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { env } from "@/lib/config/env";
import { Button } from "@repo/ui";

// ─── Verification Popup Component ───────────────────────────────────────────
const VerificationPopup = ({ isOpen, email, onClose }: { isOpen: boolean; email: string; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-orange-50/50">
            <Mail className="w-10 h-10 text-[#fd6410]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Check Your Inbox!</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            We've sent a magic link to <br/>
            <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg mt-2 inline-block border border-gray-100">
              {email}
            </span>
          </p>

          <Button
            onClick={() => window.open(`https://${email.split('@')[1]}`, '_blank')}
            variant="primary"
            fullWidth
            className="bg-[#fd6410] hover:bg-orange-600 py-4 rounded-2xl shadow-lg shadow-orange-500/20 font-bold text-sm"
          >
            Open Mail App
          </Button>

          <p className="mt-6 text-xs font-bold text-gray-400">
            Didn't receive it? <button className="text-[#fd6410] hover:underline" onClick={onClose}>Try again</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Branding Section ─────────────────────────────────────────

const BrandingSection = () => (
  <div className="relative hidden lg:block h-full min-h-[600px] overflow-hidden">
    <div className="absolute inset-0 bg-[#fd6410]/95 flex flex-col items-center justify-center text-white p-12 text-center">
      {/* Decorative Circles */}
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      
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
        Join our Network
      </motion.h1>
      <p className="text-white/80 font-medium max-w-sm">
        Start selling your products to thousands of customers across India. Complete your profile to get started.
      </p>

      <div className="mt-12 space-y-4 w-full max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-4 text-left group hover:bg-white/20 transition-all">
             <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-white/50">Secure Platform</p>
                <p className="text-xs font-medium text-white/80">Safe & Trusted Merchant Hub</p>
             </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-4 text-left group hover:bg-white/20 transition-all">
             <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <ShoppingBag className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-white/50">Global Reach</p>
                <p className="text-xs font-medium text-white/80">Sell to millions of seekers</p>
             </div>
          </div>
      </div>
    </div>
  </div>
);

// ─── Main Register Component ────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  
  const token = searchParams.get("token");

  // Extract email from JWT token (same as main/expert app)
  const extractEmailFromToken = (tkn: string | null): string => {
    if (!tkn) return "";
    try {
      const parts = tkn.split('.');
      if (parts.length < 2) return "";
      const base64Url = parts[1];
      if (!base64Url) return "";
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload)?.email || "";
    } catch {
      return "";
    }
  };
  
  const [step, setStep] = useState(token ? 3 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(() => extractEmailFromToken(token));
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
      shopName: "",
      phone: "",
      password: "",
      confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return toast.error("Please enter your email");

      setIsLoading(true);
      try {
          const result = await merchantInitiateRegistrationAction(email);
          if (result.error) {
              toast.error(result.error);
          } else {
              setStep(2);
              setShowVerification(true);
          }
      } catch {
          toast.error("An unexpected error occurred");
      } finally {
          setIsLoading(false);
      }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
          return toast.error("Passwords do not match!");
      }

      setIsLoading(true);
      try {
          const payload = {
              token,
              email,                           // ✅ backend requires @IsNotEmpty() email
              name: formData.shopName,          // ✅ backend requires @IsNotEmpty() name
              shopName: formData.shopName,
              phone: formData.phone,
              password: formData.password,
          };

          const result = await merchantCompleteRegistrationAction(payload);
          
          if (result.error) {
              toast.error(result.error);
          } else if (result.success) {
              toast.success("Merchant Profile completed successfully!");
              if (result.user) {
                  await login("token_handled_by_cookies", result.user);
              }
              router.push("/dashboard");
          }
      } catch {
          toast.error("An unexpected error occurred");
      } finally {
          setIsLoading(false);
      }
  };

  const handleGoogleLogin = () => {
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
    const redirectUri = typeof window !== "undefined" ? window.location.origin : "";
    window.location.href = `${baseUrl}/api/v1/auth/google/login?role=merchant&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-outfit overflow-hidden">
      <div className="w-full max-w-5xl h-full max-h-[850px] grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-premium bg-white border border-gray-100">
        
        {/* Branding Section */}
        <BrandingSection />

        {/* Form Section */}
        <div className={`p-8 sm:p-12 lg:p-16 flex flex-col ${step === 1 ? 'justify-center' : 'justify-start'} bg-white overflow-y-auto custom-scrollbar no-scrollbar`}>
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {step === 1 ? "Merchant Sign Up" : "Complete Profile"}
            </h2>
            <p className="mt-2 text-gray-700 font-medium italic underline decoration-[#fd6410]/20 underline-offset-4">
              {step === 1 ? "Create your digital storefront today." : "Let's setup your shop details."}
            </p>
          </div>

          {step === 1 && (
              <>
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-[#fd6410] transition-colors duration-300" />
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 group-focus-within:border-[#fd6410] group-focus-within:ring-4 group-focus-within:ring-orange-500/10 rounded-2xl text-gray-900 placeholder-gray-500 text-sm outline-none font-medium transition-all duration-300"
                      placeholder="shop@example.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  variant="primary"
                  className="bg-[#fd6410] hover:bg-orange-600 py-4.5 rounded-2xl shadow-xl shadow-orange-500/20 transform active:scale-95 transition-all font-bold text-sm mt-6"
                >
                  {isLoading ? "Sending Link..." : "Continue with Email"}
                </Button>
              </form>

              <div className="relative flex items-center justify-center py-6">
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

              <div className="text-center mt-10">
                <p className="text-xs text-gray-400 font-bold tracking-tight">
                  Already have a shop?{" "}
                  <Link href="/login" className="text-[#fd6410] hover:text-orange-700 transition-all underline decoration-[#fd6410]/30 underline-offset-4 decoration-2">
                    Sign In
                  </Link>
                </p>
              </div>
              </>
          )}

          {step === 2 && (
              <div className="text-center py-10">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-10 h-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-500">We sent a verification link to<br/><strong className="text-gray-900">{email}</strong></p>
                  <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="mt-8 text-xs font-bold"
                  >
                      Wrong Email?
                  </Button>
              </div>
          )}

          {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-6">
                  {/* Account Info */}
                  <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Account Setup</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Password</label>
                              <div className="relative group">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-300 group-focus-within:text-[#fd6410] transition-colors" />
                                  </div>
                                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required className="w-full pl-11 pr-12 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                              </div>
                          </div>
                          <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Confirm Password</label>
                              <div className="relative group">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-4 w-4 text-gray-300 group-focus-within:text-[#fd6410] transition-colors" />
                                  </div>
                                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full pl-11 pr-12 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Shop Details */}
                  <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Shop Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Shop Name</label>
                              <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <Store className="h-4 w-4 text-gray-300 group-focus-within:text-[#fd6410] transition-colors" />
                                </div>
                                <input type="text" name="shopName" value={formData.shopName} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Phone Number</label>
                              <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <Phone className="h-4 w-4 text-gray-300 group-focus-within:text-[#fd6410] transition-colors" />
                                </div>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={15} className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <Button
                      type="submit"
                      loading={isLoading}
                      fullWidth
                      variant="primary"
                      className="bg-[#fd6410] hover:bg-orange-600 py-4.5 rounded-2xl shadow-xl shadow-orange-500/20 transform active:scale-95 transition-all font-bold text-sm mt-6"
                  >
                      {isLoading ? "Saving Profile..." : "Complete Registration"}
                  </Button>
              </form>
          )}
        </div>
      </div>

      <VerificationPopup
          isOpen={showVerification}
          email={email}
          onClose={() => setShowVerification(false)}
      />
    </div>
  );
};

export default RegisterPage;
