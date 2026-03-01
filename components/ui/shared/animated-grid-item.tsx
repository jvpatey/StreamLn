"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridItemProps {
  children: ReactNode;
  index: number;
  staggerDelay?: number;
  threshold?: number;
  className?: string;
}

/**
 * AnimatedGridItem - Component for staggered grid item animations
 * Each item animates with a delay based on its index for a cascading effect
 * Respects user's reduced motion preferences
 */
export default function AnimatedGridItem({
  children,
  index,
  staggerDelay = 0.1,
  threshold = 0.2,
  className,
}: AnimatedGridItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : {
              duration: 0.6,
              ease: "easeOut",
              delay: index * staggerDelay,
            }
      }
    >
      {children}
    </motion.div>
  );
}

