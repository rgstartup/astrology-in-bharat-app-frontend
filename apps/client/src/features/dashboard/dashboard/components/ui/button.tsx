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
    | "brand";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.99]",
      destructive:
        "bg-rose-500 text-white hover:bg-rose-600 shadow-sm active:scale-[0.99]",
      outline:
        "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:text-saffron-strong hover:border-slate-300",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-slate-200/80 shadow-xs",
      ghost: "text-slate-700 hover:bg-slate-100 hover:text-saffron-strong",
      link: "text-saffron-strong underline-offset-4 hover:underline p-0 h-auto",
      brand:
        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.99]",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-full px-3 text-xs",
      lg: "h-11 rounded-full px-6 text-base",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
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
