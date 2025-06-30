import FeatureCard from "@/components/FeatureCard";
import { FileText, Kanban, Search, Network, Brain } from "lucide-react";

export default function FeaturesSection() {
  const mainFeatures = [
    {
      title: "Smart Notes",
      description:
        "Rich markdown + code editor with tagging and linking. Inline summarization from PDFs and transcripts.",
      icon: <FileText size={24} />,
      highlight: "Tiptap Editor",
    },
    {
      title: "Task Boards",
      description:
        "Visual Kanban boards with drag-and-drop functionality. Link tasks to notes, add metadata, and organize visually.",
      icon: <Kanban size={24} />,
      highlight: "Drag & Drop",
    },
    {
      title: "Semantic Search",
      description:
        "Natural language search across all notes and tasks. Filter by tags, links, or content type.",
      icon: <Search size={24} />,
      highlight: "AI-Powered",
    },
  ];

  const additionalFeatures = [
    {
      title: "Knowledge Graph",
      description:
        "Visualize how notes, tasks, and tags connect. Interactive graph view powered by React Flow.",
      icon: <Network size={24} />,
      highlight: "React Flow",
    },
    {
      title: "AI Copilot",
      description:
        "Optional sidebar assistant to retrieve related notes, summarize content, and navigate contextually.",
      icon: <Brain size={24} />,
      highlight: "GPT-4 Powered",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              plan, document, and execute
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            StreamLn combines smart note-taking, visual task management, and AI
            assistance in a single developer-focused workspace.
          </p>
        </div>

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

        {/* Additional Features Row */}
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
      </div>
    </section>
  );
}
