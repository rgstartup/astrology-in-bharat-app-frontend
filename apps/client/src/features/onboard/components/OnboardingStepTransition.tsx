"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useOnboardStore } from "@/store/useOnboardStore";

interface OnboardingStepTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "forward" | "backward";
}

export const OnboardingStepTransition: React.FC<OnboardingStepTransitionProps> = ({
  children,
  className = "flex flex-col flex-1",
  direction: propDirection,
}) => {
  // Capture initial direction at mount time so that store direction updates
  // triggered right before navigation (e.g. clicking 'Back') don't re-trigger
  // the CSS animation on the current unmounting page.
  const initialDirectionRef = React.useRef(
    propDirection || useOnboardStore.getState().direction || "forward"
  );

  const activeDirection = propDirection || initialDirectionRef.current;

  return (
    <div
      className={cn(
        "w-full flex flex-col flex-1",
        activeDirection === "backward"
          ? "animate-[onboarding-fade-in-left_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          : "animate-[onboarding-fade-in-right_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]",
        className
      )}
    >
      {children}
    </div>
  );
};
