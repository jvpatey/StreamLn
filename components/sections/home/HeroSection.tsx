import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center">
      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* Beta badge */}
          <Badge
            variant="gradient"
            className="group mb-6 px-4 py-2 text-sm font-medium"
          >
            <Rocket className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
            Developer Productivity Platform
          </Badge>

          {/* Enhanced Logo Design */}
          <div className="relative mb-8 group cursor-pointer">
            {/* Main logo text */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                  StreamLn
                </span>
                {/* Glow effect */}
                <span className="pointer-events-none absolute -inset-6 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300 select-none">
                  StreamLn
                </span>
              </span>
            </h1>

            {/* Integrated subtext */}
            <div className="mt-2 relative">
              <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
                One workspace for tasks, notes, and flow.
              </p>
              {/* Decorative line */}
              <div className="mx-auto mt-3 w-72 h-1 flex justify-center items-center">
                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] w-36 group-hover:w-72 group-hover:via-primary-500" />
              </div>
            </div>
          </div>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Smart technical notes, visual task boards, and lightweight AI
            assistance streamlined into one interface. Built for solo devs and
            small teams who need structure and clarity.
          </p>

          {/* CTA button */}
          <div className="mt-10 flex items-center justify-center">
            <Button
              variant="gradient"
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Workspace</span>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </div>

          {/* Feature hints */}
          <div className="mt-16 flex items-center justify-center gap-12 text-base text-muted-foreground">
            <span className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="relative h-3 w-3 rounded-full bg-primary-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:shadow-primary-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              Smart Notes
            </span>
            <span className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="relative h-3 w-3 rounded-full bg-accent-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:shadow-accent-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              Task Boards
            </span>
            <span className="group flex items-center gap-3 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="relative h-3 w-3 rounded-full bg-primary-500 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:shadow-primary-500/50">
                <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              AI Copilot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
