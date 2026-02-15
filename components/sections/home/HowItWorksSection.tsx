"use client";

import { Card } from "@/components/ui/shared/card";
import { Badge } from "@/components/ui/shared/badge";
import AnimatedSection from "@/components/ui/shared/animated-section";
import AnimatedGridItem from "@/components/ui/shared/animated-grid-item";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Kanban,
  Zap,
  Sparkles,
  Layers,
} from "lucide-react";

// How it works section component - explains the canvas-based developer workspace
export default function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();
  
  // Step data with styling and color configurations
  const steps = [
    {
      step: "01",
      title: "Visual Canvas",
      subtitle: "Infinite 2D Workspace",
      description:
        "Start with a blank infinite canvas where you can place notes, tasks, and code blocks anywhere. Drag, drop, and organize content spatially for natural thinking flow.",
      icon: <Layers className="w-6 h-6" />,
      features: ["Infinite 2D canvas", "Drag & drop blocks", "Visual grouping"],
      color: "text-cosmos-cosmic-light",
      bgColor:
        "from-cosmos-cosmic-light/10 via-cosmos-cosmic-dark/5 to-cosmos-cosmic-light/5",
      iconBg: "from-cosmos-cosmic-light/20 to-cosmos-cosmic-dark/20",
      borderColor: "border-cosmos-cosmic-light/30",
      hoverBorderColor: "group-hover:border-cosmos-cosmic-light/50",
    },
    {
      step: "02",
      title: "Rich Content Blocks",
      subtitle: "Rich Text Editor",
      description:
        "Create rich notes with formatting and code blocks directly on the canvas. Each block is movable and supports lists, formatting, and inline code.",
      icon: <FileText className="w-6 h-6" />,
      features: [
        "Rich text editor",
        "Code blocks",
        "Lists and formatting",
      ],
      color: "text-nebula-500",
      bgColor: "from-nebula-500/10 via-nebula-600/5 to-nebula-500/5",
      iconBg: "from-nebula-500/20 to-nebula-600/20",
      borderColor: "border-nebula-500/30",
      hoverBorderColor: "group-hover:border-nebula-500/50",
    },
    {
      step: "03",
      title: "Task Boards & Projects",
      subtitle: "Visual Task Management",
      description:
        "Create and organize tasks directly on your canvas with drag-and-drop columns. Use the command palette (⌘K) to search projects and filter by status.",
      icon: <Kanban className="w-6 h-6" />,
      features: ["Visual task boards", "Project search (⌘K)", "Filter by status"],
      color: "text-cosmos-star-light",
      bgColor:
        "from-cosmos-star-light/10 via-cosmos-star-dark/5 to-cosmos-star-light/5",
      iconBg: "from-cosmos-star-light/20 to-cosmos-star-dark/20",
      borderColor: "border-cosmos-star-light/30",
      hoverBorderColor: "group-hover:border-cosmos-star-light/50",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with badge and title */}
        <AnimatedSection>
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6 px-4 py-2 text-sm group">
              <Zap className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
              In 3 steps
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl group cursor-pointer">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 bg-clip-text text-transparent transition-all duration-300 ease-out group-hover:from-primary-400 group-hover:via-primary-300 group-hover:to-accent-400 group-hover:scale-[1.02] group-hover:tracking-wide">
                  Think. Plan. Execute.
                </span>
              </span>
            </h2>

            <p className="mt-8 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Think, plan, and execute on a flexible 2D canvas. StreamLn combines
              visual organization with powerful dev tools in one unified workspace
              that adapts to your natural workflow.
            </p>
          </div>
        </AnimatedSection>

        {/* Workflow steps grid - 3 columns on large screens, equal height cards */}
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {steps.map((step, index) => (
            <AnimatedGridItem key={index} index={index} staggerDelay={0.15}>
              <div className="relative h-full flex flex-col">
                {/* Connecting arrow between steps - only visible on large screens */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 z-10"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.5,
                            ease: "easeOut",
                            delay: (index + 1) * 0.15 + 0.2,
                          }
                    }
                  >
                    <ArrowRight className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </motion.div>
                )}

              {/* Step card with hover animations and cosmic effects */}
              <Card
                className={`group relative overflow-hidden backdrop-blur-xl p-8 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cosmos-cosmic-light/10 dark:bg-cosmos-surface/30 bg-white/40 dark:border-cosmos-cosmic-light/20 border-cosmos-cosmic-light/30 dark:hover:border-cosmos-cosmic-light/40 hover:border-cosmos-cosmic-light/50 dark:hover:bg-cosmos-surface/50 hover:bg-white/70 flex flex-col flex-1 min-h-0 ${step.borderColor} ${step.hoverBorderColor}`}
              >
                {/* Cosmic glow effect that appears on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-cosmic-light/5 via-transparent to-cosmos-star-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Large step number in background */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-cosmos-cosmic-light/30 dark:text-cosmos-cosmic-light/25 group-hover:text-cosmos-cosmic-light/40 dark:group-hover:text-cosmos-cosmic-light/35 transition-all duration-500">
                  {step.step}
                </div>

                {/* Card content */}
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Icon with gradient background and hover effects */}
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`${step.color} bg-gradient-to-br ${step.iconBg} border border-cosmos-cosmic-light/30 group-hover:border-cosmos-cosmic-light/50 p-4 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-cosmos-cosmic-light/20 transition-all duration-300`}
                    >
                      <div className="group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-all duration-300">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Step title with hover shadow effect */}
                  <h3
                    className={`text-2xl font-bold ${step.color} mb-2 group-hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.08)] dark:group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300`}
                  >
                    {step.title}
                  </h3>

                  {/* Step subtitle */}
                  <p
                    className={`text-sm font-medium ${step.color} mb-4 opacity-80`}
                  >
                    {step.subtitle}
                  </p>

                  {/* Step description with color transition on hover - flex-1 fills space for equal card heights */}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 mb-6 flex-1">
                    {step.description}
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300"
                      >
                        <Sparkles className="w-3 h-3 mr-2 text-cosmos-cosmic-light/60" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle bottom glow line that appears on hover */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmos-cosmic-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
              </div>
            </AnimatedGridItem>
          ))}
        </div>

        {/* Bottom CTA section */}
        <AnimatedSection delay={0.3}>
          <div className="mt-16 text-center">
            <Badge variant="gradient" className="group px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
              Your canvas, your workflow - think, visualize, create
            </Badge>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
