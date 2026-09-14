"use client";

import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LogIn, UserPlus } from "lucide-react";

interface AuthCTAProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthCTA = ({ setIsMenuOpen }: AuthCTAProps) => {
  const router = useRouter();
  const t = useTranslations("Navigation");

  const signInAction = () => {
    setIsMenuOpen(false);
    router.push(PATHS.SIGN_IN);
  };

  const signUpAction = () => {
    setIsMenuOpen(false);
    router.push(PATHS.REGISTER);
  };

  return (
    <div className="flex gap-2.5 w-full">
      <button
        onClick={signInAction}
        className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-[#e65100] text-white py-2.5 px-3 rounded-xl font-semibold shadow-xs transition-all cursor-pointer text-sm"
      >
        <LogIn className="size-4" />
        {t("common.signIn")}
      </button>

      <button
        onClick={signUpAction}
        className="flex-1 flex items-center justify-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 hover:border-orange-300 text-stone-800 py-2.5 px-3 rounded-xl font-semibold shadow-2xs transition-all cursor-pointer text-sm"
      >
        <UserPlus className="size-4 text-orange-600" />
        {t("common.register")}
      </button>
    </div>
  );
};

export default AuthCTA;

