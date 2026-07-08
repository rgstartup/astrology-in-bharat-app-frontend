"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle } from "lucide-react";
import { CloseButton } from "./CloseButton";

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  title?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  buttonText?: string;
  onConfirm?: () => void;
}

export const VerificationPopup: React.FC<VerificationPopupProps> = ({
  isOpen,
  onClose,
  email,
  title = "Verify Your Email",
  description,
  icon,
  buttonText = "I Understand",
  onConfirm,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // SSR guard — portals need document to be available
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered || !isMounted) return null;

  const modal = (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        <CloseButton onClick={onClose} className="absolute top-4 right-4" />

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange/20 rounded-full blur-xl transition-colors duration-500"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-orange/5 to-orange/15 rounded-full flex items-center justify-center animate-pulse relative z-10 border border-orange/20 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
              {icon || <CheckCircle className="w-10 h-10 text-orange" />}
            </div>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">
            {title}
          </h3>

          <div className="text-gray-600 mb-6 leading-relaxed">
            {description || (
              <>
                We've sent a verification link to <br />
                <span className="font-bold text-gray-900">{email}</span>
                <br />
                Please check your inbox (and spam folder) to activate your account.
              </>
            )}
          </div>

          <button
            onClick={onConfirm || onClose}
            className="group relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange to-[#FF5500] text-white font-extrabold text-base tracking-wide shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-300 border-b-[4px] border-[#CC4400] overflow-hidden"
          >
            {/* 3D Depth overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            {/* Hover shine effect */}
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] group-hover:animate-[none] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
            <span className="relative z-10">{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

