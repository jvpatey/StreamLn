"use client";

import { useEffect, useState, RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for scroll-based animation logic
 * Returns whether an element is visible in the viewport
 */
export function useScrollAnimation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.2, rootMargin = "0px" } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first trigger for performance
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return isVisible;
}

