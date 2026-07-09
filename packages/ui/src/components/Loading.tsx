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
    // Map sizes to pixel values for the inner logo wrapper to keep proportions
    const dimensions = {
        sm: { container: 64, logo: "30" },
        md: { container: 96, logo: "45" },
        lg: { container: 128, logo: "60" },
    };

    const currentSize = dimensions[size] || dimensions.md;

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div 
              className={`relative flex items-center justify-center`}
              style={{ flexShrink: 0, width: `${currentSize.container}px`, height: `${currentSize.container}px`, borderRadius: '50%' }}
            >
              {/* Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#FF6B00] border-b-[#FF6B00] opacity-80 animate-spin"
                style={{ animationDuration: '2s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
              ></div>
              {/* Inner Ring */}
              <div 
                className="absolute inset-2.5 rounded-full border-[3px] border-transparent border-l-[#301118] border-r-[#301118] opacity-80 animate-spin"
                style={{ animationDuration: '1.5s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', animationDirection: 'reverse' }}
              ></div>
              {/* Logo */}
              <div className="relative z-10 bg-white rounded-full p-1.5 flex items-center justify-center w-[75%] h-[75%]">
                <img src="/images/Expert.png" alt="Loading" className="object-contain w-full h-full" />
              </div>
            </div>
            {text && <p className="text-gray-600 font-bold text-sm tracking-wide">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    {spinner}
                </div>
            </div>
        );
    }

    return spinner;
};



