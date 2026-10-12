import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-slate-400 focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
