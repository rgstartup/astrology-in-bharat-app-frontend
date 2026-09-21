"use client";

import React from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, Wallet, LogOut, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { PATHS } from "@repo/routes";
import { formatCompactNumber } from "@repo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";

interface ProfileCTAProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileCTA: React.FC<ProfileCTAProps> = ({ setIsMenuOpen }) => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, balance, logout } = useAuth();

  const handleClose = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    handleClose();
    const redirectUrl = await logout(pathname);
    router.push(redirectUrl);
  };

  const userDisplayName = user?.name?.trim() || "User";
  const userIdentifier = user?.email || user?.phone || "Verified Account";
  const userInitial = userDisplayName.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.avatar || "";

  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        {/* User Profile Card */}
        <Link
          href={PATHS.PROFILE}
          onClick={handleClose}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-orange-200 hover:bg-orange-50/40 active:scale-[0.99] transition-all no-underline text-stone-900 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-9 ring-1.5 ring-orange shadow-xs shrink-0">
              <AvatarImage src={avatarUrl} alt={userDisplayName} />
              <AvatarFallback className="bg-orange text-white font-bold text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-[13.5px] text-stone-900 truncate leading-tight group-hover:text-orange-600 transition-colors">
                {userDisplayName}
              </p>
              <p className="text-[11px] text-stone-500 truncate leading-tight mt-0.5 font-normal">
                {userIdentifier}
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Action Row: Wallet & Logout */}
        <div className="flex items-center gap-2">
          <Link
            href={`${PATHS.PROFILE}?tab=wallet`}
            onClick={handleClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] text-amber-900 text-xs font-semibold no-underline border border-amber-200/60 transition-all"
          >
            <Wallet className="size-3.5 text-amber-700" />
            <span>₹{formatCompactNumber(balance ?? 0)}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-700 text-xs font-semibold border border-red-200/60 transition-all cursor-pointer"
          >
            <LogOut className="size-3.5 text-red-600" />
            <span>{t("common.logout")}</span>
          </button>
        </div>
      </div>
    );
  }

  // Guest Profile CTA Card
  const profileHref = withCallbackUrl(PATHS.LOGIN, PATHS.PROFILE);

  return (
    <Link
      href={profileHref}
      onClick={handleClose}
      className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange to-[#ff7a1a] text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all no-underline group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
          <User className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[14px] text-white">
              {t("common.myProfile")}
            </span>
            <Sparkles className="size-3 text-amber-200" />
          </div>
          <p className="text-[11.5px] text-white/85 truncate mt-0.5 leading-tight font-normal">
            Sign in to view profile & orders
          </p>
        </div>
      </div>
      <ChevronRight className="size-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
};

export default ProfileCTA;
