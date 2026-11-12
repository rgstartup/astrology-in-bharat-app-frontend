import { cn } from "@/lib/cn";

const STEPS = ["Profession", "Specialization", "Profile"] as const;

interface StepProgressProps {
  current: number;
}

export function StepProgress({ current }: StepProgressProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Onboarding progress">
      {STEPS.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-[13px] font-medium",
                isDone && "border-[#111111] bg-[#111111] text-white",
                isActive && "border-amber-500 bg-amber-500 text-white",
                !isDone && !isActive && "border-[#d3cec6] bg-white text-[#7b7b78]",
              )}
            >
              {isDone ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[13px] font-medium sm:block",
                isActive ? "text-[#111111]" : "text-[#7b7b78]",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px w-6 bg-[#d3cec6]" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
