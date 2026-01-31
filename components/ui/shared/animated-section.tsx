"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

/**
 * AnimatedSection - Wrapper component for scroll-triggered section animations
 * Animates children with fade-in and subtle slide-up when entering viewport
 * Respects user's reduced motion preferences
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  threshold = 0.2,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first trigger for performance
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : {
              duration: 0.6,
              ease: "easeOut",
              delay,
            }
      }
    >
      {children}
    </motion.div>
  );
}

