import * as React from "react";
import { cn } from "@repo/design/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "brand";
}

/**
 * Neutral Intercom badge: white + hairline border with charcoal text.
 * The destructive variant renders error red (#c41c1c). Live/success
 * indicators should pair this badge with a #0bdf50 dot.
 */
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-[#d3cec6] bg-white text-[#111111]",
    secondary: "border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]",
    destructive: "border-[#d3cec6] bg-white text-[#c41c1c]",
    outline: "text-[#111111] border-[#d3cec6] bg-white",
    gold: "border-[#d3cec6] bg-white text-[#111111]",
    brand: "border-[#d3cec6] bg-white text-[#111111]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 font-sans text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
