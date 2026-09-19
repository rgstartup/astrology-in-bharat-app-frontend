import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-xs font-semibold text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-xs font-semibold",
        lg: "text-sm font-bold",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, size, ...props }, ref) => (
  <label
    ref={ref}
    data-slot="label"
    className={cn(labelVariants({ size }), className)}
    {...props}
  />
));
Label.displayName = "Label";

export { Label, labelVariants };
