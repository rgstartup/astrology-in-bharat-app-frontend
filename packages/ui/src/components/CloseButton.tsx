"use client";
import React from "react";
import { X } from "lucide-react";

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ size = 20, className = "", ...props }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-close-btn:hover .custom-close-icon {
          transform: rotate(90deg) scale(1.25);
        }
        .custom-close-icon {
          transition: transform 300ms ease-in-out;
        }
      `}} />
      <button
        {...props}
        className={`custom-close-btn p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors duration-300 ${className}`}
      >
        <X size={size} className="custom-close-icon" />
      </button>
    </>
  );
};
