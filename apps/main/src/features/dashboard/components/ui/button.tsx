import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "brand";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-[#ff6b00] text-white hover:bg-[#e65100] shadow-sm active:scale-[0.99]",
      destructive:
        "bg-rose-500 text-white hover:bg-rose-600 shadow-sm active:scale-[0.99]",
      outline:
        "border border-orange-200 bg-white text-slate-800 hover:bg-orange-50 hover:text-[#ff6b00] hover:border-[#ff6b00]",
      secondary:
        "bg-orange-100 text-orange-950 hover:bg-orange-200/80 shadow-xs",
      ghost: "text-slate-700 hover:bg-orange-50 hover:text-[#ff6b00]",
      link: "text-[#ff6b00] underline-offset-4 hover:underline p-0 h-auto",
      brand:
        "bg-[#301118] text-white hover:bg-[#461a24] shadow-sm active:scale-[0.99]",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-11 rounded-xl px-6 text-base",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00]/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
