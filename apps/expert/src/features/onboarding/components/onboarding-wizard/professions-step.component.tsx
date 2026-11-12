"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import type { ProfessionItem } from "@repo/lib/contracts/expert/account-api";

interface ProfessionsStepProps {
  professions: ProfessionItem[];
  selected: number[];
  onToggle: (id: number) => void;
  disabled?: boolean;
}

export function ProfessionsStep({
  professions,
  selected,
  onToggle,
  disabled,
}: ProfessionsStepProps) {
  return (
    <div>
      <p className="text-sm text-[#626260]">
        Pick the work you do. You can change this later in your profile.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {professions.map((profession) => {
          const isSelected = selected.includes(profession.id);
          return (
            <button
              key={profession.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(profession.id)}
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
                  {profession.title}
                </span>
                {profession.description && (
                  <span className="mt-0.5 block text-[13px] text-[#7b7b78]">
                    {profession.description}
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
