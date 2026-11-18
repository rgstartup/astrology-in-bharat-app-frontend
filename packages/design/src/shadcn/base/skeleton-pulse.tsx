import { type CSSProperties, type FC } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton: FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}) => {
  const baseClass = "animate-pulse bg-gray-200";
  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
        ? "rounded h-4 w-full"
        : "rounded-xl";

  const style: CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
    />
  );
};

export { Skeleton, Skeleton as SkeletonPulse, type SkeletonProps as SkeletonPulseProps };
export default Skeleton;
