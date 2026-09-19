"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/auth";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import GoogleLoginButton from "../GoogleLoginButton.component";
import { AuthHeader } from "../AuthHeader";
import { useTranslations } from "next-intl";
import { PATHS } from "@repo/routes";
import { stripLocale, withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useAuthStore } from "@/store/useAuthStore";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback_url =
    searchParams.get("callback_url") ||
    searchParams.get("callbackUrl") ||
    "/dashboard";
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
      router.push(stripLocale(callback_url));
    } catch {
      toast.error(t("signIn.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] sm:max-w-[480px] mx-auto lg:mx-0 py-0">
      {/* Top Header with Expert emblem alongside brand name */}
      <AuthHeader subtitle={t("signIn.header")} />

      {/* Google Login Button */}
      <div className="mb-4 sm:mb-5">
        <GoogleLoginButton callback_url={callback_url} />
      </div>

      {/* Divider */}
      <div className="relative my-4 sm:my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <span className="relative px-3 text-xs font-medium text-stone-500 bg-white">
          {t("signIn.orEmail")}
        </span>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        <div>
          <Label
            htmlFor="email"
            className="block text-xs font-semibold text-stone-700 mb-1.5"
          >
            {t("signIn.emailLabel")}
          </Label>
          <InputGroup className="h-11">
            <InputGroupAddon align="start">
              <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder={t("signIn.emailPlaceholder")}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
        </div>

        <div>
          <Label
            htmlFor="password"
            className="block text-xs font-semibold text-stone-700 mb-1.5"
          >
            {t("signIn.passwordLabel")}
          </Label>
          <InputGroup className="h-11">
            <InputGroupAddon align="start">
              <Lock className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder={t("signIn.passwordPlaceholder")}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <InputGroupAddon align="end">
              <InputGroupButton
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex justify-end pt-1">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-stone-500 hover:text-orange hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-orange/30 rounded-sm"
          >
            {t("signIn.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-11.5 rounded-full bg-gradient-to-r from-orange to-[#EA580C] hover:from-orange/95 hover:to-[#C2410C] text-white text-sm font-bold shadow-md shadow-orange/20 hover:shadow-lg hover:shadow-orange/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2.5 sm:mt-3 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>{t("signIn.signingIn")}</span>
            </>
          ) : (
            <span>{t("signIn.submit")}</span>
          )}
        </Button>

        {/* Secondary registration prompt */}
        <div className="text-center pt-2 sm:pt-3 text-xs sm:text-sm text-stone-600">
          <span>{t("signIn.noAccount")} </span>
          <Link
            href={withCallbackUrl(
              PATHS.REGISTER,
              callback_url !== "/dashboard" ? callback_url : undefined,
            )}
            className="font-bold text-orange hover:text-[#EA580C] underline-offset-2 hover:underline transition-colors"
          >
            {t("signIn.signUp")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
