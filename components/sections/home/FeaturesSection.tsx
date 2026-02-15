"use client";

import FeatureCard from "@/components/ui/home/FeatureCard";
import AnimatedSection from "@/components/ui/shared/animated-section";
import AnimatedGridItem from "@/components/ui/shared/animated-grid-item";
import { getKeyboardShortcut } from "@/lib/utils";
import {
  Move,
  Layers,
  FileText,
  Kanban,
  Folder,
  Command,
  Presentation,
} from "lucide-react";

// Features section component showcasing specific canvas capabilities
export default function FeaturesSection() {
  // Primary features displayed in 3-column grid
  const mainFeatures = [
    {
      title: "Infinite Canvas",
      description:
        "Unlimited 2D workspace where you can place, move, and organize content anywhere. Zoom from overview to detail seamlessly.",
      icon: <Layers size={24} />,
      highlight: "Unlimited Space",
    },
    {
      title: "Drag & Drop Everything",
      description:
        "Move notes, tasks, and content blocks freely across your canvas. Resize and arrange with intuitive gestures.",
      icon: <Move size={24} />,
      highlight: "Visual Organization",
    },
    {
      title: "Rich Content Blocks",
      description:
        "Create notes with rich formatting and code blocks. Each block is movable and supports lists, formatting, and inline code.",
      icon: <FileText size={24} />,
      highlight: "Tiptap Powered",
    },
  ];

  // Secondary features displayed in 2-column grid
  const additionalFeatures = [
    {
      title: "Visual Task Management",
      description:
        "Create task boards directly on your canvas. Drag tasks between columns and organize work visually with Kanban-style boards.",
      icon: <Kanban size={24} />,
      highlight: "Canvas Native",
    },
    {
      title: "Project Hub",
      description:
        "Create and manage projects with status filtering. Keep active work front and center, archive completed projects.",
      icon: <Folder size={24} />,
      highlight: "Organized",
    },
    {
      title: "Quick Command Palette",
      description: `Press ${getKeyboardShortcut("⌘K")} to create projects, search by name, filter by status, or browse all. Navigate your workspace without leaving the keyboard.`,
      icon: <Command size={24} />,
      highlight: getKeyboardShortcut("⌘K"),
    },
    {
      title: "Presentation Mode",
      description:
        "Switch to present view to share your canvas without editing UI. Focus on your work or walk through plans with others.",
      icon: <Presentation size={24} />,
      highlight: "Share",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Everything you need to think, plan, and execute on a flexible
              visual workspace designed specifically for developers.
            </p>
          </div>
        </AnimatedSection>

        {/* Main features grid - 3 columns on large screens */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {mainFeatures.map((feature, index) => (
            <AnimatedGridItem key={index} index={index} staggerDelay={0.1}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                highlight={feature.highlight}
              />
            </AnimatedGridItem>
          ))}
        </div>

        {/* Additional features grid - 2 columns on large screens, 4 items wrap */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          {additionalFeatures.map((feature, index) => (
            <AnimatedGridItem key={index} index={index} staggerDelay={0.1}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                highlight={feature.highlight}
              />
            </AnimatedGridItem>
          ))}
        </div>
      </div>
    </section>
  );
}
