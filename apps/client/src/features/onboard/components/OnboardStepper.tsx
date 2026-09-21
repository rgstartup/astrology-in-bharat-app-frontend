"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, Sparkles, User, Sliders } from "lucide-react";

interface OnboardStepperProps {
  currentStep: 1 | 2;
  onStepClick?: (step: 1 | 2) => void;
}

export const OnboardStepper: React.FC<OnboardStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    {
      step: 1 as const,
      title: "Personal Details",
      subtitle: "Birth & General",
      icon: User,
    },
    {
      step: 2 as const,
      title: "Preferences",
      subtitle: "Topics & Languages",
      icon: Sliders,
    },
  ];

  const progressValue = currentStep === 1 ? 50 : 100;

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Progress Bar Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5 text-orange font-bold">
            <Sparkles className="size-3.5" />
            Step {currentStep} of 2
          </span>
          <span>{progressValue}% Completed</span>
        </div>
        <Progress
          value={progressValue}
          className="h-1.5 bg-orange/10"
          indicatorClassName="bg-orange"
        />
      </div>

      {/* Stepper Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {steps.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          const Icon = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => onStepClick?.(item.step)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 outline-none select-none cursor-pointer",
                isActive
                  ? "bg-orange/5 border-orange ring-1 ring-orange/30 shadow-xs"
                  : isCompleted
                    ? "bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50"
                    : "bg-white border-border/70 hover:border-orange/30 hover:bg-gray-50/50"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  isActive
                    ? "bg-orange text-white shadow-xs"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700 shadow-2xs"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[2.5] text-emerald-700" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs font-bold leading-tight truncate",
                    isActive
                      ? "text-orange"
                      : isCompleted
                        ? "text-emerald-800"
                        : "text-foreground"
                  )}
                >
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
