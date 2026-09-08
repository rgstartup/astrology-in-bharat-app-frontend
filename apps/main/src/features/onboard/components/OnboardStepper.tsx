"use client";

import React from "react";

interface OnboardStepperProps {
  currentStep: 1 | 2;
  onStepClick?: (step: 1 | 2) => void;
}

export const OnboardStepper: React.FC<OnboardStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar Container */}
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-gray-100 -z-0" />
        {/* Active Connecting Line */}
        <div
          className="absolute top-1/2 left-10 -translate-y-1/2 h-1 bg-orange transition-all duration-500 -z-0"
          style={{
            width: currentStep === 2 ? "calc(100% - 5rem)" : "0%",
          }}
        />

        {/* Step 1 Pill */}
        <button
          type="button"
          onClick={() => onStepClick && onStepClick(1)}
          className={`relative z-10 flex items-center gap-3 py-1.5 px-3 rounded-full transition-all duration-300 ${
            currentStep === 1
              ? "bg-white shadow-md border-2 border-orange"
              : "bg-white border border-gray-200"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep === 1
                ? "bg-orange text-white"
                : currentStep > 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {currentStep > 1 ? (
              <i className="fa-solid fa-check text-xs" />
            ) : (
              "1"
            )}
          </div>
          <div className="text-left hidden sm:block pr-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Step 1
            </p>
            <p
              className={`text-xs font-bold leading-none ${
                currentStep === 1 ? "text-orange" : "text-gray-700"
              }`}
            >
              Birth & General Details
            </p>
          </div>
        </button>

        {/* Step 2 Pill */}
        <button
          type="button"
          onClick={() => onStepClick && onStepClick(2)}
          className={`relative z-10 flex items-center gap-3 py-1.5 px-3 rounded-full transition-all duration-300 ${
            currentStep === 2
              ? "bg-white shadow-md border-2 border-orange"
              : "bg-white border border-gray-200"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep === 2
                ? "bg-orange text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
          <div className="text-left hidden sm:block pr-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Step 2
            </p>
            <p
              className={`text-xs font-bold leading-none ${
                currentStep === 2 ? "text-orange" : "text-gray-700"
              }`}
            >
              Preferences & Topics
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
