"use client";

import React, { useState, useCallback } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import { Loading } from "@repo/ui";
import { loginAction } from "@/actions/auth";
import GoogleLoginButton from "../GoogleLoginButton.component";
import { useTranslations } from "next-intl";
import { stripLocale } from "@/utils/getPathnameOrDefault";
import { useAuthStore } from "@/store/useAuthStore";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const init = useAuthStore((state) => state.init);

  const t = useTranslations("Auth");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    [],
  );

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error(t("signIn.errors.required"));
      return;
    }

    setIsLoading(true);

    try {
      // Use Server Action to validate credentials and set HttpOnly cookies
      const result = await loginAction({
        ...formData,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Fetch client profile into Zustand auth store using the new session cookies
      await init(true);

      // Refresh server components and navigate to callback URL
      router.refresh();
      router.push(stripLocale(callbackUrl));
    } catch {
      toast.error(t("signIn.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="w-full max-w-[480px] mx-auto lg:ml-auto lg:mr-0 bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-10 my-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
        <div>
          <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
            {t("signIn.welcome")}
          </h6>
          <span className="text-xl font-black text-orange block">
            {t("signIn.brandName")}
          </span>
        </div>
        <div className="text-left sm:text-right">
          <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
            {t("signIn.noAccount")}
          </h6>
          <Link
            href="/register"
            className="text-base font-bold text-[#4A1D1F] hover:text-orange transition-all"
          >
            {t("signIn.signUp")}
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-[26px] md:text-3xl font-black text-[#301118]">
          {t("signIn.title")}
        </h2>
        <p className="text-gray-800 text-xs md:text-sm mt-1 font-medium">
          {t("signIn.subtitle")}
        </p>
      </div>

      <div className="mb-6">
        <GoogleLoginButton callbackUrl={callbackUrl} />
      </div>

      <div className="relative mb-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-50"></div>
        </div>
        <span className="relative px-3 text-xs font-semibold text-gray-500 bg-white">
          {t("signIn.orEmail")}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            {t("signIn.emailLabel")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-700 text-black font-semibold text-sm"
            placeholder={t("signIn.emailPlaceholder")}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            {t("signIn.passwordLabel")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange focus:ring-4 focus:ring-orange/5 outline-none transition-all placeholder:text-gray-700 text-black font-semibold text-sm"
              placeholder={t("signIn.passwordPlaceholder")}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 border-0 bg-transparent text-gray-300 hover:text-orange transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`}
              ></i>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-orange hover:opacity-80 transition-all"
          >
            {t("signIn.forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-orange text-white text-base font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer mt-2"
          disabled={isLoading}
        >
          {isLoading ? t("signIn.signingIn") : t("signIn.submit")}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
