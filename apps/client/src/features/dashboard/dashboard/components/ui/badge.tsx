import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "brand";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-[#ff6b00] text-white shadow-xs hover:bg-[#ff6b00]/90",
    secondary: "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200/70",
    destructive: "border-transparent bg-rose-500 text-white shadow-xs hover:bg-rose-500/80",
    outline: "text-slate-700 border-slate-200",
    gold: "border-emerald-200/80 bg-emerald-50 text-emerald-800 shadow-xs",
    brand: "border-transparent bg-[#301118] text-white shadow-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
