"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Reusable premium button component.
 * Features: Variants, Sizes, Loading states, and Custom Transitions.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-full select-none";
  
  const variants = {
    primary: "bg-[#FF6B00] text-white hover:bg-[#E65100] shadow-md hover:shadow-orange-200",
    secondary: "bg-[#4A1D1F] text-white hover:bg-[#381416] shadow-md hover:shadow-maroon-200",
    outline: "border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50 bg-transparent flex gap-3 px-6 py-2.5 rounded-full items-center",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    gold: "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:opacity-90 shadow-md",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
