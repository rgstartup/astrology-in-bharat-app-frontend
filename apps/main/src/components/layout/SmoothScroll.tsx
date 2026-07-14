"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // RAF loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Listen for custom events to pause/resume lenis
        const handlePause = () => lenis.stop();
        const handleResume = () => lenis.start();
        
        window.addEventListener('pause-lenis', handlePause);
        window.addEventListener('resume-lenis', handleResume);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('pause-lenis', handlePause);
            window.removeEventListener('resume-lenis', handleResume);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
