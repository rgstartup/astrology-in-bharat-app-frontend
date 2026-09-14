import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "brand";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-[#ff6b00] text-white shadow-xs hover:bg-[#ff6b00]/90",
    secondary: "border-transparent bg-orange-100/70 text-orange-900 hover:bg-orange-100",
    destructive: "border-transparent bg-rose-500 text-white shadow-xs hover:bg-rose-500/80",
    outline: "text-slate-700 border-slate-200",
    gold: "border-amber-300 bg-amber-50 text-amber-900 shadow-xs",
    brand: "border-transparent bg-[#301118] text-amber-300 shadow-xs",
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
