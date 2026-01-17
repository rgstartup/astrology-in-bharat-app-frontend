import React from "react";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    variant?: "spinner"; // Expandable for "dots", "pulse" later
    fullScreen?: boolean;
    className?: string;
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = "md",
    variant = "spinner",
    fullScreen = false,
    className = "",
    text,
}) => {
    const sizeClasses = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-12 h-12 border-4",
    };

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-yellow-600 border-t-transparent rounded-full animate-spin`}
            />
            {text && <p className="text-gray-600 font-medium text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
                    {spinner}
                </div>
            </div>
        );
    }

    return spinner;
};
