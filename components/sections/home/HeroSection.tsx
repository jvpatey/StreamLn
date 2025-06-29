import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Beta badge */}
          <Badge variant="default" className="mb-6">
            🚀 Developer Productivity Platform
          </Badge>

          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              CodexFlow
            </span>
          </h1>
          <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Your second brain for code, tasks, and technical clarity
          </p>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Smart technical notes, visual task boards, and lightweight AI
            assistance combined into one interface. Built for solo devs and
            small teams who need structure and clarity.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="default" size="lg">
              Start Planning & Building
            </Button>
            <Button variant="link" className="leading-6">
              View Demo →
            </Button>
          </div>

          {/* Feature hints */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              Smart Notes
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-500" />
              Task Boards
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              AI Copilot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
