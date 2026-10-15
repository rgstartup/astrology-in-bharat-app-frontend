import { cn } from "@/lib/utils";

/**
 * Loading placeholder block in the Intercom surface tone (#ebe7e1)
 * with a soft hairline edge. No warm tints.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border border-[#d3cec6] bg-[#ebe7e1]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
