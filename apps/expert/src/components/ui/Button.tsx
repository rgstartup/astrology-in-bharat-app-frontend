import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", isLoading, fullWidth, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none rounded-xl cursor-pointer hover:cursor-pointer";

        // Width styles
        const widthStyles = fullWidth ? "w-full" : "";

        // Size styles
        const sizeStyles = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-5 py-2.5 text-sm",
            lg: "px-8 py-3.5 text-base",
        };

        // Variant styles
        const variantStyles = {
            primary: "bg-[#fd6410] text-white hover:bg-[#e55a0e] shadow-lg shadow-orange-500/20",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
            outline: "border-2 border-[#fd6410] text-[#fd6410] hover:bg-orange-50",
            ghost: "text-[#fd6410] hover:bg-orange-50",
        };

        const combinedStyles = `${baseStyles} ${widthStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

        return (
            <button
                ref={ref}
                className={combinedStyles}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : leftIcon ? (
                    <span className="mr-2">{leftIcon}</span>
                ) : null}
                {children}
                {!isLoading && rightIcon ? <span className="ml-2">{rightIcon}</span> : null}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
