"use client";

import { Card } from "@/components/ui/shared/card";
import { motion } from "framer-motion";

// Shimmer animation component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
);

// Individual skeleton card component
export function ProjectSkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden rounded-2xl shadow-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50">
        {/* Shimmer overlay */}
        <Shimmer />

        {/* Menu button skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-lg bg-slate-200/60 dark:bg-slate-700/60" />
        </div>

        {/* Canvas preview area skeleton */}
        <div className="relative h-24 bg-gradient-to-br from-slate-100/60 to-slate-200/60 dark:from-slate-800/60 dark:to-slate-900/60 overflow-hidden">
          {/* Placeholder blocks */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
            <div className="w-10 h-4 rounded bg-slate-300/40 dark:bg-slate-600/40" />
            <div className="w-8 h-3 rounded bg-slate-300/40 dark:bg-slate-600/40" />
            <div className="w-6 h-5 rounded bg-slate-300/40 dark:bg-slate-600/40" />
          </div>
          {/* Blocks count skeleton */}
          <div className="absolute top-2 left-2 w-16 h-5 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        </div>

        {/* Main info skeleton */}
        <div className="p-4 pb-2">
          <div className="flex items-center space-x-2 mb-1">
            {/* Icon skeleton */}
            <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/60" />
            {/* Title skeleton */}
            <div className="flex-1 h-5 rounded bg-slate-200/60 dark:bg-slate-700/60 max-w-[140px]" />
            {/* Progress percentage skeleton */}
            <div className="w-10 h-4 rounded bg-slate-200/60 dark:bg-slate-700/60" />
          </div>
          {/* Type skeleton */}
          <div className="h-3 rounded bg-slate-200/60 dark:bg-slate-700/60 w-3/4 mb-2" />
          {/* Progress bar skeleton */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
            <div className="h-1.5 rounded-full bg-slate-300/60 dark:bg-slate-600/60 w-2/3" />
          </div>
        </div>

        {/* Metadata row skeleton */}
        <div className="flex items-center justify-between text-xs px-4 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-3 rounded bg-slate-200/60 dark:bg-slate-700/60" />
            <div className="w-8 h-3 rounded bg-slate-200/60 dark:bg-slate-700/60" />
          </div>
          <div className="w-12 h-3 rounded bg-slate-200/60 dark:bg-slate-700/60" />
        </div>
      </Card>
    </motion.div>
  );
}

// Grid of skeleton cards
export function ProjectSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProjectSkeletonCard key={index} delay={index * 0.05} />
      ))}
    </div>
  );
}

