import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* Beta badge */}
          <Badge
            variant="secondary"
            className="group mb-6 bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 px-4 py-2 text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2 text-primary group-hover:text-primary transition-colors duration-200 group-hover:rotate-12 group-hover:scale-110" />
            Developer Productivity Platform
          </Badge>

          {/* Enhanced Logo Design */}
          <div className="relative mb-8">
            {/* Main logo text */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
                  Codex
                </span>
                <span className="bg-gradient-to-r from-accent-500 via-accent-400 to-primary-500 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000 delay-100">
                  Flow
                </span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-2xl -z-10 animate-pulse" />
              </span>
            </h1>

            {/* Integrated subtext */}
            <div className="mt-2 relative">
              <p className="text-sm font-medium tracking-wide text-muted-foreground/80 animate-in fade-in-50 duration-1000 delay-300">
                One workspace for tasks, notes, and flow.
              </p>
              {/* Decorative line */}
              <div className="mx-auto mt-3 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent animate-in fade-in-50 duration-1000 delay-500" />
            </div>
          </div>

          {/* Main tagline */}
          <p className="text-xl font-medium text-foreground/90 sm:text-2xl animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 delay-700">
            Your second brain for code, tasks, and technical clarity
          </p>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 delay-900">
            Smart technical notes, visual task boards, and lightweight AI
            assistance combined into one interface. Built for solo devs and
            small teams who need structure and clarity.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 delay-1100">
            <Button variant="default" size="lg">
              Start Planning & Building
            </Button>
            <Button variant="link" className="leading-6">
              View Demo →
            </Button>
          </div>

          {/* Feature hints */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in fade-in-50 duration-1000 delay-1300">
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
