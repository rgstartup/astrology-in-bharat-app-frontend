import { useCallback, useEffect, useRef } from "react";

const SCROLL_DISTANCE = 250;

export function useSpecializationScroll(selectedSpecialization: string) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedSpecialization || !scrollRef.current) return;

    const timeoutId = window.setTimeout(() => {
      const activeElement = scrollRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]',
      );

      activeElement?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [selectedSpecialization]);

  const goLeft = useCallback(() => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_DISTANCE,
      behavior: "smooth",
    });
  }, []);

  const goRight = useCallback(() => {
    scrollRef.current?.scrollBy({
      left: SCROLL_DISTANCE,
      behavior: "smooth",
    });
  }, []);

  return { scrollRef, goLeft, goRight };
}
