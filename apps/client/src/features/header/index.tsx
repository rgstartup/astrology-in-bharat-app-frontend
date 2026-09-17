"use client";

import React from "react";
import ProfileImagePreviewModal from "./profile-image-preview.modal";
import BottomHeader from "./bottom";
import TopHeader from "./top";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { cn } from "@/lib/utils";

const Header: React.FC<{ show: boolean }> = ({ show }) => {
  const { isVisible, isScrolled } = useHeaderScroll();

  if (!show) return null;

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-50 w-full transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isScrolled && "shadow-md"
        )}
      >
        <TopHeader />
        <BottomHeader />
      </div>

      {/* <SubHeaderSlider /> */}

      {/* Profile Image Preview Modal */}
      <ProfileImagePreviewModal />
    </>
  );
};

export default Header;
