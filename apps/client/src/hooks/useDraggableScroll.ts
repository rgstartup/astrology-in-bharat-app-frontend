"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseDraggableScrollOptions {
  dragSpeed?: number;
  scrollStepRatio?: number;
  dragThreshold?: number;
}

export function useDraggableScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseDraggableScrollOptions = {},
) {
  const {
    dragSpeed = 1.3,
    scrollStepRatio = 0.65,
    dragThreshold = 6,
  } = options;

  const containerRef = useRef<T>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Internal mutable drag tracking
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // Check scroll position for overflow indicators
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Programmatic scroll step (e.g. via left/right buttons)
  const handleScroll = useCallback(
    (direction: "left" | "right", ratio: number = scrollStepRatio) => {
      const el = containerRef.current;
      if (!el) return;
      const scrollAmount = el.clientWidth * ratio;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    },
    [scrollStepRatio],
  );

  // Bring a specific child element into view
  const scrollToElement = useCallback((element?: HTMLElement | null) => {
    if (element && containerRef.current) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  // Mouse drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startXRef.current) * dragSpeed;
      dragDistanceRef.current = Math.abs(walk);
      el.scrollLeft = scrollLeftStartRef.current - walk;
    },
    [dragSpeed],
  );

  const onMouseUpOrLeave = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Helper to check whether the interaction was a drag gesture
  const wasDragged = useCallback(() => {
    return dragDistanceRef.current > dragThreshold;
  }, [dragThreshold]);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    handleScroll,
    scrollToElement,
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
    wasDragged,
  };
}

export default useDraggableScroll;
