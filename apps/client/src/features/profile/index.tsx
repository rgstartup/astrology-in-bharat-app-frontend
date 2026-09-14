"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/store/useAuthStore";
import { usePathname, useRouter } from "@/i18n/navigation";
import ProfileDropdown from "./profile-dropdown";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { getProfileImageUrl } from "@/utils/image-utils";

const UserProfileDropdown = () => {
  const { user, isAuthenticated, logout, openImageModal } = useAuth();

  const router = useRouter();

  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    const redirectUrl = await logout(pathname);
    router.push(redirectUrl);
  };

  useClickOutside(ref, () => setShowProfileDropdown(false));
  useScrollClose(() => setShowProfileDropdown(false));

  if (!isAuthenticated) return null;

  return (
    <div className="profile-dropdown-container relative" ref={ref}>
      <div className="flex items-center gap-2">
        <div
          className="cursor-pointer"
          onClick={openImageModal}
          title="View Profile Picture"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #f25e0a",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src={getProfileImageUrl(user?.avatar, user?.name)}
            alt="Profile"
            width={35}
            height={35}
            className="object-cover w-full h-full rounded-full"
            loading="lazy"
          />
        </div>
        <i
          className="fa-solid fa-ellipsis-vertical text-white cursor-pointer p-1"
          style={{ fontSize: "18px" }}
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        />
      </div>

      <ProfileDropdown
        user={user}
        handleLogout={handleLogout}
        setShowProfileDropdown={setShowProfileDropdown}
        showProfileDropdown={showProfileDropdown}
      />
    </div>
  );
};

export default UserProfileDropdown;
