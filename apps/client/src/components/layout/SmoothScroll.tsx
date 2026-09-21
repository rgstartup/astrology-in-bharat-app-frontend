"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        // Initialize Lenis with smoother duration & graceful easing curve
        const lenis = new Lenis({
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard gentle easing
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Expose instance for programmatic calls (e.g., custom scrollToTop)
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

        // RAF loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Listen for custom events to pause/resume/scroll lenis
        const handlePause = () => lenis.stop();
        const handleResume = () => lenis.start();
        const handleScrollToTop = (e: Event) => {
            const customEvent = e as CustomEvent<{ duration?: number }>;
            const duration = customEvent.detail?.duration ?? 1.8;
            lenis.scrollTo(0, {
                duration,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        };
        
        window.addEventListener('pause-lenis', handlePause);
        window.addEventListener('resume-lenis', handleResume);
        window.addEventListener('scroll-to-top', handleScrollToTop);

        // Cleanup on unmount
        return () => {
            delete (window as unknown as { __lenis?: Lenis }).__lenis;
            window.removeEventListener('pause-lenis', handlePause);
            window.removeEventListener('resume-lenis', handleResume);
            window.removeEventListener('scroll-to-top', handleScrollToTop);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
