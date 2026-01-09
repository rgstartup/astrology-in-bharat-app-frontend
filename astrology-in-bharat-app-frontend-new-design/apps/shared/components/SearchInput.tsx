import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../utils/cn";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    showClearButton?: boolean;
    size?: "sm" | "md" | "lg";
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    className,
    showClearButton = true,
    size = "md",
}: SearchInputProps) {
    const sizes = {
        sm: "pl-9 pr-9 py-2 text-sm",
        md: "pl-10 pr-10 py-2.5 text-base",
        lg: "pl-12 pr-12 py-3 text-lg",
    };

    const iconSizes = {
        sm: "w-4 h-4 left-3",
        md: "w-5 h-5 left-3",
        lg: "w-6 h-6 left-4",
    };

    const clearButtonSizes = {
        sm: "w-4 h-4 right-3",
        md: "w-5 h-5 right-3",
        lg: "w-6 h-6 right-4",
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className={cn("relative w-full", className)}>
            {/* Search Icon */}
            <Search
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-gray-400",
                    iconSizes[size]
                )}
            />

            {/* Input Field */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full border border-gray-300 rounded-lg hover:!border-[#F25E0A] focus:!ring-2 focus:!ring-[#F25E0A] focus:!border-[#F25E0A] outline-none transition-all",
                    sizes[size],
                    value && showClearButton && "pr-10"
                )}
            />

            {/* Clear Button */}
            {showClearButton && value && (
                <button
                    onClick={handleClear}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full",
                        clearButtonSizes[size]
                    )}
                    aria-label="Clear search"
                >
                    <X className="w-full h-full" />
                </button>
            )}
        </div>
    );
}
