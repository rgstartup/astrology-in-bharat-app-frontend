"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import type { SpecializationItem } from "@repo/lib/contracts/expert/account-api";

interface SpecializationsStepProps {
  specializations: SpecializationItem[];
  selected: number[];
  onToggle: (id: number) => void;
  disabled?: boolean;
}

export function SpecializationsStep({
  specializations,
  selected,
  onToggle,
  disabled,
}: SpecializationsStepProps) {
  if (specializations.length === 0) {
    return (
      <p className="rounded-xl border border-[#d3cec6] bg-white p-4 text-sm text-[#626260]">
        No specializations are available for the professions you picked yet. You
        can skip this step.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-[#626260]">
        Choose what you specialize in, based on your professions.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {specializations.map((specialization) => {
          const isSelected = selected.includes(specialization.id);
          return (
            <button
              key={specialization.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(specialization.id)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border bg-white p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                isSelected
                  ? "border-amber-500 ring-1 ring-amber-500"
                  : "border-[#d3cec6] hover:border-[#b8b2a8]",
              )}
            >
              <span>
                <span className="block text-base font-semibold text-[#111111]">
                  {specialization.title}
                </span>
                {specialization.description && (
                  <span className="mt-0.5 block text-[13px] text-[#7b7b78]">
                    {specialization.description}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-[#d3cec6] bg-white",
                )}
                aria-hidden
              >
                {isSelected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
