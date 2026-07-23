"use client";
import React, { useState, useCallback, FormEvent } from "react";
import Head from "next/head";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { Button, VerificationPopup } from "@repo/ui";
import { Loading } from "@/components/ui/Loading";
import { expertInitiateRegistrationAction, expertCompleteRegistrationAction } from "@/actions/auth";
import { CLIENT_API_URL } from "@/lib/config";

const API_URL = CLIENT_API_URL;

// ─── Sub-Components ──────────────────────────────────────────────────────────

const BrandingSection = () => (
  <div className="relative hidden lg:block h-full min-h-[600px]">
    <div className="absolute inset-0 bg-orange-600/90 flex flex-col items-center justify-center text-white p-12 text-center">
      <div className="relative w-64 h-64 mb-8 drop-shadow-2xl">
        <Image
          src="/images/Expert.png"
          alt="Expert Community"
          fill
          sizes="256px"
          className="object-contain -scale-x-100"
          priority
        />
      </div>
      <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
        Join Our <br /> Expert Community
      </h1>
      <p className="text-lg text-white/80 font-medium max-w-sm">
        Register today to start providing your astrology expertise to thousands of seeking clients.
      </p>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-12 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute top-12 right-12 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>
    </div>
  </div>
);

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get("token") || searchParams.get("verification_token");

  const extractEmailFromToken = (token: string | null) => {
    if (!token) return "";
    try {
        const parts = token.split('.');
        if (parts.length < 2) return "";
        const base64Url = parts[1];
        if (!base64Url) return "";
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload)?.email || "";
    } catch {
        return "";
    }
  };

  const [step, setStep] = useState<1 | 2 | 3>(urlToken ? 3 : 1);
  
  // Step 1
  const [email, setEmail] = useState(extractEmailFromToken(urlToken));
  
  // Step 2
  const [showVerification, setShowVerification] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(urlToken || "");
  
  // Step 3
  const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      gender: "other",
      specialization: "",
      experience_in_years: "",
      languages: "",
      aboutMe: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
              ...prev,
              [name]: value,
          }));
      },
      []
  );

  const handleGoogleLogin = () => {
    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, "");
    const redirectUri = typeof window !== "undefined" ? window.location.origin : "";
    window.location.href = `${baseUrl}/api/v1/auth/google/login?role=expert&redirect_uri=${redirectUri}`;
  };

  const handleStep1Submit = async (e: FormEvent) => {
      e.preventDefault();
      if (!email) {
          toast.error("Please enter your email");
          return;
      }

      setIsLoading(true);
      try {
          const result = await expertInitiateRegistrationAction(email);
          if (result.error) {
              toast.error(result.error);
          } else if (result.success) {
              setShowVerification(true);
          }
      } catch {
          toast.error("An unexpected error occurred");
      } finally {
          setIsLoading(false);
      }
  };

  const handleStep3Submit = async (e: FormEvent) => {
      e.preventDefault();
      
      if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
      }
      if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
      }

      setIsLoading(true);

      const payload: any = {
          email,
          token: verifiedToken || "temp-token",
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          specialization: formData.specialization,
          experience_in_years: parseInt(formData.experience_in_years) || 0,
          languages: formData.languages,
          aboutMe: formData.aboutMe,
      };

      try {
          const result = await expertCompleteRegistrationAction(payload);
          if (result.error) {
              toast.error(result.error);
          } else if (result.success) {
              toast.success("Expert Profile completed successfully!");
              router.push("/dashboard");
          }
      } catch {
          toast.error("An unexpected error occurred");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9F4] items-center justify-center p-4 sm:p-6 lg:p-10 font-poppins">
      <Head>
        <title>Expert Sign Up | Astrology in Bharat</title>
      </Head>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-premium bg-white border border-gray-100">
        <BrandingSection />

        <div className={`p-8 sm:p-12 lg:p-16 flex flex-col ${step === 1 ? 'justify-center' : 'justify-start'} bg-white h-full overflow-y-auto max-h-[90vh] custom-scrollbar`}>
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {step === 1 ? "Create Account" : "Complete Profile"}
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              {step === 1 ? "Step into your professional journey" : "Please fill in your expert details."}
            </p>
          </div>

          {step === 1 && (
              <>
              <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 transition-colors text-gray-400 group-focus-within:text-orange-600`} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 group-focus-within:border-orange-500 rounded-2xl text-gray-900 text-sm focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
                        placeholder="expert@example.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    variant="primary"
                    className="bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl shadow-lg shadow-orange-600/20 transform active:scale-95 transition-all font-black text-sm uppercase tracking-widest"
                  >
                    {isLoading ? "Sending OTP..." : "Verify Email"}
                  </Button>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <span className="relative bg-white px-4 text-xs font-black text-gray-400 uppercase tracking-tighter">Or Connect With</span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    variant="outline"
                    fullWidth
                    className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 py-4 rounded-2xl transform active:scale-95 transition-all shadow-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <div className="relative w-5 h-5">
                      <Image src="/images/google-color-svgrepo-com.svg" alt="Google" fill />
                    </div>
                    Sign up with Google
                  </Button>
              </form>
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500 font-medium">
                  Already have an account?{" "}
                  <Link href="/" className="text-orange-600 hover:text-orange-700 font-black border-b-2 border-orange-600/20 hover:border-orange-600 transition-all ml-1">
                    Sign In
                  </Link>
                </p>
              </div>
              </>
          )}

          {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-6">
                  {/* Account Info */}
                  <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Account Setup</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                              <div className="relative">
                                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                              </div>
                          </div>
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                              <div className="relative">
                                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Personal Details */}
                  <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                          </div>
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={15} className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                          </div>
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Gender</label>
                              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium">
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                              </select>
                          </div>
                      </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
                      <div className="grid grid-cols-1 gap-4">
                          <div>
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Specialization (e.g., Vedic, Tarot)</label>
                              <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Experience (Years)</label>
                                  <input type="number" min="0" name="experience_in_years" value={formData.experience_in_years} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                              </div>
                              <div>
                                  <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Languages Known</label>
                                  <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi" className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium" />
                              </div>
                          </div>
                          <div className="mt-2">
                              <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Brief Bio</label>
                              <textarea name="aboutMe" value={formData.aboutMe} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none text-sm font-medium"></textarea>
                          </div>
                      </div>
                  </div>

                  <Button
                      type="submit"
                      disabled={isLoading}
                      fullWidth
                      variant="primary"
                      className="bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl shadow-lg shadow-orange-600/20 transform active:scale-95 transition-all font-black text-sm uppercase tracking-widest mt-6"
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
      {isLoading && <Loading fullScreen />}
    </div>
  );
};

export default RegisterPage;
