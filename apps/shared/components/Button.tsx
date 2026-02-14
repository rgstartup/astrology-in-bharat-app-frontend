
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    fullWidth = false,
    loading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-semibold !rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 focus:ring-orange-400",
        secondary:
            "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 focus:ring-gray-300",
        success:
            "bg-green-600 hover:bg-green-700 text-white shadow-md focus:ring-green-400",
        danger:
            "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-400",
        warning:
            "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md focus:ring-yellow-400",
        outline:
            "bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 focus:ring-orange-200",
        ghost:
            "bg-transparent hover:bg-black/5",
    };

    const sizes = {
        sm: "px-5 py-2 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className={cn("animate-spin", iconSizes[size])}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === "left" && (
                        <Icon className={iconSizes[size]} />
                    )}
                    {children}
                    {Icon && iconPosition === "right" && (
                        <Icon className={iconSizes[size]} />
                    )}
                </>
            )}
        </button>
    );
}
