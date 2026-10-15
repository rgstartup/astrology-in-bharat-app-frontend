import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "brand"
    | "pill";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Intercom-Airbnb hybrid buttons (v2.0.1 monochrome): charcoal primary,
 * charcoal pill sub-CTAs, white + hairline secondary, spec disabled
 * fill (#ebe7e1 / #9c9fa5). Every size is fully rounded (pill); 48px
 * large target. No brand color.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-[#111111] text-white hover:bg-black active:scale-[0.99]",
      destructive:
        "border border-[#d3cec6] bg-white text-[#c41c1c] hover:bg-[#f5f1ec] active:scale-[0.99]",
      outline:
        "border border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]",
      secondary: "bg-[#ebe7e1] text-[#111111] hover:bg-[#d3cec6]",
      ghost: "text-[#111111] hover:bg-[#f5f1ec]",
      link: "text-[#111111] underline-offset-4 hover:underline p-0 h-auto",
      brand: "bg-[#111111] text-white hover:bg-black active:scale-[0.99]",
      pill: "rounded-full bg-[#111111] px-5 py-2.5 text-sm text-white hover:bg-black active:scale-[0.99]",
    };

    const sizeStyles = {
      default: "h-10 px-5 py-2 text-sm",
      sm: "h-8 rounded-full px-4 text-xs",
      lg: "h-12 rounded-full px-7 text-base",
      icon: "h-9 w-9 rounded-full p-0",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:bg-[#ebe7e1] disabled:text-[#9c9fa5] cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
