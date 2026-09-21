"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useOnboardStore } from "@/store/useOnboardStore";

interface OnboardingStepTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const OnboardingStepTransition: React.FC<OnboardingStepTransitionProps> = ({
  children,
  className = "flex flex-col flex-1",
}) => {
  const direction = useOnboardStore((s) => s.direction) || "forward";

  return (
    <div
      className={cn(
        "w-full flex flex-col flex-1",
        direction === "backward"
          ? "animate-[onboarding-fade-in-left_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          : "animate-[onboarding-fade-in-right_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]",
        className
      )}
    >
      {children}
    </div>
  );
};
