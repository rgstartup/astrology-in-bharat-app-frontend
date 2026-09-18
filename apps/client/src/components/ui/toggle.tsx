"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 disabled:pointer-events-none disabled:opacity-50 shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900 data-[pressed]:bg-slate-200 data-[pressed]:text-slate-900",
        outline:
          "border border-slate-200 bg-transparent shadow-xs hover:bg-slate-100 hover:text-slate-900 data-[state=on]:bg-slate-100 data-[state=on]:text-slate-900 data-[pressed]:bg-slate-100 data-[pressed]:text-slate-900",
        heart:
          "border border-slate-200/90 bg-white/95 text-slate-600 shadow-2xs hover:bg-rose-50/70 hover:text-rose-600 hover:border-rose-200 data-[state=on]:bg-rose-50 data-[state=on]:border-rose-200 data-[state=on]:text-rose-600 data-[pressed]:bg-rose-50 data-[pressed]:border-rose-200 data-[pressed]:text-rose-600",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2.5 min-w-8 text-xs",
        lg: "h-10 px-3.5 min-w-10",
        icon: "size-8.5 rounded-full p-0",
        "icon-sm": "size-7.5 rounded-full p-0",
        "icon-lg": "size-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
