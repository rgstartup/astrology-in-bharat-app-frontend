import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-orange-600 text-white hover:bg-orange-700 shadow-sm",
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-sm",
        outline:
          "border border-gray-200 bg-background hover:bg-orange-50/40 hover:border-orange-300 text-gray-800",
        secondary:
          "bg-orange-50/60 hover:bg-orange-100/60 text-orange-600 border border-orange-500/20 hover:border-orange-500 shadow-sm",
        ghost:
          "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-orange-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-3.5 py-2",
        sm: "h-8 gap-1 rounded-lg px-2.5 text-xs",
        md: "h-9 gap-1.5 px-3.5 py-2",
        lg: "h-11 gap-2 rounded-2xl px-6 text-sm font-semibold",
        icon: "size-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon ? <span className="ml-2">{rightIcon}</span> : null}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export default Button;
