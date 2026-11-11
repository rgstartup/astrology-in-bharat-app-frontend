/**
 * @deprecated Use `Spinner` from '@repo/design/shadcn' instead. Scheduled for removal.
 */
import { cn } from "cn"
import { Loader2Icon } from "@repo/design/lucide"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
