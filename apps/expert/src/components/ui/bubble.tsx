import type { ComponentProps } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

function BubbleGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-[#111111] *:data-[slot=bubble-content]:bg-[#111111] *:data-[slot=bubble-content]:text-white",
        secondary:
          "*:data-[slot=bubble-content]:bg-white *:data-[slot=bubble-content]:text-[#111111] *:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-[#d3cec6]",
        muted:
          "*:data-[slot=bubble-content]:bg-slate-50 *:data-[slot=bubble-content]:text-slate-700 *:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-slate-200",
        tinted:
          "*:data-[slot=bubble-content]:bg-orange-50 *:data-[slot=bubble-content]:text-orange-950 *:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-orange-200/60",
        outline:
          "*:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-[#d3cec6] *:data-[slot=bubble-content]:bg-white *:data-[slot=bubble-content]:text-[#111111]",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0",
        destructive:
          "*:data-[slot=bubble-content]:bg-red-50 *:data-[slot=bubble-content]:text-red-700 *:data-[slot=bubble-content]:border *:data-[slot=bubble-content]:border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end";
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  );
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-2xl border border-transparent px-3.5 py-2.5 text-sm leading-relaxed break-words group-data-[align=end]/bubble:self-end shadow-xs",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  });
}

export { BubbleGroup, Bubble, BubbleContent, bubbleVariants };
