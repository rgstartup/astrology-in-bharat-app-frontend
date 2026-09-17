"use client";

import { useEffect, useRef, useState } from "react";

export interface UseHeaderScrollOptions {
  /**
   * Minimum scroll distance in pixels before triggering visibility change.
   * Prevents micro-jitter during subtle scrolls.
   * @default 8
   */
  threshold?: number;

  /**
   * Distance from the top of the page (in pixels) where the header is always pinned/visible.
   * @default 10
   */
  topOffset?: number;
}

export interface UseHeaderScrollReturn {
  /**
   * Whether the header should be visible (scrolling up or at top of page).
   */
  isVisible: boolean;

  /**
   * Whether the user has scrolled beyond the topOffset threshold.
   */
  isScrolled: boolean;

  /**
   * Current scroll position on Y-axis.
   */
  scrollY: number;
}

export function useHeaderScroll({
  threshold = 8,
  topOffset = 10,
}: UseHeaderScrollOptions = {}): UseHeaderScrollReturn {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const initialY = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollY.current = initialY;
    setScrollY(initialY);
    setIsScrolled(initialY > topOffset);
    setIsVisible(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(currentScrollY);

          // Always show header at top of page (or bouncing at top on iOS)
          if (currentScrollY <= topOffset) {
            setIsScrolled(false);
            setIsVisible(true);
          } else {
            setIsScrolled(true);
            const delta = currentScrollY - lastScrollY.current;

            // Only change visibility when delta exceeds threshold
            if (Math.abs(delta) >= threshold) {
              if (delta > 0) {
                // Scrolling down -> hide header
                setIsVisible(false);
              } else {
                // Scrolling up -> show header
                setIsVisible(true);
              }
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, topOffset]);

  return { isVisible, isScrolled, scrollY };
}
