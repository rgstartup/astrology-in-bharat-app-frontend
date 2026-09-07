import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  variant?: 'rectangle' | 'circle' | 'rounded';
}

/**
 * A modern shimmer-effect Skeleton component.
 * Provides a "beam of light" moving across a gray background.
 */
export const Skeleton = ({ className, variant = 'rounded' }: SkeletonProps) => {
  const variantClasses = {
    rectangle: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-200/60",
        variantClasses[variant],
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        className
      )}
    />
  );
};
