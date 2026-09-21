"use client";

import React from "react";
import Image from "next/image";
import { Check, ShieldCheck } from "lucide-react";
import { PATHS } from "@repo/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";

interface OnboardHeroProps {
  currentStep?: 1 | 2 | 3;
}

export const OnboardHero: React.FC<OnboardHeroProps> = ({
  currentStep: propStep,
}) => {
  const pathname = usePathname();

  // Detect active step from route if not explicitly passed
  const activeStep = React.useMemo(() => {
    if (propStep) return propStep;
    if (pathname.includes(PATHS.ONBOARDING.SPECIALIZATION)) return 3;
    if (pathname.includes(PATHS.ONBOARDING.PREFERENCE)) return 2;
    return 1;
  }, [pathname, propStep]);


  const steps = [
    {
      step: 1 as const,
      number: "1",
      title: "Personal & Birth Details",
      description:
        "Enter your birth date, time, and birthplace for precise natal chart calculation.",
    },
    {
      step: 2 as const,
      number: "2",
      title: "Consultation Preferences",
      description:
        "Select your preferred consultation topics and comfortable languages.",
    },
    {
      step: 3 as const,
      number: "3",
      title: "Expert Specialization",
      description:
        "Choose astrological disciplines and expert types you want to connect with.",
    },
  ];

  return (
    <div className="w-full flex flex-col justify-between h-full py-1">
      <div>
        {/* Brand Header with Expert emblem */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            <Image
              src="/images/Expert.png"
              alt="Astrology in Bharat"
              width={44}
              height={44}
              className="size-10 sm:size-11 object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Profile Setup
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange to-[#EA580C] tracking-tight leading-tight">
              Astrology in Bharat
            </h2>
          </div>
        </div>

        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
          Complete these quick steps to personalize your astrological charts and
          connect with verified experts.
        </p>

        {/* Step Timeline */}
        <div className="space-y-0 relative">
          {steps.map((item, index) => {
            const isCompleted = activeStep > item.step;
            const isActive = activeStep === item.step;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={item.step}
                className="relative flex items-start gap-4 pb-7 last:pb-0"
              >
                {/* Connecting Line between steps */}
                {!isLast && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 -translate-x-1/2 bg-stone-200 overflow-hidden rounded-full">
                    {/* CSS Animated Fill line moving down when advancing and retracting when moving back */}
                    <div
                      className={cn(
                        "w-full h-full bg-emerald-600 origin-top transition-transform duration-700 ease-in-out",
                        isCompleted ? "scale-y-100" : "scale-y-0"
                      )}
                    />
                  </div>
                )}

                {/* Step Circle / Indicator */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "relative z-10 size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ease-out shadow-xs",
                      isActive
                        ? "bg-orange border-orange text-white ring-4 ring-orange/20 scale-105"
                        : isCompleted
                          ? "bg-emerald-50 border-emerald-600 text-emerald-700 scale-100 shadow-2xs"
                          : "bg-white border-stone-300 text-stone-700 scale-100"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[2.5] text-emerald-700 transition-transform duration-300 animate-in zoom-in-50" />
                    ) : (
                      <span className="transition-opacity duration-300 animate-in fade-in">
                        {item.number}
                      </span>
                    )}
                  </div>

                  {/* Active Step Breathing Glow Ring */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-orange/30 -z-10 animate-ping opacity-30" />
                  )}
                </div>

                {/* Step Details */}
                <div
                  className={cn(
                    "flex-1 pt-0.5 transition-all duration-500 ease-out",
                    isActive ? "translate-x-1" : "translate-x-0"
                  )}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        "text-[11px] font-bold tracking-wide uppercase transition-colors duration-300",
                        isActive
                          ? "text-orange font-extrabold"
                          : isCompleted
                            ? "text-emerald-600 font-bold"
                            : "text-stone-600"
                      )}
                    >
                      Step {item.step}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      "text-xs sm:text-sm leading-snug font-bold transition-colors duration-300",
                      isActive
                        ? "text-stone-900"
                        : isCompleted
                          ? "text-stone-900"
                          : "text-stone-700 font-semibold"
                    )}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mt-0.5 font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidentiality Footer */}
      <div className="mt-8 pt-5 border-t border-stone-200 flex items-center gap-2.5 text-xs text-stone-700">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
        <span className="text-xs leading-tight font-medium">
          Your birth data is 100% confidential and securely encrypted.
        </span>
      </div>
    </div>
  );
};
