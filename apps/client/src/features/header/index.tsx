"use client";

import React, { useEffect, useRef } from "react";
import ProfileImagePreviewModal from "./profile-image-preview.modal";
import BottomHeader from "./bottom";
import TopHeader from "./top";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { cn } from "@/lib/utils";

const Header: React.FC<{ show: boolean }> = ({ show }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { isVisible, isScrolled } = useHeaderScroll();

  useEffect(() => {
    if (!show) {
      document.documentElement.style.setProperty("--header-height", "0px");
      return;
    }

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        ref={headerRef}
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
