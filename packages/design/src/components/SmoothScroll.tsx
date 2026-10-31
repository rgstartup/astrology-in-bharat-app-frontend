"use client";

import { useEffect, type ReactNode } from "react";
import { Lenis } from "../lenis";

export interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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

    window.addEventListener("pause-lenis", handlePause);
    window.addEventListener("resume-lenis", handleResume);
    window.addEventListener("scroll-to-top", handleScrollToTop);

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      window.removeEventListener("pause-lenis", handlePause);
      window.removeEventListener("resume-lenis", handleResume);
      window.removeEventListener("scroll-to-top", handleScrollToTop);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
