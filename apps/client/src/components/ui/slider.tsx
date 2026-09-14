import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (val: number) => void;
  className?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 1000, step = 10, value, onValueChange, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/30"
          style={{
            background: `linear-gradient(to right, #FF6B00 0%, #FF6B00 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
