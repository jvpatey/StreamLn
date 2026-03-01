"use client";

import FeatureCard from "@/components/ui/home/FeatureCard";
import AnimatedSection from "@/components/ui/shared/animated-section";
import AnimatedGridItem from "@/components/ui/shared/animated-grid-item";
import { getKeyboardShortcut } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Move,
  Layers,
  FileText,
  FileEdit,
  Kanban,
  Folder,
  Command,
  Presentation,
  Download,
} from "lucide-react";

interface BentoFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight: string;
  variant?: "default" | "accent";
  colSpan?: 1 | 2 | 3 | 4; // 1=1/3, 2=2/3, 3=full, 4=half (for row 4)
}

// Features section component - bento grid layout
export default function FeaturesSection() {
  // Bento layout: Row 1 as is, Row 2 = former Row 3 (3 small), Row 3 = former Row 2 (large + small), Row 4 = full width
  const bentoFeatures: BentoFeature[] = [
    {
      title: "Infinite Canvas",
      description:
        "Unlimited 2D workspace where you can place, move, and organize content anywhere. Zoom from overview to detail seamlessly.",
      icon: Layers,
      highlight: "Unlimited Space",
      variant: "accent",
      colSpan: 4,
    },
    {
      title: "Document Editor",
      description:
        "Full-screen rich text documents within each canvas. Format with headings, task lists, and fonts. Export to Markdown or PDF for docs and version control.",
      icon: FileEdit,
      highlight: "Markdown & PDF",
      variant: "accent",
      colSpan: 4,
    },
    {
      title: "Drag & Drop Everything",
      description:
        "Move notes, tasks, and content blocks freely across your canvas. Resize and arrange with intuitive gestures.",
      icon: Move,
      highlight: "Visual Organization",
      colSpan: 1,
    },
    {
      title: "Visual Task Management",
      description:
        "Create task boards directly on your canvas. Drag tasks between columns and organize work visually with Kanban-style boards.",
      icon: Kanban,
      highlight: "Canvas Native",
      colSpan: 1,
    },
    {
      title: "Quick Command Palette",
      description: `Press ${getKeyboardShortcut("⌘K")} to create projects, search by name, filter by status, or browse all. Navigate your workspace without leaving the keyboard.`,
      icon: Command,
      highlight: getKeyboardShortcut("⌘K"),
      colSpan: 1,
    },
    {
      title: "Project Hub",
      description:
        "Create and manage projects with status filtering. Keep active work front and center, archive completed projects.",
      icon: Folder,
      highlight: "Organized",
      colSpan: 1,
    },
    {
      title: "Rich Content Blocks",
      description:
        "Create notes with rich formatting and code blocks. Each block is movable and supports lists, formatting, and inline code.",
      icon: FileText,
      highlight: "Tiptap Powered",
      colSpan: 2,
    },
    {
      title: "Presentation Mode",
      description:
        "Switch to present view to share your canvas without editing UI. Focus on your work or walk through plans with others.",
      icon: Presentation,
      highlight: "Share",
      colSpan: 4,
    },
    {
      title: "Export & Backup",
      description:
        "Export projects as JSON for full backup, Markdown for docs, or PDF for sharing. Import from backup to restore your workspace.",
      icon: Download,
      highlight: "Data Portability",
      colSpan: 4,
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden py-24 bg-white dark:bg-slate-800">
      {/* Bottom fade to blend into How it works section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[1] dark:hidden"
        aria-hidden
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgb(248 250 252) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[1] hidden dark:block"
        aria-hidden
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgb(2 6 23) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with gradient text */}
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl group cursor-pointer">
              Built for{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 bg-clip-text text-transparent transition-all duration-300 ease-out group-hover:from-primary-400 group-hover:via-primary-300 group-hover:to-accent-400 group-hover:scale-[1.02] group-hover:tracking-wide">
                  your workflow
                </span>
              </span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Everything you need to think, plan, and execute on a flexible
              visual workspace designed specifically for developers.
            </p>
          </div>
        </AnimatedSection>

        {/* Bento features grid - 6 cols on lg for even row 4 tiles */}
        <div className="mx-auto mt-16 grid w-full grid-cols-1 items-stretch gap-6 sm:mt-20 sm:gap-8 lg:grid-cols-6 lg:gap-8">
          {bentoFeatures.map((feature, index) => (
            <AnimatedGridItem
              key={index}
              index={index}
              staggerDelay={0.08}
              className={cn(
                "h-full min-h-0",
                feature.colSpan === 1 && "lg:col-span-2",
                feature.colSpan === 2 && "lg:col-span-4",
                feature.colSpan === 3 && "lg:col-span-6",
                feature.colSpan === 4 && "lg:col-span-3"
              )}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                highlight={feature.highlight}
                variant={feature.variant}
              />
            </AnimatedGridItem>
          ))}
        </div>
      </div>
    </section>
  );
}
