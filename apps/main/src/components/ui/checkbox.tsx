import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "size-4 shrink-0 rounded-md border border-input shadow-xs transition-all cursor-pointer flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-orange/50 peer-focus-visible:border-orange",
            "peer-checked:bg-orange peer-checked:border-orange peer-checked:text-white",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        >
          {checked && <Check className="size-3 stroke-[3]" />}
        </label>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
