"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";

const SECTIONS = [
  { id: "hero", label: "Home", number: "01" },
  { id: "features", label: "Features", number: "02" },
  { id: "how-it-works", label: "How it works", number: "03" },
] as const;

export function ScrollSpyNav() {
  const [activeId, setActiveId] = useState<string>("hero");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        // When multiple sections intersect, pick the one closest to top of viewport
        const sorted = [...intersecting].sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sorted[0].target.id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-4">
      <nav
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 sm:gap-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-1.5 py-1.5 sm:px-2 sm:py-2 shadow-lg"
        aria-label="Page sections"
      >
        {SECTIONS.map(({ id, label, number }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                "relative overflow-hidden rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 transition-all duration-200"
                  aria-hidden
                />
              )}
              <span className="relative z-10">
                {number}. {label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="ml-auto">
        <SimpleThemeToggle />
      </div>
    </div>
  );
}
