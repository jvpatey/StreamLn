"use client";

import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { Rocket, Layers } from "lucide-react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-8 sm:py-0">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* Beta badge with animated rocket icon */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.6, ease: "easeOut", delay: 0.1 }
            }
          >
            <Badge
              variant="gradient"
              className="group mb-4 px-3 py-1 text-xs sm:mb-6 sm:px-4 sm:py-2 sm:text-sm font-medium"
            >
              <Layers className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
              Canvas Dev Platform
            </Badge>
          </motion.div>

          {/* Main logo with hover effects and glow */}
          <motion.div
            className="relative mb-6 sm:mb-8 group cursor-pointer"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.6, ease: "easeOut", delay: 0.2 }
            }
          >
            {/* Logo text with modern hover effect */}
            <h1 className="text-6xl leading-tight sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary-400 group-hover:via-primary-500 group-hover:to-accent-400 group-hover:scale-[1.02] group-hover:tracking-wide">
                  StreamLn
                </span>
              </span>
            </h1>

            {/* Tagline with animated decorative line */}
            <div className="mt-2 relative">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-600/80 dark:text-slate-300/80">
                Your infinite canvas for dev notes, planning, and execution.
              </p>
              {/* Animated decorative line that expands on hover */}
              <div className="mx-auto mt-2 sm:mt-3 w-40 sm:w-72 h-1 flex justify-center items-center">
                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] w-24 sm:w-36 group-hover:w-40 sm:group-hover:w-72 group-hover:via-primary-500" />
              </div>
            </div>
          </motion.div>

          {/* Main description text */}
          <motion.p
            className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.6, ease: "easeOut", delay: 0.4 }
            }
          >
            Map out your projects, notes, and task boards on a limitless 2D
            canvas. StreamLn gives developers a visual playground to capture
            ideas, plan work, and connect everything—your workflow, your way.
          </motion.p>

          {/* Call-to-action button with glow effect */}
          <motion.div
            className="mt-8 sm:mt-10 flex items-center justify-center"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.6, ease: "easeOut", delay: 0.5 }
            }
          >
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="gradient"
                  size="lg"
                  className="group relative overflow-hidden text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
                >
                  <span className="relative z-10">Launch Your Workspace</span>
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </Button>
              </SignInButton>
            </SignedOut>
          </motion.div>

          {/* Feature preview dots with hover animations */}
          <motion.div
            className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-base text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.6, ease: "easeOut", delay: 0.6 }
            }
          >
            <motion.span
              className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.5, ease: "easeOut", delay: 0.7 }
              }
            >
              <div className="relative h-3 w-3 rounded-full bg-primary-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:shadow-primary-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              Infinite Canvas
            </motion.span>
            <motion.span
              className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.5, ease: "easeOut", delay: 0.8 }
              }
            >
              <div className="relative h-3 w-3 rounded-full bg-accent-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:shadow-accent-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              Drag & Drop
            </motion.span>
            <motion.span
              className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.5, ease: "easeOut", delay: 0.9 }
              }
            >
              <div className="relative h-3 w-3 rounded-full bg-primary-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:shadow-primary-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              Visual Organization
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
