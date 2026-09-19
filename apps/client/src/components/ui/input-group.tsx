import * as React from "react";
import { cn } from "@/lib/utils";

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  error?: boolean;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, disabled, error, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "relative flex items-center w-full rounded-lg border bg-white transition-all shadow-2xs group h-9.5",
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100"
            : "border-stone-200 hover:border-stone-300 focus-within:border-orange focus-within:ring-4 focus-within:ring-orange/10",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none bg-stone-50",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputGroup.displayName = "InputGroup";

interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "start", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group-addon"
        className={cn(
          "flex items-center justify-center text-stone-400 group-focus-within:text-orange transition-colors shrink-0 select-none",
          align === "start" ? "pl-3 pr-2" : "pr-3 pl-2",
          className,
        )}
        {...props}
      />
    );
  },
);
InputGroupAddon.displayName = "InputGroupAddon";

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input-group-input"
      className={cn(
        "flex-1 w-full bg-transparent border-0 outline-none px-0 py-2 text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
});
InputGroupInput.displayName = "InputGroupInput";

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="input-group-button"
      className={cn(
        "flex items-center justify-center p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/30 shrink-0",
        className,
      )}
      {...props}
    />
  );
});
InputGroupButton.displayName = "InputGroupButton";

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton };
