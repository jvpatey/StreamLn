"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shared/button";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/shared/sheet";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

const SECTIONS = [
  { id: "hero", label: "StreamLn" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
] as const;

export function ScrollSpyNav() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
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
    if (isMobile) setMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <SimpleThemeToggle />
        </div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent
            side="bottom"
            className={cn(
              "rounded-t-2xl border-t border-slate-200 dark:border-slate-700",
              "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
              "pb-8"
            )}
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-1 pt-4" aria-label="Page sections">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-full font-semibold mb-2"
                  >
                    Launch Your Workspace
                  </Button>
                </SignInButton>
              </SignedOut>
              {SECTIONS.map(({ id, label }) => {
                const isActive = activeId === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => handleClick(id)}
                    className={cn(
                      "flex items-center min-h-[48px] px-4 py-3 rounded-xl text-left text-base font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-accent-500/20 text-primary-600 dark:text-primary-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {label}
                  </button>
                );
              })}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Theme
                </span>
                <SimpleThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-4">
      <nav
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 sm:gap-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-1.5 py-1.5 sm:px-2 sm:py-2 shadow-lg"
        aria-label="Page sections"
      >
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              type="button"
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
              <span className="relative z-10">{label}</span>
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
