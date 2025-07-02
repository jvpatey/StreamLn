import FeatureCard from "@/components/FeatureCard";
import {
  Move,
  ZoomIn,
  Layers,
  FileText,
  Search,
  Network,
  Brain,
  Maximize2,
  Link,
  Sparkles,
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
        "Move notes, tasks, and content blocks freely across your canvas. Resize, collapse, and arrange with intuitive gestures.",
      icon: <Move size={24} />,
      highlight: "Visual Organization",
    },
    {
      title: "Rich Content Blocks",
      description:
        "Create notes with markdown, code blocks, and images. Each block is collapsible, movable, and supports bidirectional linking.",
      icon: <FileText size={24} />,
      highlight: "Tiptap Powered",
    },
  ];

  // Secondary features displayed in 2-column grid
  const additionalFeatures = [
    {
      title: "Visual Task Management",
      description:
        "Create task boards directly on your canvas. Drag tasks between columns and link them to related notes and content.",
      icon: <Maximize2 size={24} />,
      highlight: "Canvas Native",
    },
    {
      title: "Smart Connections",
      description:
        "Bidirectional linking between notes and automatic relationship discovery. Visualize connections with interactive knowledge graphs.",
      icon: <Link size={24} />,
      highlight: "AI Enhanced",
    },
  ];

  // Tertiary features displayed in 3-column grid
  const powerFeatures = [
    {
      title: "Semantic Search",
      description:
        "Find related content across your entire canvas with natural language search. Filter by tags, content type, or spatial location.",
      icon: <Search size={24} />,
      highlight: "Context Aware",
    },
    {
      title: "Knowledge Graph",
      description:
        "Visualize how your notes, tasks, and tags connect. Interactive graph powered by React Flow for exploration.",
      icon: <Network size={24} />,
      highlight: "React Flow",
    },
    {
      title: "AI Copilot",
      description:
        "Optional sidebar assistant that understands your canvas context. Retrieve related content and navigate spatially.",
      icon: <Brain size={24} />,
      highlight: "GPT-4 Powered",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with gradient text */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            Canvas{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              superpowers
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Everything you need to think, plan, and execute on a flexible visual
            workspace designed specifically for developers.
          </p>
        </div>

        {/* Main features grid - 3 columns on large screens */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              highlight={feature.highlight}
            />
          ))}
        </div>

        {/* Additional features grid - 2 columns on large screens */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          {additionalFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              highlight={feature.highlight}
            />
          ))}
        </div>

        {/* Power features grid - 3 columns on large screens */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {powerFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              highlight={feature.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
