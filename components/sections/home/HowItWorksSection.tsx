import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  FileText,
  Kanban,
  Search,
  GitBranch,
  Code,
  Sparkles,
  Network,
  Move,
  ZoomIn,
  Layers,
} from "lucide-react";

// How it works section component - explains the canvas-based developer workspace
export default function HowItWorksSection() {
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
      subtitle: "Tiptap-Powered Notes",
      description:
        "Create rich notes with markdown, code blocks, and images directly on the canvas. Each block is collapsible, movable, and supports bidirectional linking between content.",
      icon: <FileText className="w-6 h-6" />,
      features: [
        "Tiptap rich editor",
        "Markdown + code",
        "Bidirectional links",
      ],
      color: "text-nebula-500",
      bgColor: "from-nebula-500/10 via-nebula-600/5 to-nebula-500/5",
      iconBg: "from-nebula-500/20 to-nebula-600/20",
      borderColor: "border-nebula-500/30",
      hoverBorderColor: "group-hover:border-nebula-500/50",
    },
    {
      step: "03",
      title: "Task Boards & Search",
      subtitle: "Visual Task Management",
      description:
        "Create and organize tasks directly on your canvas with drag-and-drop columns. Find related work instantly with semantic search across all your visual content.",
      icon: <Kanban className="w-6 h-6" />,
      features: ["Visual task boards", "Semantic search", "Knowledge graphs"],
      color: "text-cosmos-star-light",
      bgColor:
        "from-cosmos-star-light/10 via-cosmos-star-dark/5 to-cosmos-star-light/5",
      iconBg: "from-cosmos-star-light/20 to-cosmos-star-dark/20",
      borderColor: "border-cosmos-star-light/30",
      hoverBorderColor: "group-hover:border-cosmos-star-light/50",
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with badge and title */}
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="gradient" className="mb-6 px-4 py-2 text-sm group">
            <GitBranch className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
            Canvas workspace
          </Badge>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            How{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              StreamLn flows
            </span>
          </h2>

          <p className="mt-8 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Think, plan, and execute on a flexible 2D canvas. StreamLn combines
            visual organization with powerful dev tools in one unified workspace
            that adapts to your natural workflow.
          </p>
        </div>

        {/* Workflow steps grid - 3 columns on large screens */}
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting arrow between steps - only visible on large screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                  <ArrowRight className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
              )}

              {/* Step card with hover animations and cosmic effects */}
              <Card
                className={`group relative overflow-hidden backdrop-blur-xl p-8 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cosmos-cosmic-light/10 dark:bg-cosmos-surface/30 bg-white/40 dark:border-cosmos-cosmic-light/20 border-cosmos-cosmic-light/30 dark:hover:border-cosmos-cosmic-light/40 hover:border-cosmos-cosmic-light/50 dark:hover:bg-cosmos-surface/50 hover:bg-white/70 ${step.borderColor} ${step.hoverBorderColor}`}
              >
                {/* Cosmic glow effect that appears on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-cosmic-light/5 via-transparent to-cosmos-star-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Large step number in background */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-cosmos-cosmic-light/30 dark:text-cosmos-cosmic-light/25 group-hover:text-cosmos-cosmic-light/40 dark:group-hover:text-cosmos-cosmic-light/35 transition-all duration-500">
                  {step.step}
                </div>

                {/* Card content */}
                <div className="relative z-10">
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

                  {/* Step description with color transition on hover */}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 mb-6">
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
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Move className="w-4 h-4" />
            <span className="text-sm font-medium">
              Drag, drop, and organize your way
            </span>
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
