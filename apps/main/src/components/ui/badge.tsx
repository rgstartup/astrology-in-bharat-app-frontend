import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm hover:bg-destructive/80",
        outline: "text-foreground border-border",
        saffron:
          "border-orange/20 bg-orange/10 text-orange font-bold hover:bg-orange/20",
        gold:
          "border-[#d4af37]/30 bg-[#d4af37]/15 text-[#9a7b1c] dark:text-[#f3cc58] font-bold hover:bg-[#d4af37]/25",
        emerald:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-500/20",
        purple:
          "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold hover:bg-purple-500/20",
        amber:
          "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
