/**
 * Smoothly scrolls to the top of the window using Lenis (if active)
 * or browser smooth scroll fallback, with a relaxed, silky easing curve and customizable speed/duration.
 */
export const scrollToTop = (duration = 1.8) => {
  if (typeof window === "undefined") return;

  const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, options?: Record<string, unknown>) => void } }).__lenis;

  if (lenis) {
    lenis.scrollTo(0, {
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
