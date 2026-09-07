import React from "react";
import Image from "next/image";

interface LoadingProps {
    fullScreen?: boolean;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
    fullScreen = false, 
    text, 
    size = 'md',
    className = ''
}) => {
    // Map sizes to explicit pixel values to prevent any distortion
    const dimensions = {
        sm: { container: 64, logo: "30" },
        md: { container: 96, logo: "45" },
        lg: { container: 128, logo: "60" },
    };

    const currentSize = dimensions[size] || dimensions.md;

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div 
              className="relative flex items-center justify-center"
              style={{ flexShrink: 0, width: `${currentSize.container}px`, height: `${currentSize.container}px`, borderRadius: '50%' }}
            >
              {/* Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full opacity-80 animate-spin"
                style={{ border: '3px solid transparent', borderTopColor: '#FF6B00', borderBottomColor: '#FF6B00', animationDuration: '2s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
              ></div>
              {/* Inner Ring */}
              <div 
                className="absolute inset-2.5 rounded-full opacity-80 animate-spin"
                style={{ border: '3px solid transparent', borderLeftColor: '#301118', borderRightColor: '#301118', animationDuration: '1.5s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', animationDirection: 'reverse' }}
              ></div>
              {/* Logo */}
              <div className="relative z-10 bg-white rounded-full p-1.5 flex items-center justify-center w-[75%] h-[75%]">
                <Image src="/images/web-logo.png" alt="Loading" fill className="object-contain p-1" />
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
