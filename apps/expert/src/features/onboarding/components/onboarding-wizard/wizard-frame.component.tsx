import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { StepProgress } from "./step-progress.component";
import type { OnboardingStatus } from "../../types";

export interface WizardFrameProps {
  title: string;
  subtitle: string;
  step: number;
  status: OnboardingStatus;
  busy: boolean;
  onSkip: () => void;
  onBack?: () => void;
  children: ReactNode;
}

export function WizardFrame({
  title,
  subtitle,
  step,
  status,
  busy,
  onSkip,
  onBack,
  children,
}: WizardFrameProps) {
  return (
    <div className="mx-auto mt-10 w-full max-w-2xl px-4 pb-16">
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <StepProgress current={step} />
          <button
            type="button"
            disabled={busy}
            onClick={onSkip}
            className="shrink-0 text-sm font-medium text-[#626260] underline-offset-4 hover:text-[#111111] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip all
          </button>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.5px] text-[#111111]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#626260]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      {status && !status.onboarding_completed && (
        <p className="mt-4 text-center text-[13px] text-[#7b7b78]">
          You can finish this anytime from your dashboard.
        </p>
      )}
    </div>
  );
}
