"use client";

import React, { useState, useEffect } from "react";
import ReviewForm from "./form";
import SuccessComponent from "./success";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import { getReviewModal, setReviewModal } from "./storage";

export interface IPlatformReviewModalState {
  rating: number;
  hovered: number;
  review: string;
}

const PlatformReviewModal = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const [state, setState] = useState<IPlatformReviewModalState>({
    rating: 0,
    hovered: 0,
    review: "",
  });
  const [submitted, setSumitted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show review modal after 10s on homepage for logged-in users (only once)
  useEffect(() => {
    if (!isAuthenticated || !isHomePage) return;

    const hasSeenModal = getReviewModal();
    if (hasSeenModal) return;

    const timer = setTimeout(() => {
      setVisible(true);
      setReviewModal(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isHomePage]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[3px] pointer-events-auto transition-opacity duration-400 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className={`relative pointer-events-auto mx-4 w-full max-w-md transform transition-all duration-500 ease-out ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(48,17,24,0.25)] border border-orange-100 overflow-hidden">
          {/* Decorative top gradient */}
          <div className="h-1.5 bg-gradient-to-r from-[#F25E0A] via-orange-400 to-[#301118]" />
          <ReviewForm
            userName={user?.name}
            state={state}
            show={!submitted}
            setState={setState}
            handleClose={handleClose}
            handleOnSubmit={() => setSumitted(true)}
          />

          {/* Success State */}
          <SuccessComponent rating={state.rating} show={submitted} />
        </div>
      </div>
    </div>
  );
};

export default PlatformReviewModal;
